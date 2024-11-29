import { Redis } from '@upstash/redis';
import { logger } from '../utils/logger.js';

class RedisClient {
  private static instance: Redis | null = null;
  private static isConnected: boolean = false;

  static async getInstance(): Promise<Redis | null> {
    if (!this.instance) {
      try {
        this.instance = new Redis({
          url: process.env.UPSTASH_REDIS_URL || 'https://your-redis-url.upstash.io',
          token: process.env.UPSTASH_REDIS_TOKEN || 'your-redis-token'
        });

        // Test connection
        await this.instance.ping();
        this.isConnected = true;
        logger.info('Redis connected successfully');
      } catch (error) {
        logger.error('Redis connection failed:', error);
        this.isConnected = false;
        this.instance = null;
      }
    }
    return this.instance;
  }

  static async execute<T>(operation: (redis: Redis) => Promise<T>, fallback: T): Promise<T> {
    try {
      const redis = await this.getInstance();
      if (!redis || !this.isConnected) {
        return fallback;
      }
      return await operation(redis);
    } catch (error) {
      logger.error('Redis operation failed:', error);
      return fallback;
    }
  }
}

export { RedisClient as redis };