import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Currency,
  TransactionEventType,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';

export interface CreateTransactionDto {
  amount: number;
  currency: Currency;
  userId: string;
  eventType: TransactionEventType;
  type: TransactionType;
  memo?: string;
  thirdPartyTxId?: string;
  cryptoAddress?: string;
  eventId?: string;
}

export class QueryTransactionHistoryDto {
  @ApiPropertyOptional({ type: String, enum: Currency })
  currency?: Currency;
  @ApiPropertyOptional({ type: String, enum: TransactionType })
  type?: TransactionType;
  @ApiPropertyOptional({ type: String, enum: TransactionStatus })
  status?: TransactionStatus;
  @ApiPropertyOptional({ type: String, enum: TransactionEventType })
  action?: TransactionEventType;
  @ApiPropertyOptional({ type: Date, example: new Date() })
  from?: Date;
  @ApiPropertyOptional({ type: Date, example: new Date() })
  to?: Date;
}
