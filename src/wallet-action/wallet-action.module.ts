import { Module } from '@nestjs/common';
import { WalletActionService } from './wallet-action.service';
import { WalletActionController } from './wallet-action.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KFK_NAMES, KFK_CLIENTS, KFK_GROUPS } from '@circle/utils/constants';
import { HttpResponse } from '@circle/utils/http.response';
import { ErrorResponse } from '@circle/utils/error.util';
import { PrismaClient } from '@prisma/client';
import { TransactionModule } from '@circle/transaction/transaction.module';
import { WalletModule } from '@circle/wallet/wallet.module';
import { InternalCacheModule } from '@circle/internal-cache/internal-cache.module';
import { JwtModule } from '@nestjs/jwt';
import config from '../config';

@Module({
  imports: [
    InternalCacheModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: parseInt(config.jwt.expiresIn) },
    }),
    ClientsModule.register([
      {
        name: KFK_NAMES.BANK_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: KFK_CLIENTS.BANK_CLIENT,
            brokers: config.kafka.brokers,
          },
          consumer: {
            groupId: KFK_GROUPS.BANK_GROUP,
          },
        },
      },
    ]),
    TransactionModule,
    WalletModule,
  ],
  controllers: [WalletActionController],
  providers: [WalletActionService, HttpResponse, PrismaClient, ErrorResponse],
})
export class WalletActionModule {}
