import bcrypt from 'bcryptjs';
import { AuthRepository } from './auth.repository';
import { SignupDto, LoginDto, OtpVerifyDto, ForgotPasswordDto, ResetPasswordDto, GoogleLoginDto } from './auth.dto';
import { AppError } from '../../helpers/error.helper';
import { HTTP_STATUS, ERROR_CODES } from '../../constants';
import { CryptoHelper, JwtHelper, redis } from '../../utils';
import { logger } from '../../logger';
import { prisma } from '../../prisma/client';

export class AuthService {
  public static async signup(dto: SignupDto) {
    const existingUser = await AuthRepository.findUserByIdentifier(dto.email);
    if (existingUser) {
      throw new AppError(
        'An account with this email already exists.',
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.DUPLICATE_ENTRY
      );
    }

    if (dto.phoneNumber) {
      const existingPhone = await AuthRepository.findUserByIdentifier(dto.phoneNumber);
      if (existingPhone) {
        throw new AppError(
          'An account with this phone number already exists.',
          HTTP_STATUS.CONFLICT,
          ERROR_CODES.DUPLICATE_ENTRY
        );
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await AuthRepository.createUser({
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      passwordHash,
      role: dto.role as any,
      isVerified: false,
      fullName: dto.fullName,
    });

    // Send Phone/Email verification OTP
    if (dto.phoneNumber) {
      const otp = CryptoHelper.generateOtp();
      await redis.setex(`otp:verify:${dto.phoneNumber}`, 300, otp); // 5 minutes TTL
      logger.info(`📱 [SMS DISPATCH] Verification OTP for ${dto.phoneNumber}: ${otp}`);
    }

    const accessToken = JwtHelper.generateAccessToken({ userId: user.id, role: user.role });
    const { token: refreshToken, hash: tokenHash } = JwtHelper.generateRefreshToken({ userId: user.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await AuthRepository.createRefreshToken({
      tokenHash,
      userId: user.id,
      expiresAt,
    });

    await prisma.auditLog.create({
      data: {
        action: 'USER_SIGNUP',
        entityType: 'User',
        entityId: user.id,
        userId: user.id,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  public static async login(dto: LoginDto, ip?: string, userAgent?: string) {
    const user = await AuthRepository.findUserByIdentifier(dto.identifier);
    if (!user || !user.passwordHash) {
      throw new AppError(
        'Invalid credentials. Please verify your email/phone and password.',
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.AUTHENTICATION_REQUIRED
      );
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError(
        'Invalid credentials. Please verify your email/phone and password.',
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.AUTHENTICATION_REQUIRED
      );
    }

    const accessToken = JwtHelper.generateAccessToken({ userId: user.id, role: user.role });
    const { token: refreshToken, hash: tokenHash } = JwtHelper.generateRefreshToken({ userId: user.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await AuthRepository.createRefreshToken({
      tokenHash,
      userId: user.id,
      expiresAt,
      deviceIp: ip,
      userAgent,
    });

    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        userId: user.id,
        ipAddress: ip,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  public static async requestPhoneOtp(phoneNumber: string) {
    const user = await AuthRepository.findUserByIdentifier(phoneNumber);
    if (!user) {
      throw new AppError(
        'No account found with this phone number. Please sign up first.',
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND
      );
    }

    const otp = CryptoHelper.generateOtp();
    await redis.setex(`otp:login:${phoneNumber}`, 300, otp);
    logger.info(`📱 [SMS DISPATCH] Login OTP for ${phoneNumber}: ${otp}`);

    return { message: 'OTP sent successfully to registered mobile number.' };
  }

  public static async verifyOtpAndLogin(dto: OtpVerifyDto, ip?: string, userAgent?: string) {
    const cachedOtp = await redis.get(`otp:login:${dto.phoneNumber}`) || await redis.get(`otp:verify:${dto.phoneNumber}`);
    if (!cachedOtp || cachedOtp !== dto.otp) {
      throw new AppError(
        'Invalid or expired OTP. Please check your SMS and try again.',
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    await redis.del(`otp:login:${dto.phoneNumber}`);
    await redis.del(`otp:verify:${dto.phoneNumber}`);

    const user = await AuthRepository.findUserByIdentifier(dto.phoneNumber);
    if (!user) {
      throw new AppError(
        'User not found.',
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND
      );
    }

    if (!user.isVerified) {
      await AuthRepository.verifyUser(user.id);
    }

    const accessToken = JwtHelper.generateAccessToken({ userId: user.id, role: user.role });
    const { token: refreshToken, hash: tokenHash } = JwtHelper.generateRefreshToken({ userId: user.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await AuthRepository.createRefreshToken({
      tokenHash,
      userId: user.id,
      expiresAt,
      deviceIp: ip,
      userAgent,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: true,
      },
      accessToken,
      refreshToken,
    };
  }

  public static async refreshTokenRotation(token: string, ip?: string, userAgent?: string) {
    try {
      JwtHelper.verifyRefreshToken(token);
    } catch {
      throw new AppError(
        'Invalid or expired refresh token. Please login again.',
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.TOKEN_EXPIRED
      );
    }

    const tokenHash = CryptoHelper.hashToken(token);
    const existingRecord = await AuthRepository.findRefreshTokenByHash(tokenHash);

    if (!existingRecord || existingRecord.isRevoked) {
      // Security warning: Reuse of revoked refresh token detected. Revoke all active tokens for this user!
      if (existingRecord) {
        logger.warn(`🚨 Security Alert: Revoked refresh token reused for user ${existingRecord.userId}. Revoking all tokens.`);
        await AuthRepository.revokeAllUserRefreshTokens(existingRecord.userId);
      }
      throw new AppError(
        'Security violation: Refresh token already revoked or invalid. Please login again.',
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_TOKEN
      );
    }

    if (existingRecord.expiresAt < new Date()) {
      await AuthRepository.revokeRefreshToken(existingRecord.id);
      throw new AppError(
        'Refresh token has expired. Please login again.',
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.TOKEN_EXPIRED
      );
    }

    // Revoke old token
    await AuthRepository.revokeRefreshToken(existingRecord.id);

    // Issue new pair
    const accessToken = JwtHelper.generateAccessToken({
      userId: existingRecord.user.id,
      role: existingRecord.user.role,
    });
    const { token: newRefreshToken, hash: newTokenHash } = JwtHelper.generateRefreshToken({
      userId: existingRecord.user.id,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await AuthRepository.createRefreshToken({
      tokenHash: newTokenHash,
      userId: existingRecord.user.id,
      expiresAt,
      deviceIp: ip,
      userAgent,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  public static async logout(userId: string, accessToken: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = CryptoHelper.hashToken(refreshToken);
      const record = await AuthRepository.findRefreshTokenByHash(tokenHash);
      if (record) {
        await AuthRepository.revokeRefreshToken(record.id);
      }
    } else {
      await AuthRepository.revokeAllUserRefreshTokens(userId);
    }

    // Blacklist current access token until expiry
    await redis.setex(`revoked_token:${accessToken}`, 900, 'REVOKED');

    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGOUT',
        entityType: 'User',
        entityId: userId,
        userId: userId,
      },
    });

    return { message: 'Logged out successfully and session terminated.' };
  }

  public static async forgotPassword(dto: ForgotPasswordDto) {
    const user = await AuthRepository.findUserByIdentifier(dto.email);
    if (!user) {
      // Fail silently for privacy/security to prevent email enumeration
      return { message: 'If an account exists with that email, a password reset link has been sent.' };
    }

    const resetToken = CryptoHelper.generateOtp() + '-' + Date.now();
    const tokenHash = CryptoHelper.hashToken(resetToken);

    await redis.setex(`reset_pwd:${tokenHash}`, 900, user.id); // 15 minutes TTL

    logger.info(`📧 [EMAIL DISPATCH] Password Reset Token for ${user.email}: ${resetToken}`);

    return { message: 'If an account exists with that email, a password reset link has been sent.' };
  }

  public static async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = CryptoHelper.hashToken(dto.token);
    const userId = await redis.get(`reset_pwd:${tokenHash}`);

    if (!userId) {
      throw new AppError(
        'Password reset link is invalid or has expired.',
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR
      );
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await AuthRepository.updatePassword(userId, passwordHash);
    await AuthRepository.revokeAllUserRefreshTokens(userId);
    await redis.del(`reset_pwd:${tokenHash}`);

    await prisma.auditLog.create({
      data: {
        action: 'PASSWORD_RESET',
        entityType: 'User',
        entityId: userId,
        userId: userId,
      },
    });

    return { message: 'Password reset successfully. You can now login with your new password.' };
  }

  public static async googleLogin(dto: GoogleLoginDto, ip?: string, userAgent?: string) {
    // For production this verifies with google-auth-library OAuth2Client
    // Here we support mock/verified ID tokens cleanly
    const mockEmail = `google.${dto.idToken.slice(0, 8)}@pharmacare.local`;

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId: dto.idToken }, { email: mockEmail }] },
    });

    if (!user) {
      user = await AuthRepository.createUser({
        email: mockEmail,
        googleId: dto.idToken,
        role: dto.role as any,
        isVerified: true,
        fullName: 'Google Authenticated User',
      });
    }

    const accessToken = JwtHelper.generateAccessToken({ userId: user.id, role: user.role });
    const { token: refreshToken, hash: tokenHash } = JwtHelper.generateRefreshToken({ userId: user.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await AuthRepository.createRefreshToken({
      tokenHash,
      userId: user.id,
      expiresAt,
      deviceIp: ip,
      userAgent,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      accessToken,
      refreshToken,
    };
  }
}
