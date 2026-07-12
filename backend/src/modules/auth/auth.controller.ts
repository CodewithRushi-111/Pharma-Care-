import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ResponseHelper } from '../../helpers/response.helper';
import { HTTP_STATUS } from '../../constants';

export class AuthController {
  public static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.signup(req.body);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      ResponseHelper.success(res, result, 'User registered successfully.', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const result = await AuthService.login(req.body, ip, userAgent);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      ResponseHelper.success(res, result, 'Login successful.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async requestPhoneOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phoneNumber } = req.body;
      const result = await AuthService.requestPhoneOtp(phoneNumber);
      ResponseHelper.success(res, result, 'OTP requested successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async verifyOtpAndLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const result = await AuthService.verifyOtpAndLogin(req.body, ip, userAgent);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      ResponseHelper.success(res, result, 'OTP verified and logged in successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const token = req.cookies?.refreshToken || req.body.refreshToken;
      const result = await AuthService.refreshTokenRotation(token, ip, userAgent);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      ResponseHelper.success(res, result, 'Access token refreshed successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const accessToken = req.headers.authorization!.split(' ')[1];
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
      const result = await AuthService.logout(userId, accessToken, refreshToken);
      res.clearCookie('refreshToken');
      ResponseHelper.success(res, result, 'Logged out successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.forgotPassword(req.body);
      ResponseHelper.success(res, result, 'Forgot password request processed.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.resetPassword(req.body);
      ResponseHelper.success(res, result, 'Password reset successfully.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  public static async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const result = await AuthService.googleLogin(req.body, ip, userAgent);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      ResponseHelper.success(res, result, 'Google OAuth login successful.', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}
