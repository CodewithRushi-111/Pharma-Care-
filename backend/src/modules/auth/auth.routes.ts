import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { rateLimiter } from '../../middlewares/rateLimiter.middleware';
import {
  SignupSchema,
  LoginSchema,
  OtpVerifySchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  RefreshTokenSchema,
  GoogleLoginSchema,
} from './auth.dto';

const router = Router();

// Rate limit: 10 failed/login attempts per 15 min per IP
const authLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 15, keyPrefix: 'ratelimit:auth' });

router.post('/signup', authLimiter, validate(SignupSchema), AuthController.signup);
router.post('/login', authLimiter, validate(LoginSchema), AuthController.login);
router.post('/otp/request', authLimiter, AuthController.requestPhoneOtp);
router.post('/otp/verify', authLimiter, validate(OtpVerifySchema), AuthController.verifyOtpAndLogin);
router.post('/refresh', validate(RefreshTokenSchema), AuthController.refreshToken);
router.post('/forgot-password', authLimiter, validate(ForgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', authLimiter, validate(ResetPasswordSchema), AuthController.resetPassword);
router.post('/google', authLimiter, validate(GoogleLoginSchema), AuthController.googleLogin);

// Protected endpoints
router.post('/logout', authenticate, AuthController.logout);

export default router;
