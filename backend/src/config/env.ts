import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  API_PREFIX: z.string().default('/api/v1'),

  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/pharma_care?schema=public'),

  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform((val) => parseInt(val, 10)).default('6379'),
  REDIS_PASSWORD: z.string().optional().default(''),

  JWT_SECRET: z.string().default('super_secret_jwt_access_key_enterprise_2026'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().default('super_secret_jwt_refresh_key_enterprise_2026'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  GOOGLE_CLIENT_ID: z.string().optional().default('mock_google_client_id'),
  GOOGLE_CLIENT_SECRET: z.string().optional().default('mock_google_client_secret'),

  CLOUDINARY_CLOUD_NAME: z.string().default('mock_cloudinary_cloud'),
  CLOUDINARY_API_KEY: z.string().default('123456789012345'),
  CLOUDINARY_API_SECRET: z.string().default('mock_cloudinary_secret'),

  GEMINI_API_KEY: z.string().default('mock_gemini_api_key'),

  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().transform((val) => parseInt(val, 10)).default('587'),
  SMTP_USER: z.string().default('no-reply@pharmacare.local'),
  SMTP_PASS: z.string().default('mock_smtp_password'),

  TWILIO_ACCOUNT_SID: z.string().default('ACmock_twilio_account_sid'),
  TWILIO_AUTH_TOKEN: z.string().default('mock_twilio_auth_token'),
  TWILIO_PHONE_NUMBER: z.string().default('+15005550006'),

  STRIPE_SECRET_KEY: z.string().default('sk_test_mock_stripe_secret_key'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_mock_webhook_secret'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_mock_id'),
  RAZORPAY_KEY_SECRET: z.string().default('mock_razorpay_secret'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables detected:', parsedEnv.error.format());
  throw new Error('Invalid environment configuration. Please check your .env file.');
}

export const env = parsedEnv.data;
