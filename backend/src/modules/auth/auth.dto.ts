import { z } from 'zod';
import { UserRole } from '../../constants';

export const SignupSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address.'),
    phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      ),
    role: z.nativeEnum(UserRole).default(UserRole.PATIENT),
    fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    identifier: z.string().min(3, 'Email or Phone Number is required.'),
    password: z.string().min(1, 'Password is required.'),
  }),
});

export const OtpVerifySchema = z.object({
  body: z.object({
    phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Valid phone number required.'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits.'),
  }),
});

export const ForgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid registered email address.'),
  }),
});

export const ResetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required.'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      ),
  }),
});

export const RefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(), // Can also be passed via cookies
  }),
});

export const GoogleLoginSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, 'Google ID Token is required.'),
    role: z.nativeEnum(UserRole).default(UserRole.PATIENT),
  }),
});

export type SignupDto = z.infer<typeof SignupSchema>['body'];
export type LoginDto = z.infer<typeof LoginSchema>['body'];
export type OtpVerifyDto = z.infer<typeof OtpVerifySchema>['body'];
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>['body'];
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>['body'];
export type GoogleLoginDto = z.infer<typeof GoogleLoginSchema>['body'];
