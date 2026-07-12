import { z } from 'zod';

export const MedicineSearchSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    requiresPrescription: z.string().optional().transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
    minPrice: z.string().optional().transform((v) => (v ? parseFloat(v) : undefined)),
    maxPrice: z.string().optional().transform((v) => (v ? parseFloat(v) : undefined)),
    sortBy: z.enum(['price_asc', 'price_desc', 'name_asc', 'popular']).optional().default('popular'),
    page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 20)),
  }),
});

export const AddToCartSchema = z.object({
  body: z.object({
    medicineId: z.string().uuid('Invalid medicine ID.'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1.').max(50, 'Max 50 units allowed per item.'),
  }),
});

export const UpdateCartItemSchema = z.object({
  params: z.object({
    medicineId: z.string().uuid('Invalid medicine ID.'),
  }),
  body: z.object({
    quantity: z.number().int().min(0, 'Quantity cannot be negative.'),
  }),
});

export const UploadPrescriptionSchema = z.object({
  body: z.object({
    notes: z.string().optional(),
  }),
});

export const CreateOrderSchema = z.object({
  body: z.object({
    storeId: z.string().uuid('Invalid store ID.'),
    deliveryAddressId: z.string().uuid('Invalid delivery address ID.'),
    prescriptionUploadId: z.string().uuid('Invalid prescription ID.').optional(),
    couponCode: z.string().optional(),
    paymentMethod: z.enum(['CARD', 'UPI', 'NETBANKING', 'COD']).default('CARD'),
  }),
});

export type MedicineSearchDto = z.infer<typeof MedicineSearchSchema>['query'];
export type AddToCartDto = z.infer<typeof AddToCartSchema>['body'];
export type UpdateCartItemDto = z.infer<typeof UpdateCartItemSchema>['body'];
export type CreateOrderDto = z.infer<typeof CreateOrderSchema>['body'];
