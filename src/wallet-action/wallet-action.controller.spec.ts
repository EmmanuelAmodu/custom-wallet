import { Test, TestingModule } from '@nestjs/testing';
import { WalletActionController } from './wallet-action.controller';
import { WalletActionService } from './wallet-action.service';

describe('WalletActionController', () => {
  let controller: WalletActionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletActionController],
      providers: [WalletActionService],
    }).compile();

    controller = module.get<WalletActionController>(WalletActionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
