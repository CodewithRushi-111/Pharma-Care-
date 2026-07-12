import { prisma } from '../../prisma/client';
import { CreateMedicineDto, CreateCouponDto } from './admin.dto';

export class AdminRepository {
  public static async verifyDoctorStatus(doctorId: string, status: string, rejectionReason?: string) {
    return prisma.doctor.update({
      where: { id: doctorId },
      data: { verificationStatus: status },
      include: { user: true },
    });
  }

  public static async verifyPrescriptionStatus(
    prescriptionUploadId: string,
    status: string,
    adminId: string,
    rejectionReason?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const upload = await tx.prescriptionUpload.update({
        where: { id: prescriptionUploadId },
        data: { status, verifiedByAdminId: adminId, rejectionReason },
      });

      if (status === 'APPROVED') {
        // Automatically transition orders linked to this prescription from PENDING_PRESCRIPTION to PRESCRIPTION_VERIFIED
        await tx.order.updateMany({
          where: { prescriptionUploadId, orderStatus: 'PENDING_PRESCRIPTION' },
          data: { orderStatus: 'PRESCRIPTION_VERIFIED' },
        });
      }

      return upload;
    });
  }

  public static async createMedicineCatalogItem(dto: CreateMedicineDto) {
    return prisma.medicine.create({
      data: {
        sku: dto.sku,
        genericName: dto.genericName,
        brandName: dto.brandName,
        categoryId: dto.categoryId,
        manufacturerId: dto.manufacturerId,
        dosageForm: dto.dosageForm,
        strength: dto.strength,
        scheduleType: dto.scheduleType,
        requiresPrescription: dto.requiresPrescription,
        mrp: dto.mrp,
        barcode: dto.barcode,
        imageUrls: dto.imageUrls,
      },
    });
  }

  public static async updateOrder(orderId: string, orderStatus: string, trackingNumber?: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: orderStatus as any,
        trackingNumber: trackingNumber || undefined,
      },
      include: { patient: { include: { user: true } }, store: true },
    });
  }

  public static async createCouponCode(dto: CreateCouponDto) {
    return prisma.coupon.create({
      data: {
        code: dto.code,
        discountType: dto.discountType,
        value: dto.value,
        minOrderValue: dto.minOrderValue,
        maxDiscountAmount: dto.maxDiscountAmount,
        validFrom: dto.validFrom,
        validUntil: dto.validUntil,
        usageLimit: dto.usageLimit,
      },
    });
  }

  public static async getSystemLogs(limit: number = 50) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { email: true, role: true } } },
    });
  }

  public static async getDashboardStats() {
    const [totalUsers, totalDoctors, totalOrders, totalAiConversations, pendingPrescriptions] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.doctor.count({ where: { verificationStatus: 'VERIFIED' } }),
      prisma.order.count(),
      prisma.aiConversation.count(),
      prisma.prescriptionUpload.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalUsers,
      totalDoctors,
      totalOrders,
      totalAiConversations,
      pendingPrescriptions,
      timestamp: new Date().toISOString(),
    };
  }
}
