import { CacheModule, Module } from '@nestjs/common';
import { InternalCacheService } from './internal-cache.service';
import { redisStore } from 'cache-manager-redis-store';
import config from '@circle/config';

@Module({
  imports: [
    CacheModule.register({
      // @ts-ignore
      store: async () =>
        redisStore({
          url: config.redis.host + ':' + config.redis.port,
          username: config.redis.user,
          password: config.redis.pass,
          // ttl: 60 * 60 * 1000,
          socket: {
            host: config.redis.host,
            port: parseInt(config.redis.port),
          },
        }),
    }),
  ],
  providers: [InternalCacheService],
  exports: [InternalCacheService],
})
export class InternalCacheModule {}
