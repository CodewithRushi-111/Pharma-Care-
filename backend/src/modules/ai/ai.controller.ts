import { Request, Response, NextFunction } from 'express';
import { AiService } from './ai.service';
import { ResponseHelper } from '../../helpers/response.helper';
import { HTTP_STATUS } from '../../constants';

export class AiController {
  public static async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await AiService.processChatMessage(userId, req.body);
      ResponseHelper.success(res, result, 'AI response generated.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async checkDrugInteractions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AiService.checkDrugInteractions(req.body);
      ResponseHelper.success(res, result, 'Drug interaction analysis complete.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async symptomTriage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await AiService.performSymptomTriage(userId, req.body);
      ResponseHelper.success(res, result, 'Symptom triage assessment complete.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
