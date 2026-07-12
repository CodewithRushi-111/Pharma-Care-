import { Router } from 'express';
import { AiController } from './ai.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import { rateLimiter } from '../../middlewares/rateLimiter.middleware';
import {
  AiChatSchema,
  DrugInteractionCheckSchema,
  SymptomTriageSchema,
} from './ai.dto';

const router = Router();

// Rate limit AI chat to 20 requests per minute per user to protect token budget and quotas
const aiLimiter = rateLimiter({ windowMs: 60 * 1000, maxRequests: 20, keyPrefix: 'ratelimit:ai' });

router.post(
  '/chat',
  authenticate,
  aiLimiter,
  requirePermission('AI:CHAT'),
  validate(AiChatSchema),
  AiController.chat
);

router.post(
  '/drug-interactions',
  authenticate,
  validate(DrugInteractionCheckSchema),
  AiController.checkDrugInteractions
);

router.post(
  '/symptom-triage',
  authenticate,
  validate(SymptomTriageSchema),
  AiController.symptomTriage
);

export default router;
