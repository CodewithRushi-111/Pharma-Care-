import { Router } from 'express';
import { AdminController } from './admin.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRole } from '../../middlewares/role.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import { UserRole } from '../../constants';
import {
  VerifyDoctorSchema,
  VerifyPrescriptionSchema,
  CreateMedicineSchema,
  UpdateOrderStatusSchema,
  CreateCouponSchema,
} from './admin.dto';

const router = Router();

// All routes require authentication and Admin role
router.use(authenticate, authorizeRole(UserRole.PLATFORM_ADMIN, UserRole.PHARMACY_ADMIN));

router.get('/dashboard-stats', AdminController.getStats);

router.patch(
  '/doctors/:doctorId/verify',
  requirePermission('DOCTOR:VERIFY'),
  validate(VerifyDoctorSchema),
  AdminController.verifyDoctor
);

router.patch(
  '/prescriptions/:prescriptionUploadId/verify',
  requirePermission('PRESCRIPTION:VERIFY'),
  validate(VerifyPrescriptionSchema),
  AdminController.verifyPrescription
);

router.post(
  '/medicines',
  requirePermission('CATALOG:MANAGE'),
  validate(CreateMedicineSchema),
  AdminController.addMedicine
);

router.patch(
  '/orders/:orderId/status',
  requirePermission('ORDER:FULFILL'),
  validate(UpdateOrderStatusSchema),
  AdminController.updateOrder
);

router.post(
  '/coupons',
  requirePermission('COUPON:MANAGE'),
  validate(CreateCouponSchema),
  AdminController.createCoupon
);

router.get(
  '/audit-logs',
  requirePermission('AI:LOG_VIEW'),
  AdminController.getLogs
);

export default router;
