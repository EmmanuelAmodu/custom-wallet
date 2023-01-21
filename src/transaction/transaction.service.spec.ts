import { InternalCacheModule } from '@circle/internal-cache/internal-cache.module';
import { WalletModule } from '@circle/wallet/wallet.module';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WalletModule, InternalCacheModule, JwtModule],
      providers: [TransactionService],
      controllers: [TransactionController],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
