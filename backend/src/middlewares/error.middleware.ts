import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../helpers/response.helper';
import { AppError } from '../helpers/error.helper';
import { HTTP_STATUS, ERROR_CODES } from '../constants';
import { logger } from '../logger';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`[${req.method} ${req.originalUrl}] Error: ${err.message || err}`, {
    stack: err.stack,
    body: req.body,
    user: req.user?.id,
  });

  if (err instanceof AppError) {
    ResponseHelper.error(
      res,
      err.code,
      err.message,
      err.statusCode,
      err.details
    );
    return;
  }

  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    ResponseHelper.error(
      res,
      ERROR_CODES.VALIDATION_ERROR,
      'Request validation failed. Please check the provided input fields.',
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      details
    );
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || ['unknown field'];
      ResponseHelper.error(
        res,
        ERROR_CODES.DUPLICATE_ENTRY,
        `Duplicate record error: A record with this '${target.join(', ')}' already exists.`,
        HTTP_STATUS.CONFLICT
      );
      return;
    }
    if (err.code === 'P2025') {
      ResponseHelper.error(
        res,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        'Requested resource was not found in the database.',
        HTTP_STATUS.NOT_FOUND
      );
      return;
    }
  }

  ResponseHelper.error(
    res,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred on the server. Our engineering team has been notified.'
      : err.message || 'Internal Server Error',
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};
