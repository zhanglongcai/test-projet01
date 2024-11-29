import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { SMSService } from '../services/sms.service.js';
import { EmailService } from '../services/email.service.js';
import { logger } from '../utils/logger.js';
import { successResponse } from '../utils/response.js';
import { ApiError } from '../utils/api-error.js';

export class AuthController {
  private authService: AuthService;
  private smsService: SMSService;
  private emailService: EmailService;

  constructor() {
    this.authService = new AuthService();
    this.smsService = new SMSService();
    this.emailService = new EmailService();
  }

  loginWithEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'] || '';

      const result = await this.authService.loginWithPassword(
        email,
        password,
        ip,
        userAgent
      );

      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  registerWithEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;
      const result = await this.authService.registerWithEmail(email, password, name);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  loginWithPhone = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone, code } = req.body;
      const ip = req.ip;
      const userAgent = req.headers['user-agent'] || '';

      const result = await this.authService.loginWithCode(
        phone,
        code,
        'LOGIN',
        ip,
        userAgent
      );

      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  registerWithPhone = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone, code, name } = req.body;
      const result = await this.authService.registerWithPhone(phone, code, name);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  sendPhoneCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone, type } = req.body;
      const code = await this.authService.generateVerificationCode();
      await this.smsService.sendVerificationCode(phone, code, type);
      await this.authService.saveVerificationCode({ phone }, code, type);
      return successResponse(res, null, '验证码发送成功');
    } catch (error) {
      next(error);
    }
  };

  sendEmailCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, type } = req.body;
      const code = await this.authService.generateVerificationCode();
      await this.emailService.sendVerificationCode(email, code, type);
      await this.authService.saveVerificationCode({ email }, code, type);
      return successResponse(res, null, '验证码发送成功');
    } catch (error) {
      next(error);
    }
  };

  bindPhone = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone, code } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        throw new ApiError(401, 'Unauthorized');
      }
      await this.authService.bindPhone(userId, phone, code);
      return successResponse(res, null, '手机绑定成功');
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.authService.refreshTokens(refreshToken);
      return successResponse(res, { tokens });
    } catch (error) {
      next(error);
    }
  };

  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return successResponse(res, { user: req.user });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        await this.authService.logout(token);
      }
      return successResponse(res, null, '退出登录成功');
    } catch (error) {
      next(error);
    }
  };
}