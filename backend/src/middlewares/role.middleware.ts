import { Request, Response, NextFunction } from 'express';
import { AppError } from '../helpers/error.helper';
import { HTTP_STATUS, ERROR_CODES, UserRole } from '../constants';

export const authorizeRole = (...allowedRoles: (UserRole | string)[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        new AppError(
          'Authentication required before role verification.',
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.AUTHENTICATION_REQUIRED
        )
      );
    }

    if (req.user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access Denied. Required role(s): [${allowedRoles.join(', ')}]. Your current role is '${req.user.role}'.`,
          HTTP_STATUS.FORBIDDEN,
          ERROR_CODES.PERMISSION_DENIED
        )
      );
    }

    next();
  };
};
