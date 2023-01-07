import { ApiProperty } from '@nestjs/swagger';
import {
  BillType,
  Currency,
  InsuranceType,
  SavingsType,
  TransactionEventType,
  TransactionStatus,
} from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUppercase,
} from 'class-validator';

export class ConvertActionDto {
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  sourceCurrency: Currency;
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  destCurrency: Currency;
  @ApiProperty({ type: Number, required: true, example: 10 })
  amount: number;
}

export class InternalTransferActionDto {
  @ApiProperty({ type: String, required: true, example: '' })
  targetUser: string;
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  currency: Currency;
  @ApiProperty({ type: Number, required: true, example: 200 })
  amount: number;
}

export class WithdrawalActionDto {
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  currency: Currency;
  @ApiProperty({ type: Number, required: true, example: 200 })
  amount: number;
  @ApiProperty({ type: String, required: true, example: '' })
  accountId: string;
}

export class SavingsActionDto {
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  currency: Currency;
  @ApiProperty({ type: Number, required: true, example: 200 })
  amount: number;
  @ApiProperty({
    type: String,
    enum: SavingsType,
    required: true,
    example: 'NGN',
  })
  savingsType: SavingsType;
}

export class BillPaymentActionDto {
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  currency: Currency;
  @ApiProperty({ type: Number, required: true, example: 200 })
  amount: number;
  @ApiProperty({
    type: String,
    enum: BillType,
    required: true,
    example: 'AIRTIME',
  })
  billType: BillType;
  @ApiProperty({ required: true })
  billData: Record<string, any>;
}

export class InsuranceActionDto {
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  currency: Currency;
  @ApiProperty({ type: Number, required: true, example: 200 })
  amount: number;
  @ApiProperty({
    type: String,
    enum: SavingsType,
    required: true,
    example: 'CAR_INSURANCE',
  })
  insuranceType: InsuranceType;
  @ApiProperty({ required: true })
  insuranceData: Record<string, any>;
}

export class StockTradeActionDto {
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  currency: Currency;
  @ApiProperty({ type: Number, required: true, example: 200 })
  amount: number;
  @ApiProperty({ required: true })
  stockTradingData: Record<string, any>;
}

export class DepositActionDto {
  @IsString()
  @IsUppercase()
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  currency: Currency;
  @IsNumber()
  amount: number;
  @IsString()
  userId: string;
}

export class InvestmentActionDto {
  @IsString()
  @IsUppercase()
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  currency: Currency;
  @IsNumber()
  amount: number;
}

export class CreditCardActionDto {
  @IsString()
  @IsUppercase()
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  currency: Currency;
  @IsNumber()
  amount: number;
}

export class LoanActionDto {
  @IsString()
  @IsUppercase()
  @ApiProperty({
    type: String,
    enum: Currency,
    required: true,
    example: 'NGN',
  })
  currency: Currency;
  @IsNumber()
  amount: number;
  @IsString()
  userId: string;
}

export class ExternalTransactionActionDto {
  @IsString()
  @IsNotEmpty()
  thirdPartyTxId: string;
  @IsEnum(TransactionEventType)
  txType: TransactionEventType;
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
  @IsObject()
  data: DepositActionDto;
  @IsObject()
  thirdPartyDetails?: any;
}
