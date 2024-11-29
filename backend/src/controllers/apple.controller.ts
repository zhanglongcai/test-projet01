import { Request, Response, NextFunction } from 'express';
import appleSignin from 'apple-signin-auth';
import { AuthService } from '../services/auth.service.js';
import { logger } from '../utils/logger.js';
import { successResponse } from '../utils/response.js';
import { ApiError } from '../utils/api-error.js';

export class AppleController {
  private authService: AuthService;
  private isConfigured: boolean = false;

  constructor() {
    this.authService = new AuthService();
    this.initializeAppleSignIn();
  }

  private initializeAppleSignIn() {
    try {
      if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
        this.isConfigured = true;
        logger.info('Apple Sign In initialized successfully');
      } else {
        logger.warn('Apple Sign In credentials not configured - Apple login will be disabled');
      }
    } catch (error) {
      logger.error('Failed to initialize Apple Sign In:', error);
      this.isConfigured = false;
    }
  }

  handleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!this.isConfigured) {
        throw new ApiError(503, 'Apple login is not available');
      }

      const { code, id_token } = req.body;

      if (!code || !id_token) {
        throw new ApiError(400, 'Apple authorization code and ID token are required');
      }

      try {
        // Verify ID token
        const { sub: appleUserId, email } = await appleSignin.verifyIdToken(
          id_token,
          {
            audience: process.env.APPLE_CLIENT_ID,
            ignoreExpiration: true
          }
        );

        if (!email) {
          throw new ApiError(400, 'Email permission is required');
        }

        // Get user info from authorization code
        const tokens = await appleSignin.getAuthorizationToken(code, {
          clientId: process.env.APPLE_CLIENT_ID!,
          clientSecret: process.env.APPLE_CLIENT_SECRET!,
          redirectUri: `${process.env.API_URL}/api/auth/apple/callback`
        });

        // Handle login/registration
        const authResult = await this.authService.handleAppleLogin({
          email,
          appleUserId,
          name: email.split('@')[0] // Apple doesn't always provide name
        });

        return successResponse(res, authResult);
      } catch (error) {
        logger.error('Apple token verification failed:', error);
        throw new ApiError(401, 'Invalid Apple credentials');
      }
    } catch (error) {
      logger.error('Apple auth error:', {
        error,
        body: req.body,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
      next(error);
    }
  };
}