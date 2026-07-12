import { z } from 'zod';
import { TriageLevel } from '../../constants';

export const AiChatSchema = z.object({
  body: z.object({
    conversationId: z.string().uuid().optional(),
    message: z.string().min(2, 'Message text is required.').max(2000, 'Message exceeds maximum length.'),
    contextType: z.enum(['GENERAL_TRIAGE', 'DRUG_EXPLANATION', 'EMERGENCY_CHECK']).default('GENERAL_TRIAGE'),
  }),
});

export const DrugInteractionCheckSchema = z.object({
  body: z.object({
    medicineIds: z.array(z.string().uuid()).min(2, 'Provide at least two medicines to check interaction.'),
  }),
});

export const SymptomTriageSchema = z.object({
  body: z.object({
    symptoms: z.array(z.string()).min(1, 'Please select or enter at least one symptom.'),
    durationDays: z.number().int().min(0).optional(),
    severity: z.enum(['MILD', 'MODERATE', 'SEVERE']).default('MODERATE'),
    additionalNotes: z.string().optional(),
  }),
});

export type AiChatDto = z.infer<typeof AiChatSchema>['body'];
export type DrugInteractionCheckDto = z.infer<typeof DrugInteractionCheckSchema>['body'];
export type SymptomTriageDto = z.infer<typeof SymptomTriageSchema>['body'];
