export enum KFK_NAMES {
  BANK_SERVICE = 'BANK_SERVICE',
  SAVINGS_SERVICE = 'SAVINGS_SERVICE',
  BILLS_SERVICE = 'BILLS_SERVICE',
  INSURANCE_SERVICE = 'INSURANCE_SERVICE',
  STOCK_TRADING_SERVICE = 'STOCK_TRADING_SERVICE',
  LOAN_SERVICE = 'LOAN_SERVICE',
  INVESTMENT_SERVICE = 'INVESTMENT_SERVICE',
  CREDIT_CARD_SERVICE = 'CREDIT_CARD_SERVICE',
}

export enum KFK_CLIENTS {
  BANK_CLIENT = 'BANK_CLIENT',
}

export enum KFK_GROUPS {
  BANK_GROUP = 'BANK_GROUP',
}

export enum ERROR_CODES {
  ILLEGAL_TRANSACTION_STATUS = 102,
  ILLEGAL_STATUS_TRANSITION = 103,
  WALLET_LOCKED = 104,
  INSUFFICIENT_WALLET_BALANCE = 105,
}

export const errorMessages = {
  102: 'Transaction Update Failed: Unknown Transaction',
  103: 'Illegal Status Transition',
  104: 'There is an pending transaction on your wallet.',
};

export const FEE = {
  bill: 0,
  convert: 0,
  creditCard: 0,
  investment: 0,
  internalTransfer: 0,
  loan: 0,
  stock: 0,
  insurance: 0,
  withdrawal: 0,
  deposit: 0,
  savings: 0,
};
