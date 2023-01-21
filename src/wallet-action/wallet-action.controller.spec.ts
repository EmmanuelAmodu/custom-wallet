import { InternalCacheModule } from '@circle/internal-cache/internal-cache.module';
import { TransactionModule } from '@circle/transaction/transaction.module';
import { TransactionService } from '@circle/transaction/transaction.service';
import { ErrorResponse } from '@circle/utils/error.util';
import { HttpResponse } from '@circle/utils/http.response';
import { WalletModule } from '@circle/wallet/wallet.module';
import { WalletService } from '@circle/wallet/wallet.service';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { MicroserviceClients } from '../../test/mock-clients';
import { WalletActionController } from './wallet-action.controller';
import { WalletActionService } from './wallet-action.service';

describe('WalletActionController', () => {
  let controller: WalletActionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        InternalCacheModule,
        TransactionModule,
        WalletModule,
        JwtModule,
      ],
      providers: [
        WalletActionService,
        HttpResponse,
        PrismaClient,
        ErrorResponse,
        ...MicroserviceClients,
      ],
      controllers: [WalletActionController],
    }).compile();

    controller = module.get(WalletActionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
