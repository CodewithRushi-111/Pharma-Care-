import { PharmacyRepository } from './pharmacy.repository';
import { MedicineSearchDto, AddToCartDto, UpdateCartItemDto, CreateOrderDto } from './pharmacy.dto';
import { AppError } from '../../helpers/error.helper';
import { HTTP_STATUS, ERROR_CODES } from '../../constants';
import { redis, CryptoHelper } from '../../utils';
import { logger } from '../../logger';
import { CloudinaryHelper } from '../../middlewares/upload.middleware';
import { prisma } from '../../prisma/client';

export class PharmacyService {
  public static async searchMedicines(dto: MedicineSearchDto) {
    const cacheKey = `catalog:search:${JSON.stringify(dto)}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await PharmacyRepository.searchMedicines(dto);
    await redis.setex(cacheKey, 600, JSON.stringify(result)); // Cache for 10 minutes
    return result;
  }

  public static async getMedicineDetails(id: string) {
    const medicine = await PharmacyRepository.findMedicineById(id);
    if (!medicine) {
      throw new AppError(
        'Medicine catalog item not found.',
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND
      );
    }
    return medicine;
  }

  public static async getCart(userId: string) {
    return PharmacyRepository.getCartByUserId(userId);
  }

  public static async addToCart(userId: string, dto: AddToCartDto) {
    const medicine = await PharmacyRepository.findMedicineById(dto.medicineId);
    if (!medicine) {
      throw new AppError('Medicine not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    const totalAvailable = medicine.inventory.reduce((sum, inv) => sum + inv.totalQuantity, 0);
    if (totalAvailable < dto.quantity) {
      throw new AppError(
        `Insufficient stock. Only ${totalAvailable} units currently available across stores.`,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.INSUFFICIENT_INVENTORY
      );
    }

    const cart = await PharmacyRepository.getCartByUserId(userId);
    await PharmacyRepository.upsertCartItem(cart.id, dto.medicineId, dto.quantity);

    return PharmacyRepository.getCartByUserId(userId);
  }

  public static async updateCartItem(userId: string, medicineId: string, dto: UpdateCartItemDto) {
    const cart = await PharmacyRepository.getCartByUserId(userId);
    if (dto.quantity === 0) {
      await PharmacyRepository.deleteCartItem(cart.id, medicineId);
    } else {
      await PharmacyRepository.upsertCartItem(cart.id, medicineId, dto.quantity);
    }
    return PharmacyRepository.getCartByUserId(userId);
  }

  public static async uploadPrescription(patientId: string, fileBuffer?: Buffer) {
    if (!fileBuffer) {
      throw new AppError('Prescription file image or PDF is required.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    // Upload via Cloudinary
    const uploadResult = await CloudinaryHelper.uploadBuffer(fileBuffer, 'prescriptions', `RX-${patientId}-${Date.now()}`);

    // Simulated OCR extraction text
    const mockOcrText = `PATIENT: ${patientId}\nPRESCRIBED: Telma 40mg (1-0-1)\nDOCTOR: Dr. A. Sharma (MBBS)`;

    const record = await PharmacyRepository.createPrescriptionUpload({
      patientId,
      fileUrl: uploadResult.url,
      ocrExtractedText: mockOcrText,
    });

    return record;
  }

  public static async checkoutOrder(userId: string, dto: CreateOrderDto) {
    const patient = await prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      throw new AppError('Patient profile required for checkout.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const cart = await PharmacyRepository.getCartByUserId(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new AppError('Shopping cart is empty.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    let requiresPrescription = false;
    let totalMrp = 0;
    const orderItemsPayload: any[] = [];

    // Check inventory and lock
    const lockKeys: string[] = [];
    try {
      for (const item of cart.items) {
        if (item.medicine.requiresPrescription) {
          requiresPrescription = true;
        }

        const batches = await prisma.medicineBatch.findMany({
          where: {
            inventory: { storeId: dto.storeId, medicineId: item.medicineId },
            quantity: { gte: item.quantity },
          },
          orderBy: { expiryDate: 'asc' }, // FIFO: First Expiry First Out
        });

        if (batches.length === 0) {
          throw new AppError(
            `Medicine '${item.medicine.brandName}' is out of stock or has insufficient quantity at the selected pharmacy store.`,
            HTTP_STATUS.CONFLICT,
            ERROR_CODES.INSUFFICIENT_INVENTORY
          );
        }

        const allocatedBatch = batches[0];
        const lockKey = `lock:inventory:batch:${allocatedBatch.id}`;
        const acquired = await redis.set(lockKey, userId, 'EX', 10, 'NX');
        if (!acquired) {
          throw new AppError(
            `High demand for '${item.medicine.brandName}'. Inventory lock currently busy. Please retry checkout in 5 seconds.`,
            HTTP_STATUS.CONFLICT,
            ERROR_CODES.RATE_LIMIT_EXCEEDED
          );
        }
        lockKeys.push(lockKey);

        const itemTotal = Number(item.medicine.mrp) * item.quantity;
        totalMrp += itemTotal;
        orderItemsPayload.push({
          medicineId: item.medicineId,
          batchId: allocatedBatch.id,
          quantity: item.quantity,
          unitPrice: Number(item.medicine.mrp),
          totalPrice: itemTotal,
        });
      }

      if (requiresPrescription && !dto.prescriptionUploadId) {
        throw new AppError(
          'Your cart contains Schedule H regulated prescription medicines. Please upload and attach a verified digital prescription before checking out.',
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.PRESCRIPTION_REQUIRED
        );
      }

      let discountAmount = 0;
      if (dto.couponCode) {
        const coupon = await prisma.coupon.findUnique({ where: { code: dto.couponCode } });
        if (coupon && coupon.validUntil > new Date() && totalMrp >= Number(coupon.minOrderValue)) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (totalMrp * Number(coupon.value)) / 100;
            if (coupon.maxDiscountAmount && discountAmount > Number(coupon.maxDiscountAmount)) {
              discountAmount = Number(coupon.maxDiscountAmount);
            }
          } else {
            discountAmount = Number(coupon.value);
          }
        }
      }

      const taxAmount = (totalMrp - discountAmount) * 0.12; // 12% GST
      const finalAmount = Number((totalMrp - discountAmount + taxAmount).toFixed(2));
      const orderNumber = CryptoHelper.generateOrderNumber();

      const order = await PharmacyRepository.createOrderTransaction({
        orderNumber,
        patientId: patient.id,
        storeId: dto.storeId,
        prescriptionUploadId: dto.prescriptionUploadId,
        deliveryAddressId: dto.deliveryAddressId,
        totalMrp: Number(totalMrp.toFixed(2)),
        discountAmount: Number(discountAmount.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        finalAmount,
        items: orderItemsPayload,
        cartId: cart.id,
      });

      // Create Payment entry
      const payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          gatewayName: dto.paymentMethod === 'COD' ? 'CASH_ON_DELIVERY' : 'STRIPE',
          transactionId: `TXN-${Date.now()}`,
          amount: finalAmount,
          currency: 'INR',
          status: dto.paymentMethod === 'COD' ? 'SUCCESS' : 'PENDING',
          paymentMethod: dto.paymentMethod,
        },
      });

      logger.info(`📦 Order successfully created: ${orderNumber} for Patient ${patient.id} (Total: ₹${finalAmount})`);

      return {
        order,
        payment,
      };
    } finally {
      // Release all acquired Redis inventory locks
      for (const key of lockKeys) {
        await redis.del(key);
      }
    }
  }
}
