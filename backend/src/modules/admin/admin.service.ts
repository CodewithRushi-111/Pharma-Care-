import { AdminRepository } from './admin.repository';
import {
  VerifyDoctorDto,
  VerifyPrescriptionDto,
  CreateMedicineDto,
  UpdateOrderStatusDto,
  CreateCouponDto,
} from './admin.dto';
import { AppError } from '../../helpers/error.helper';
import { HTTP_STATUS, ERROR_CODES } from '../../constants';
import { redis } from '../../utils';
import { logger } from '../../logger';
import { prisma } from '../../prisma/client';

export class AdminService {
  public static async verifyDoctor(adminUserId: string, doctorId: string, dto: VerifyDoctorDto) {
    const result = await AdminRepository.verifyDoctorStatus(doctorId, dto.status, dto.rejectionReason);

    await prisma.auditLog.create({
      data: {
        action: `DOCTOR_${dto.status}`,
        entityType: 'Doctor',
        entityId: doctorId,
        userId: adminUserId,
        newValues: { status: dto.status, reason: dto.rejectionReason },
      },
    });

    logger.info(`👨‍⚕️ Doctor ${doctorId} status updated to ${dto.status} by Admin ${adminUserId}`);
    return result;
  }

  public static async verifyPrescription(adminUserId: string, prescriptionUploadId: string, dto: VerifyPrescriptionDto) {
    const result = await AdminRepository.verifyPrescriptionStatus(
      prescriptionUploadId,
      dto.status,
      adminUserId,
      dto.rejectionReason
    );

    await prisma.auditLog.create({
      data: {
        action: `PRESCRIPTION_${dto.status}`,
        entityType: 'PrescriptionUpload',
        entityId: prescriptionUploadId,
        userId: adminUserId,
        newValues: { status: dto.status, reason: dto.rejectionReason },
      },
    });

    logger.info(`📋 Prescription ${prescriptionUploadId} verified (${dto.status}) by Admin ${adminUserId}`);
    return result;
  }

  public static async addMedicineCatalogItem(adminUserId: string, dto: CreateMedicineDto) {
    const existing = await prisma.medicine.findUnique({ where: { sku: dto.sku } });
    if (existing) {
      throw new AppError('A medicine with this SKU already exists.', HTTP_STATUS.CONFLICT, ERROR_CODES.DUPLICATE_ENTRY);
    }

    const item = await AdminRepository.createMedicineCatalogItem(dto);

    // Invalidate search catalog cache keys
    const keys = await redis.keys('catalog:search:*');
    if (keys.length > 0) await redis.del(keys);

    await prisma.auditLog.create({
      data: {
        action: 'MEDICINE_CREATE',
        entityType: 'Medicine',
        entityId: item.id,
        userId: adminUserId,
      },
    });

    logger.info(`💊 New Medicine added to catalog: ${item.brandName} (${item.sku}) by Admin ${adminUserId}`);
    return item;
  }

  public static async updateOrderState(adminUserId: string, orderId: string, dto: UpdateOrderStatusDto) {
    const result = await AdminRepository.updateOrder(orderId, dto.orderStatus, dto.trackingNumber);

    await prisma.auditLog.create({
      data: {
        action: `ORDER_STATUS_UPDATE_${dto.orderStatus}`,
        entityType: 'Order',
        entityId: orderId,
        userId: adminUserId,
        newValues: { status: dto.orderStatus, tracking: dto.trackingNumber },
      },
    });

    logger.info(`🚚 Order ${orderId} transitioned to ${dto.orderStatus} by Admin ${adminUserId}`);
    return result;
  }

  public static async createCoupon(adminUserId: string, dto: CreateCouponDto) {
    const result = await AdminRepository.createCouponCode(dto);

    await prisma.auditLog.create({
      data: {
        action: 'COUPON_CREATE',
        entityType: 'Coupon',
        entityId: result.id,
        userId: adminUserId,
      },
    });

    return result;
  }

  public static async getSystemLogs(limit?: number) {
    return AdminRepository.getSystemLogs(limit || 50);
  }

  public static async getDashboardStats() {
    return AdminRepository.getDashboardStats();
  }
}
