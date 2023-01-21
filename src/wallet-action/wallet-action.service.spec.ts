import { InternalCacheModule } from '@circle/internal-cache/internal-cache.module';
import { TransactionModule } from '@circle/transaction/transaction.module';
import { TransactionService } from '@circle/transaction/transaction.service';
import { KFK_NAMES } from '@circle/utils/constants';
import { ErrorResponse } from '@circle/utils/error.util';
import { HttpResponse } from '@circle/utils/http.response';
import { WalletModule } from '@circle/wallet/wallet.module';
import { WalletService } from '@circle/wallet/wallet.service';
import { JwtModule } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, CreditCardEvent } from '@prisma/client';
import { MicroserviceClients } from '../../test/mock-clients';
import { WalletActionService } from './wallet-action.service';

describe('WalletActionService', () => {
  let service: WalletActionService;
  let bankClient: ClientKafka;
  let billsClient: ClientKafka;
  let creditCardClient: ClientKafka;
  let insuranceclient: ClientKafka;
  let investclient: ClientKafka;
  let loanclient: ClientKafka;
  let savingsClient: ClientKafka;
  let stockTradeclient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        InternalCacheModule,
        {
          module: TransactionModule,
          providers: [
            {
              provide: TransactionService,
              useValue: {
                createTransaction: () => ({
                  amount: 20,
                  currency: 'NGN',
                  eventType: 'ConvertEvent',
                  eventId: '',
                  status: 'CONFIRMED',
                  type: 'CREDIT',
                  userId: '',
                }),
              },
            },
          ],
        },
        {
          module: WalletModule,
          providers: [
            {
              provide: WalletService,
              useValue: {
                lockWallet: () => null,
                unlockWallet: () => null,
              },
            },
          ],
        },
        JwtModule,
      ],
      providers: [
        WalletActionService,
        HttpResponse,
        PrismaClient,
        {
          provide: PrismaClient,
          useFactory: () => {
            return {
              $transaction: jest.fn().mockResolvedValue({
                id: '',
                amount: 20,
                createdAt: new Date('2023-01-21T00:41:27.540Z'),
                currency: 'NGN',
                fees: 0.3,
                userId: '',
              }),
            };
          },
        },
        ErrorResponse,
        ...MicroserviceClients,
      ],
    }).compile();

    bankClient = module.get(KFK_NAMES.BANK_SERVICE);
    billsClient = module.get(KFK_NAMES.BILLS_SERVICE);
    creditCardClient = module.get(KFK_NAMES.CREDIT_CARD_SERVICE);
    insuranceclient = module.get(KFK_NAMES.INSURANCE_SERVICE);
    investclient = module.get(KFK_NAMES.INVESTMENT_SERVICE);
    loanclient = module.get(KFK_NAMES.LOAN_SERVICE);
    savingsClient = module.get(KFK_NAMES.SAVINGS_SERVICE);
    stockTradeclient = module.get(KFK_NAMES.STOCK_TRADING_SERVICE);
    service = module.get<WalletActionService>(WalletActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call credit card action successfully', async () => {
    const response = await service.creditCardAction('', {
      amount: 20,
      currency: 'NGN',
    });

    expect(response).toMatchObject<CreditCardEvent>({
      id: '',
      amount: 20,
      createdAt: new Date('2023-01-21T00:41:27.540Z'),
      currency: 'NGN',
      fees: 0.3,
      userId: '',
    });
    // expect(bankClient.emit).toHaveBeenCalled();
  });
});
