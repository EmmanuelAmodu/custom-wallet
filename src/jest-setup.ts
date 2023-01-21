import { CreditCardEvent } from '@prisma/client';

jest.createMockFromModule('kafkajs');
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        // $transaction: jest.fn().mockImplementation(),
        creditCardEvent: {
          create: jest.fn().mockResolvedValue(<CreditCardEvent>{
            id: '',
            amount: 20,
            createdAt: new Date(),
            currency: 'NGN',
            fees: 0.3,
            userId: '',
          }),
        },
      };
    }),
    Currency: jest
      .fn()
      .mockResolvedValue({ NGN: 'NGN', GHS: 'GHS', CAF: 'CAF', USD: 'USD' }),
    TransactionEventType: jest.fn().mockReturnValue({
      ConvertEvent: 'ConvertEvent',
      InternalTransferEvent: 'InternalTransferEvent',
      InsuranceEvent: 'InsuranceEvent',
      TradeStockEvent: 'TradeStockEvent',
      LoanEvent: 'LoanEvent',
      CreditCardEvent: 'CreditCardEvent',
      InvestmentEvent: 'InvestmentEvent',
      WithdrawalEvent: 'WithdrawalEvent',
      DepositEvent: 'DepositEvent',
      ReversalEvent: 'ReversalEvent',
      SavingsEvent: 'SavingsEvent',
      BillPaymentEvent: 'BillPaymentEvent',
    }),
  };
});

process.env.KAFKA_BROKERS = 'localhost:9092';
process.env.REDIS_HOST = 'redis://127.0.0.1';
process.env.REDIS_PASS = 'password';
process.env.REDIS_PORT = '6379';
process.env.REDIS_USER = 'default';
process.env.JWT_SECRET = 'secret';
process.env.JWT_EXPIRES_IN = '10m';
