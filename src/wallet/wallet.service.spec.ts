import { JwtStrategy } from '@circle/auth/auth.strategy';
import { InternalCacheModule } from '@circle/internal-cache/internal-cache.module';
import { ErrorResponse } from '@circle/utils/error.util';
import { HttpResponse } from '@circle/utils/http.response';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InternalCacheModule, JwtModule],
      providers: [
        WalletService,
        PrismaClient,
        HttpResponse,
        ErrorResponse,
        JwtStrategy,
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
