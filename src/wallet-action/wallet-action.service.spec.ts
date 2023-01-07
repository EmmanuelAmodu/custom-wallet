import { Test, TestingModule } from '@nestjs/testing';
import { WalletActionService } from './wallet-action.service';

describe('WalletActionService', () => {
  let service: WalletActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletActionService],
    }).compile();

    service = module.get<WalletActionService>(WalletActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
