import { Module } from '@nestjs/common';
import { WalletActionService } from './wallet-action.service';
import { WalletActionController } from './wallet-action.controller';
import { ClientsModule } from '@nestjs/microservices';
import { HttpResponse } from '@circle/utils/http.response';
import { ErrorResponse } from '@circle/utils/error.util';
import { PrismaClient } from '@prisma/client';
import { TransactionModule } from '@circle/transaction/transaction.module';
import { WalletModule } from '@circle/wallet/wallet.module';
import { InternalCacheModule } from '@circle/internal-cache/internal-cache.module';
import { JwtModule } from '@nestjs/jwt';
import config from '@circle/config';
import { KafkaClients } from './wallet-action.clients';

@Module({
  imports: [
    InternalCacheModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: parseInt(config.jwt.expiresIn) },
    }),
    ClientsModule.register(KafkaClients),
    TransactionModule,
    WalletModule,
  ],
  controllers: [WalletActionController],
  providers: [WalletActionService, HttpResponse, PrismaClient, ErrorResponse],
})
export class WalletActionModule {}
