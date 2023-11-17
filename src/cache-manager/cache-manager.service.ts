import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Config } from '../config/entities/config.entity';

@Injectable()
export class CacheManagerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private logger: Logger,
  ) {}

  async set(key: string, value: any, ttl?: number) {
    await this.cacheManager.set(key, value, ttl);
  }

  async get(key: string) {
    return await this.cacheManager.get(key);
  }

  async setConfig(config: Config) {
    await this.cacheManager.set('config', config, 0);
    this.logger.log('Config saved to cache', 'CacheManagerService');
  }

  async getConfig(): Promise<Config> {
    const config = await this.cacheManager.get('config');
    if (!config) return null;
    return config as Config;
  }

  async clear() {
    await this.cacheManager.reset();
    this.logger.log('Cache cleared');
  }
}
