import { Router } from 'express';
import { TelemedicineController } from './telemedicine.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import {
  DoctorSearchSchema,
  BookAppointmentSchema,
  CompleteConsultationSchema,
} from './telemedicine.dto';

const router = Router();

// Public doctor directory
router.get('/doctors', validate(DoctorSearchSchema), TelemedicineController.searchDoctors);
router.get('/doctors/:id', TelemedicineController.getDoctorById);

// Protected appointment & video session endpoints
router.post(
  '/appointments',
  authenticate,
  requirePermission('APPOINTMENT:BOOK'),
  validate(BookAppointmentSchema),
  TelemedicineController.bookAppointment
);

router.post(
  '/appointments/:appointmentId/video-token',
  authenticate,
  TelemedicineController.generateVideoToken
);

router.post(
  '/appointments/:appointmentId/complete',
  authenticate,
  requirePermission('CONSULTATION:CREATE'),
  validate(CompleteConsultationSchema),
  TelemedicineController.completeConsultation
);

export default router;
