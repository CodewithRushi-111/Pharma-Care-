import { prisma } from '../../prisma/client';
import { Prisma } from '@prisma/client';
import { MedicineSearchDto } from './pharmacy.dto';

export class PharmacyRepository {
  public static async searchMedicines(dto: MedicineSearchDto) {
    const where: Prisma.MedicineWhereInput = {
      deletedAt: null,
    };

    if (dto.q) {
      where.OR = [
        { genericName: { contains: dto.q, mode: 'insensitive' } },
        { brandName: { contains: dto.q, mode: 'insensitive' } },
        { sku: { equals: dto.q } },
        { barcode: { equals: dto.q } },
      ];
    }

    if (dto.category) {
      where.category = {
        OR: [{ slug: dto.category }, { id: dto.category }],
      };
    }

    if (dto.requiresPrescription !== undefined) {
      where.requiresPrescription = dto.requiresPrescription;
    }

    if (dto.minPrice !== undefined || dto.maxPrice !== undefined) {
      where.mrp = {};
      if (dto.minPrice !== undefined) where.mrp.gte = dto.minPrice;
      if (dto.maxPrice !== undefined) where.mrp.lte = dto.maxPrice;
    }

    let orderBy: Prisma.MedicineOrderByWithRelationInput = {};
    if (dto.sortBy === 'price_asc') orderBy = { mrp: 'asc' };
    else if (dto.sortBy === 'price_desc') orderBy = { mrp: 'desc' };
    else if (dto.sortBy === 'name_asc') orderBy = { brandName: 'asc' };
    else orderBy = { createdAt: 'desc' };

    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      prisma.medicine.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          manufacturer: { select: { name: true } },
          inventory: { select: { totalQuantity: true, reservedQuantity: true, storeId: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.medicine.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  public static async findMedicineById(id: string) {
    return prisma.medicine.findUnique({
      where: { id },
      include: {
        category: true,
        manufacturer: true,
        inventory: true,
        primarySubstitutes: {
          include: {
            substituteMedicine: {
              include: { manufacturer: true },
            },
          },
        },
      },
    });
  }

  public static async getCartByUserId(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            medicine: {
              include: {
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              medicine: {
                include: { inventory: true },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  public static async upsertCartItem(cartId: string, medicineId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: {
        cartId_medicineId: { cartId, medicineId },
      },
      update: { quantity },
      create: { cartId, medicineId, quantity },
    });
  }

  public static async deleteCartItem(cartId: string, medicineId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId, medicineId },
    });
  }

  public static async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  public static async createPrescriptionUpload(data: {
    patientId: string;
    fileUrl: string;
    ocrExtractedText?: string;
  }) {
    return prisma.prescriptionUpload.create({
      data: {
        patientId: data.patientId,
        fileUrl: data.fileUrl,
        ocrExtractedText: data.ocrExtractedText,
        status: 'PENDING',
      },
    });
  }

  public static async createOrderTransaction(data: {
    orderNumber: string;
    patientId: string;
    storeId: string;
    prescriptionUploadId?: string;
    deliveryAddressId: string;
    totalMrp: number;
    discountAmount: number;
    taxAmount: number;
    finalAmount: number;
    items: {
      medicineId: string;
      batchId: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
    cartId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber: data.orderNumber,
          patientId: data.patientId,
          storeId: data.storeId,
          prescriptionUploadId: data.prescriptionUploadId,
          deliveryAddressId: data.deliveryAddressId,
          totalMrp: data.totalMrp,
          discountAmount: data.discountAmount,
          taxAmount: data.taxAmount,
          finalAmount: data.finalAmount,
          orderStatus: data.prescriptionUploadId ? 'PENDING_PRESCRIPTION' : 'PROCESSING',
          items: {
            create: data.items.map((item) => ({
              medicineId: item.medicineId,
              batchId: item.batchId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
        },
        include: { items: true },
      });

      // Deduct Inventory & Batch Stock
      for (const item of data.items) {
        await tx.medicineBatch.update({
          where: { id: item.batchId },
          data: { quantity: { decrement: item.quantity } },
        });

        const batch = await tx.medicineBatch.findUnique({ where: { id: item.batchId } });
        if (batch) {
          await tx.inventory.update({
            where: { id: batch.inventoryId },
            data: {
              totalQuantity: { decrement: item.quantity },
              reservedQuantity: { increment: item.quantity },
            },
          });
        }
      }

      // Clear Cart
      await tx.cartItem.deleteMany({ where: { cartId: data.cartId } });

      return order;
    });
  }
}
