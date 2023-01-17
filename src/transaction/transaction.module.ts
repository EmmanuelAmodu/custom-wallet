import { InternalCacheModule } from '@circle/internal-cache/internal-cache.module';
import { ErrorResponse } from '@circle/utils/error.util';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import config from '@circle/config';
import { WalletModule } from '@circle/wallet/wallet.module';
import { HttpResponse } from '@circle/utils/http.response';

@Module({
  imports: [
    WalletModule,
    InternalCacheModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: parseInt(config.jwt.expiresIn) },
    }),
  ],
  providers: [TransactionService, PrismaClient, ErrorResponse, HttpResponse],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
