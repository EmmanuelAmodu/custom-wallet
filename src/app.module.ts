import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InternalCacheModule } from './internal-cache/internal-cache.module';
import { JwtStrategy } from './strategies/auth.strategy';
import { WalletModule } from './wallet/wallet.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    InternalCacheModule,
    WalletModule,
    ThrottlerModule.forRoot({
      ttl: 3,
      limit: 1,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
