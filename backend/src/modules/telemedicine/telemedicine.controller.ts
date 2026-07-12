import { Request, Response, NextFunction } from 'express';
import { TelemedicineService } from './telemedicine.service';
import { ResponseHelper } from '../../helpers/response.helper';
import { HTTP_STATUS } from '../../constants';

export class TelemedicineController {
  public static async searchDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await TelemedicineService.searchDoctors(req.query as any);
      ResponseHelper.success(res, result, 'Doctors fetched successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async getDoctorById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await TelemedicineService.getDoctorById(req.params.id);
      ResponseHelper.success(res, result, 'Doctor details fetched successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async bookAppointment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await TelemedicineService.bookAppointment(userId, req.body);
      ResponseHelper.success(res, result, 'Appointment booked successfully.', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  public static async generateVideoToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await TelemedicineService.generateVideoToken(userId, req.params.appointmentId);
      ResponseHelper.success(res, result, 'Video consultation signaling token generated.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async completeConsultation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorUserId = req.user!.id;
      const result = await TelemedicineService.completeConsultation(doctorUserId, req.params.appointmentId, req.body);
      ResponseHelper.success(res, result, 'Consultation completed and digital prescription issued.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
