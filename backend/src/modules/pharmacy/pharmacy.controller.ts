import { Request, Response, NextFunction } from 'express';
import { PharmacyService } from './pharmacy.service';
import { ResponseHelper } from '../../helpers/response.helper';
import { HTTP_STATUS } from '../../constants';
import { prisma } from '../../prisma/client';

export class PharmacyController {
  public static async searchMedicines(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PharmacyService.searchMedicines(req.query as any);
      ResponseHelper.success(res, result, 'Medicines fetched successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async getMedicineById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PharmacyService.getMedicineDetails(req.params.id);
      ResponseHelper.success(res, result, 'Medicine details fetched successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await PharmacyService.getCart(userId);
      ResponseHelper.success(res, result, 'Shopping cart fetched successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await PharmacyService.addToCart(userId, req.body);
      ResponseHelper.success(res, result, 'Item added to shopping cart.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async updateCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await PharmacyService.updateCartItem(userId, req.params.medicineId, req.body);
      ResponseHelper.success(res, result, 'Shopping cart updated.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async uploadPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await PharmacyService.uploadPrescription(userId, req.file?.buffer);
      ResponseHelper.success(res, result, 'Prescription uploaded and queued for verification.', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  public static async checkoutOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await PharmacyService.checkoutOrder(userId, req.body);
      ResponseHelper.success(res, result, 'Order checked out successfully.', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  public static async getStores(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await prisma.pharmacyStore.findMany({ where: { isActive: true } });
      ResponseHelper.success(res, result, 'Stores fetched successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async getAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) {
        ResponseHelper.success(res, [], 'No patient profile found.', HTTP_STATUS.OK);
        return;
      }
      const result = await prisma.address.findMany({ where: { patientId: patient.id } });
      ResponseHelper.success(res, result, 'Addresses fetched successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
