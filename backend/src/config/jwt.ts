import jwt from 'jsonwebtoken';
import { redis } from './redis.js';
import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/api-error.js';

export class JWTConfig {
  private readonly secret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly issuer: string;
  private readonly algorithm: jwt.Algorithm;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-jwt-secret';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '2h';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '30d';
    this.issuer = process.env.JWT_ISSUER || 'freenoai';
    this.algorithm = 'HS256';

    if (process.env.NODE_ENV === 'production' && this.secret === 'your-jwt-secret') {
      logger.warn('Using default JWT secret in production environment');
    }
  }

  generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.accessTokenExpiry,
      issuer: this.issuer,
      algorithm: this.algorithm
    });
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(
      { ...payload, type: 'refresh' },
      this.secret,
      {
        expiresIn: this.refreshTokenExpiry,
        issuer: this.issuer,
        algorithm: this.algorithm
      }
    );
  }

  async verifyToken(token: string, ignoreExpiration = false): Promise<any> {
    try {
      // Check blacklist
      const isBlacklisted = await this.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new ApiError(401, 'Token has been revoked');
      }

      // Verify token
      const decoded = jwt.verify(token, this.secret, {
        issuer: this.issuer,
        algorithms: [this.algorithm],
        ignoreExpiration
      });

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, 'Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, 'Invalid token');
      }
      throw error;
    }
  }

  async blacklistToken(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded?.exp) {
        const ttl = Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
        await redis.setex(`blacklist:${token}`, ttl, 'revoked');
      }
    } catch (error) {
      logger.error('Error blacklisting token:', error);
      throw new ApiError(500, 'Failed to blacklist token');
    }
  }

  private async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklisted = await redis.get(`blacklist:${token}`);
    return !!blacklisted;
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    try {
      // Delete all refresh tokens
      const refreshTokens = await redis.keys(`refresh:${userId}:*`);
      if (refreshTokens.length > 0) {
        await redis.del(refreshTokens);
      }

      // Add current access token to blacklist if provided
      const accessTokens = await redis.keys(`access:${userId}:*`);
      for (const token of accessTokens) {
        await this.blacklistToken(token);
      }
    } catch (error) {
      logger.error('Error revoking user tokens:', error);
      throw new ApiError(500, 'Failed to revoke user tokens');
    }
  }
}

export const jwtConfig = new JWTConfig();