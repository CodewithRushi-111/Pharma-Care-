import { Response } from 'express';
import { HTTP_STATUS } from '../constants';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
  timestamp: string;
}

export class ResponseHelper {
  public static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = HTTP_STATUS.OK
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(response);
  }

  public static error(
    res: Response,
    code: string,
    message: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST,
    details?: any[]
  ): Response {
    const response: ApiResponse = {
      success: false,
      statusCode,
      error: {
        code,
        message,
        details: details || [],
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(response);
  }
}
