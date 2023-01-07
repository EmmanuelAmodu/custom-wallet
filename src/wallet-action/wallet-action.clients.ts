import config from '@circle/config';
import { KFK_CLIENTS, KFK_GROUPS, KFK_NAMES } from '@circle/utils/constants';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const KafkaClients: ClientProviderOptions[] = [
  {
    name: KFK_NAMES.BANK_SERVICE,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: KFK_CLIENTS.BANK_CLIENT,
        brokers: config.kafka.brokers,
      },
      consumer: {
        groupId: KFK_GROUPS.BANK_GROUP,
      },
    },
  },
  {
    name: KFK_NAMES.SAVINGS_SERVICE,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: KFK_CLIENTS.SAVINGS_CLIENT,
        brokers: config.kafka.brokers,
      },
      consumer: {
        groupId: KFK_GROUPS.SAVINGS_GROUP,
      },
    },
  },
  {
    name: KFK_NAMES.BILLS_SERVICE,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: KFK_CLIENTS.BILLS_CLIENT,
        brokers: config.kafka.brokers,
      },
      consumer: {
        groupId: KFK_GROUPS.BILLS_GROUP,
      },
    },
  },
  {
    name: KFK_NAMES.INSURANCE_SERVICE,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: KFK_CLIENTS.INSURANCE_CLIENT,
        brokers: config.kafka.brokers,
      },
      consumer: {
        groupId: KFK_GROUPS.INSURANCE_GROUP,
      },
    },
  },
  {
    name: KFK_NAMES.STOCK_TRADING_SERVICE,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: KFK_CLIENTS.STOCK_TRADING_CLIENT,
        brokers: config.kafka.brokers,
      },
      consumer: {
        groupId: KFK_GROUPS.STOCK_TRADING_GROUP,
      },
    },
  },
  {
    name: KFK_NAMES.LOAN_SERVICE,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: KFK_CLIENTS.LOAN_CLIENT,
        brokers: config.kafka.brokers,
      },
      consumer: {
        groupId: KFK_GROUPS.LOAN_GROUP,
      },
    },
  },
  {
    name: KFK_NAMES.INVESTMENT_SERVICE,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: KFK_CLIENTS.INVESTMENT_CLIENT,
        brokers: config.kafka.brokers,
      },
      consumer: {
        groupId: KFK_GROUPS.INVESTMENT_GROUP,
      },
    },
  },
  {
    name: KFK_NAMES.CREDIT_CARD_SERVICE,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: KFK_CLIENTS.CREDIT_CARD_CLIENT,
        brokers: config.kafka.brokers,
      },
      consumer: {
        groupId: KFK_GROUPS.CREDIT_CARD_GROUP,
      },
    },
  },
];
