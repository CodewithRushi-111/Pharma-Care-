import { Request, Response, NextFunction } from 'express';
import { JwtHelper, redis } from '../utils';
import { AppError } from '../helpers/error.helper';
import { HTTP_STATUS, ERROR_CODES } from '../constants';
import { prisma } from '../prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
        isVerified: boolean;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Authentication required. Please provide a valid Bearer token.',
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.AUTHENTICATION_REQUIRED
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = JwtHelper.verifyAccessToken(token);

    const isRevoked = await redis.get(`revoked_token:${token}`);
    if (isRevoked) {
      throw new AppError(
        'Access token has been revoked or session terminated.',
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_TOKEN
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, email: true, isVerified: true },
    });

    if (!user) {
      throw new AppError(
        'User associated with this token no longer exists.',
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_TOKEN
      );
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      isVerified: user.isVerified,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(
        new AppError(
          'Access token expired. Please refresh your token.',
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.TOKEN_EXPIRED
        )
      );
    } else if (error.name === 'JsonWebTokenError') {
      next(
        new AppError(
          'Invalid access token signature.',
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.INVALID_TOKEN
        )
      );
    } else {
      next(error);
    }
  }
};
