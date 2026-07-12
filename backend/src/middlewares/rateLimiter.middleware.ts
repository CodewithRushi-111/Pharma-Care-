import { Request, Response, NextFunction } from 'express';
import { redis } from '../utils';
import { AppError } from '../helpers/error.helper';
import { HTTP_STATUS, ERROR_CODES } from '../constants';
import { logger } from '../logger';

export const rateLimiter = (options: {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
  message?: string;
}) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userId = req.user?.id || ip;
      const prefix = options.keyPrefix || 'ratelimit:global';
      const key = `${prefix}:${userId}`;

      const currentWindow = Math.floor(Date.now() / options.windowMs);
      const redisKey = `${key}:${currentWindow}`;

      const count = await redis.incr(redisKey);
      if (count === 1) {
        await redis.expire(redisKey, Math.ceil(options.windowMs / 1000));
      }

      if (count > options.maxRequests) {
        logger.warn(`Rate limit exceeded for key: ${key} (${count}/${options.maxRequests})`);
        throw new AppError(
          options.message || 'Too many requests. Please slow down and try again later.',
          HTTP_STATUS.TOO_MANY_REQUESTS,
          ERROR_CODES.RATE_LIMIT_EXCEEDED
        );
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        // If Redis is temporarily down or errors out, fail open rather than breaking the application
        logger.error('Redis Rate Limiter error:', error);
        next();
      }
    }
  };
};
