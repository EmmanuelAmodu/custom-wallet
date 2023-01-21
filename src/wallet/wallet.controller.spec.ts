import { InternalCacheModule } from '@circle/internal-cache/internal-cache.module';
import { ErrorResponse } from '@circle/utils/error.util';
import { HttpResponse } from '@circle/utils/http.response';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

describe('WalletController', () => {
  let controller: WalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InternalCacheModule, JwtModule],
      providers: [WalletService, HttpResponse, ErrorResponse],
      controllers: [WalletController],
    }).compile();

    controller = module.get<WalletController>(WalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
