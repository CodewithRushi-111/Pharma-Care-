import { Request, Response, NextFunction } from 'express';
import { AppError } from '../helpers/error.helper';
import { HTTP_STATUS, ERROR_CODES, UserRole } from '../constants';
import { redis } from '../utils';
import { prisma } from '../prisma/client';

export const requirePermission = (permission: string) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(
          'Authentication required before checking permissions.',
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.AUTHENTICATION_REQUIRED
        );
      }

      if (req.user.role === UserRole.SUPER_ADMIN) {
        return next();
      }

      const cacheKey = `user:permissions:${req.user.id}`;
      let cachedPermissions = await redis.get(cacheKey);

      let permissions: string[] = [];
      if (cachedPermissions) {
        permissions = JSON.parse(cachedPermissions);
      } else {
        const userWithRole = await prisma.user.findUnique({
          where: { id: req.user.id },
          include: {
            // In a dynamic permission model or default role mapping
          },
        });

        // Default role-to-permission mapping if not cached
        if (req.user.role === UserRole.PATIENT) {
          permissions = ['ORDER:CREATE', 'APPOINTMENT:BOOK', 'AI:CHAT', 'PRESCRIPTION:UPLOAD'];
        } else if (req.user.role === UserRole.DOCTOR) {
          permissions = ['APPOINTMENT:ATTEND', 'CONSULTATION:CREATE', 'PRESCRIPTION:ISSUE', 'SLOT:MANAGE', 'AI:CHAT'];
        } else if (req.user.role === UserRole.PHARMACY_ADMIN) {
          permissions = ['ORDER:VIEW', 'ORDER:FULFILL', 'INVENTORY:MANAGE', 'PRESCRIPTION:VERIFY'];
        } else if (req.user.role === UserRole.PLATFORM_ADMIN) {
          permissions = ['DOCTOR:VERIFY', 'CATALOG:MANAGE', 'AI:LOG_VIEW', 'USER:MANAGE', 'COUPON:MANAGE'];
        }

        await redis.setex(cacheKey, 900, JSON.stringify(permissions)); // 15 min TTL
      }

      if (!permissions.includes(permission)) {
        throw new AppError(
          `Permission Denied. You lack the required permission (${permission}) for this operation.`,
          HTTP_STATUS.FORBIDDEN,
          ERROR_CODES.PERMISSION_DENIED
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
