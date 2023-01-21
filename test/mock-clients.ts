import { KFK_NAMES } from '@circle/utils/constants';

export const MicroserviceClients = [
  {
    provide: KFK_NAMES.BANK_SERVICE,
    useValue: {
      emit: jest.fn(),
    },
  },
  {
    provide: KFK_NAMES.SAVINGS_SERVICE,
    useValue: {
      emit: jest.fn(),
    },
  },
  {
    provide: KFK_NAMES.BILLS_SERVICE,
    useValue: {
      emit: jest.fn(),
    },
  },
  {
    provide: KFK_NAMES.INSURANCE_SERVICE,
    useValue: {
      emit: jest.fn(),
    },
  },
  {
    provide: KFK_NAMES.STOCK_TRADING_SERVICE,
    useValue: {
      emit: jest.fn(),
    },
  },
  {
    provide: KFK_NAMES.LOAN_SERVICE,
    useValue: {
      emit: jest.fn(),
    },
  },
  {
    provide: KFK_NAMES.INVESTMENT_SERVICE,
    useValue: {
      emit: jest.fn(),
    },
  },
  {
    provide: KFK_NAMES.CREDIT_CARD_SERVICE,
    useValue: {
      emit: jest.fn(),
    },
  },
];
