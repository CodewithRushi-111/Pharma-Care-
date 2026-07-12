import { z } from 'zod';

export const VerifyDoctorSchema = z.object({
  params: z.object({
    doctorId: z.string().uuid('Invalid doctor ID.'),
  }),
  body: z.object({
    status: z.enum(['VERIFIED', 'REJECTED']),
    rejectionReason: z.string().optional(),
  }),
});

export const VerifyPrescriptionSchema = z.object({
  params: z.object({
    prescriptionUploadId: z.string().uuid('Invalid prescription upload ID.'),
  }),
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED']),
    rejectionReason: z.string().optional(),
  }),
});

export const CreateMedicineSchema = z.object({
  body: z.object({
    sku: z.string().min(3),
    genericName: z.string().min(2),
    brandName: z.string().min(2),
    categoryId: z.string().uuid(),
    manufacturerId: z.string().uuid(),
    dosageForm: z.string().min(2),
    strength: z.string().min(1),
    scheduleType: z.enum(['OTC', 'Schedule H', 'Schedule X']).default('OTC'),
    requiresPrescription: z.boolean().default(false),
    mrp: z.number().positive(),
    barcode: z.string().optional(),
    imageUrls: z.array(z.string().url()).optional().default([]),
  }),
});

export const UpdateOrderStatusSchema = z.object({
  params: z.object({
    orderId: z.string().uuid('Invalid order ID.'),
  }),
  body: z.object({
    orderStatus: z.enum([
      'PENDING_PRESCRIPTION',
      'PRESCRIPTION_VERIFIED',
      'PROCESSING',
      'DISPATCHED',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
      'RETURNED',
    ]),
    trackingNumber: z.string().optional(),
  }),
});

export const CreateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3).toUpperCase(),
    discountType: z.enum(['PERCENTAGE', 'FLAT']),
    value: z.number().positive(),
    minOrderValue: z.number().min(0).default(0),
    maxDiscountAmount: z.number().positive().optional(),
    validFrom: z.string().transform((v) => new Date(v)),
    validUntil: z.string().transform((v) => new Date(v)),
    usageLimit: z.number().int().positive().default(1000),
  }),
});

export type VerifyDoctorDto = z.infer<typeof VerifyDoctorSchema>['body'];
export type VerifyPrescriptionDto = z.infer<typeof VerifyPrescriptionSchema>['body'];
export type CreateMedicineDto = z.infer<typeof CreateMedicineSchema>['body'];
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>['body'];
export type CreateCouponDto = z.infer<typeof CreateCouponSchema>['body'];
