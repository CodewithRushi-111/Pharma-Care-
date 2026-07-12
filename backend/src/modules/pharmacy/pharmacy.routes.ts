import { Router } from 'express';
import { PharmacyController } from './pharmacy.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/permission.middleware';
import { upload } from '../../middlewares/upload.middleware';
import {
  MedicineSearchSchema,
  AddToCartSchema,
  UpdateCartItemSchema,
  CreateOrderSchema,
} from './pharmacy.dto';

const router = Router();

// Public catalog routes
router.get('/medicines', validate(MedicineSearchSchema), PharmacyController.searchMedicines);
router.get('/medicines/:id', PharmacyController.getMedicineById);

// Protected shopping cart & order checkout routes
router.get('/cart', authenticate, PharmacyController.getCart);
router.post('/cart/items', authenticate, validate(AddToCartSchema), PharmacyController.addToCart);
router.patch('/cart/items/:medicineId', authenticate, validate(UpdateCartItemSchema), PharmacyController.updateCartItem);

router.post(
  '/prescriptions/upload',
  authenticate,
  requirePermission('PRESCRIPTION:UPLOAD'),
  upload.single('file'),
  PharmacyController.uploadPrescription
);

router.post(
  '/orders/checkout',
  authenticate,
  requirePermission('ORDER:CREATE'),
  validate(CreateOrderSchema),
  PharmacyController.checkoutOrder
);

export default router;
