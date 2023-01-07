import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class InternalCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string) {
    return await this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number) {
    await this.cache.set(key, value, ttl);
  }

  async delete(key: string) {
    await this.cache.del(key);
  }
}
