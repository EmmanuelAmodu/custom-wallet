import { JwtStrategy } from '@circle/auth/auth.strategy';
import { InternalCacheModule } from '@circle/internal-cache/internal-cache.module';
import { ErrorResponse } from '@circle/utils/error.util';
import { HttpResponse } from '@circle/utils/http.response';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import config from '@circle/config';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    InternalCacheModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: parseInt(config.jwt.expiresIn) },
    }),
  ],
  controllers: [WalletController],
  providers: [
    PrismaClient,
    HttpResponse,
    WalletService,
    ErrorResponse,
    JwtStrategy,
  ],
  exports: [WalletService],
})
export class WalletModule {}
