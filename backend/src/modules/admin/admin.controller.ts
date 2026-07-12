import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { ResponseHelper } from '../../helpers/response.helper';
import { HTTP_STATUS } from '../../constants';

export class AdminController {
  public static async verifyDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.id;
      const result = await AdminService.verifyDoctor(adminUserId, req.params.doctorId, req.body);
      ResponseHelper.success(res, result, 'Doctor verification status updated.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async verifyPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.id;
      const result = await AdminService.verifyPrescription(adminUserId, req.params.prescriptionUploadId, req.body);
      ResponseHelper.success(res, result, 'Prescription verification status updated.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async addMedicine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.id;
      const result = await AdminService.addMedicineCatalogItem(adminUserId, req.body);
      ResponseHelper.success(res, result, 'Medicine added to catalog successfully.', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  public static async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.id;
      const result = await AdminService.updateOrderState(adminUserId, req.params.orderId, req.body);
      ResponseHelper.success(res, result, 'Order status transitioned successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async createCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user!.id;
      const result = await AdminService.createCoupon(adminUserId, req.body);
      ResponseHelper.success(res, result, 'Coupon created successfully.', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  public static async getLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const result = await AdminService.getSystemLogs(limit);
      ResponseHelper.success(res, result, 'System audit logs fetched.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async getStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AdminService.getDashboardStats();
      ResponseHelper.success(res, result, 'Admin dashboard statistics fetched.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
