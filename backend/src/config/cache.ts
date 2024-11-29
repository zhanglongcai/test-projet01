import { redis } from './redis.js';
import { logger } from '../utils/logger.js';

interface CacheConfig {
  ttl: number;
  prefix: string;
}

interface CacheOptions {
  ttl?: number;
  tags?: string[];
}

export class CacheService {
  private ttl: number;
  private prefix: string;

  constructor(config: CacheConfig) {
    this.ttl = config.ttl;
    this.prefix = config.prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  private getTagKey(tag: string): string {
    return `tag:${tag}`;
  }

  async get<T>(key: string): Promise<T | null> {
    return redis.execute(
      async (client) => {
        const data = await client.get(this.getKey(key));
        return data ? JSON.parse(data) : null;
      },
      null
    );
  }

  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    await redis.execute(
      async (client) => {
        const cacheKey = this.getKey(key);
        const cacheValue = JSON.stringify(value);
        const ttl = options?.ttl || this.ttl;

        await client.setex(cacheKey, ttl, cacheValue);

        if (options?.tags?.length) {
          for (const tag of options.tags) {
            const tagKey = this.getTagKey(tag);
            await client.sadd(tagKey, cacheKey);
            await client.expire(tagKey, ttl);
          }
        }
      },
      undefined
    );
  }

  async del(key: string): Promise<void> {
    await redis.execute(
      async (client) => client.del(this.getKey(key)),
      undefined
    );
  }

  async clearByTag(tag: string): Promise<void> {
    await redis.execute(
      async (client) => {
        const tagKey = this.getTagKey(tag);
        const keys = await client.smembers(tagKey);
        
        if (keys.length) {
          await client.del(tagKey, ...keys);
        }
      },
      undefined
    );
  }

  async clear(pattern?: string): Promise<void> {
    await redis.execute(
      async (client) => {
        const searchPattern = pattern 
          ? this.getKey(pattern) 
          : `${this.prefix}:*`;

        const keys = await client.keys(searchPattern);
        
        if (keys.length) {
          await client.del(...keys);
        }
      },
      undefined
    );
  }

  async lock(key: string, ttl: number = 30): Promise<boolean> {
    return redis.execute(
      async (client) => {
        const lockKey = `lock:${this.getKey(key)}`;
        const result = await client.set(lockKey, '1', { nx: true, ex: ttl });
        return result === 'OK';
      },
      false
    );
  }

  async unlock(key: string): Promise<void> {
    await redis.execute(
      async (client) => {
        const lockKey = `lock:${this.getKey(key)}`;
        await client.del(lockKey);
      },
      undefined
    );
  }
}