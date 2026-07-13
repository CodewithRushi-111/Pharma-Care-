import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../logger';

const redisOptions: any = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  lazyConnect: env.NODE_ENV === 'test',
  maxRetriesPerRequest: null,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

if (env.REDIS_HOST !== 'localhost' && env.REDIS_HOST !== '127.0.0.1') {
  redisOptions.tls = {};
}

export const redis = new Redis(redisOptions);

redis.on('connect', () => logger.info('✅ Redis Cache connected successfully'));
redis.on('error', (err) => logger.error('❌ Redis Connection Error:', err));

export class CryptoHelper {
  public static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  public static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  public static generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${timestamp}-${random}`;
  }

  public static generatePrescriptionNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(100 + Math.random() * 900);
    return `RX-${timestamp}-${random}`;
  }
}

export class JwtHelper {
  public static generateAccessToken(payload: { userId: string; role: string }): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
  }

  public static generateRefreshToken(payload: { userId: string }): { token: string; hash: string } {
    const token = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as any,
    });
    const hash = CryptoHelper.hashToken(token);
    return { token, hash };
  }

  public static verifyAccessToken(token: string): { userId: string; role: string } {
    return jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
  }

  public static verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as { userId: string };
  }
}
