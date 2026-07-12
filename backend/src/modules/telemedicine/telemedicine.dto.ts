import { z } from 'zod';

export const DoctorSearchSchema = z.object({
  query: z.object({
    specialization: z.string().optional(),
    maxFee: z.string().optional().transform((v) => (v ? parseFloat(v) : undefined)),
    sortBy: z.enum(['fee_asc', 'fee_desc', 'experience', 'rating']).optional().default('experience'),
    page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 20)),
  }),
});

export const BookAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().uuid('Invalid doctor ID.'),
    timeSlotId: z.string().uuid('Invalid time slot ID.'),
    appointmentType: z.enum(['VIDEO', 'IN_PERSON']).default('VIDEO'),
  }),
});

export const CompleteConsultationSchema = z.object({
  params: z.object({
    appointmentId: z.string().uuid('Invalid appointment ID.'),
  }),
  body: z.object({
    chiefComplaint: z.string().min(5, 'Chief complaint description is required.'),
    diagnosis: z.string().min(3, 'Diagnosis description is required.'),
    clinicalNotes: z.string().optional(),
    followUpDate: z.string().optional().transform((v) => (v ? new Date(v) : undefined)),
    prescriptionItems: z
      .array(
        z.object({
          medicineName: z.string().min(2),
          dosage: z.string(),
          frequency: z.string(),
          durationDays: z.number().int().min(1),
          instructions: z.string().optional(),
        })
      )
      .optional()
      .default([]),
  }),
});

export type DoctorSearchDto = z.infer<typeof DoctorSearchSchema>['query'];
export type BookAppointmentDto = z.infer<typeof BookAppointmentSchema>['body'];
export type CompleteConsultationDto = z.infer<typeof CompleteConsultationSchema>['body'];
