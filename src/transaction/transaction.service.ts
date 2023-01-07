import { ERROR_CODES } from '@circle/utils/constants';
import { ErrorResponse } from '@circle/utils/error.util';
import { WalletService } from '@circle/wallet/wallet.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma,
  PrismaClient,
  TransactionStatus,
  TransactionStatusEvent,
  TransactionType,
} from '@prisma/client';
import {
  CreateTransactionDto,
  QueryTransactionHistoryDto,
} from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  private validTransitions: {
    [key: string]: TransactionStatus[];
  } = {
    [TransactionStatus.INIT]: [
      TransactionStatus.PENDING,
      TransactionStatus.FAILED,
      TransactionStatus.CONFIRMED,
    ],
    [TransactionStatus.PENDING]: [
      TransactionStatus.PENDING,
      TransactionStatus.FAILED,
      TransactionStatus.CONFIRMED,
    ],
  };

  constructor(
    private prisma: PrismaClient,
    private walletService: WalletService,
    private error: ErrorResponse,
  ) {}

  async createTransaction(
    prisma: Prisma.TransactionClient,
    data: CreateTransactionDto,
  ) {
    let wallet = await this.walletService.getOrCreate(
      data.currency,
      data.userId,
    );

    if (data.type == TransactionType.DEBIT) {
      wallet = await this.walletService.debitWallet(
        prisma,
        data.currency,
        data.userId,
        data.amount,
      );
    }

    return prisma.transaction.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        userId: data.userId,
        eventId: data.eventId,
        eventType: data.eventType,
        type: data.type,
        walletId: wallet.id,
        statusEvents: { create: [{ status: 'INIT' }] },
      },
    });
  }

  async updateTransactionStatus(
    id: string,
    status: TransactionStatus,
    thirdPartyDetails?: any,
  ) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        statusEvents: {
          orderBy: { createdAt: 'desc' },
        },
        wallet: true,
      },
    });

    if (!transaction)
      throw this.error.badRequest(ERROR_CODES.ILLEGAL_TRANSACTION_STATUS, {
        message: 'Cannot update status for a transaction that does not exist',
      });

    const lastStatus = transaction.statusEvents[0];
    this.validateStatusTransition(lastStatus, status);

    await this.prisma.transactionStatusEvent.create({
      data: {
        transactionId: transaction.id,
        status,
        thirdPartyDetails,
      },
    });

    if (
      status === TransactionStatus.CONFIRMED &&
      transaction.type == TransactionType.CREDIT
    ) {
      await this.walletService.creditWallet(
        this.prisma,
        transaction.wallet.currency,
        transaction.userId,
        transaction.amount,
      );
    }

    if (
      status === TransactionStatus.FAILED &&
      transaction.type == TransactionType.DEBIT
    ) {
      // TODO implement reversal
    }

    await this.prisma.transactionStatusEvent.create({
      data: {
        transactionId: id,
        status,
      },
    });
  }

  validateStatusTransition(
    statusEvent: TransactionStatusEvent,
    status: TransactionStatus,
  ) {
    const legalTransitions = this.validTransitions[statusEvent.status];
    if (!legalTransitions.includes(status))
      this.error.badRequest(ERROR_CODES.ILLEGAL_STATUS_TRANSITION, {
        message: 'Cannot update status for a transaction that does not exist',
      });

    return true;
  }

  async getUserTransactions(userId: string, query: QueryTransactionHistoryDto) {
    const filter: Record<string, any> = {};

    if (query.currency) filter.currency = query.currency;
    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;
    if (query.from) filter.createdAt = { gte: new Date(query.from) };
    if (query.to) filter.createdAt = { lte: new Date(query.to) };

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        ...filter,
      },
      select: {
        id: true,
        currency: true,
        amount: true,
        type: true,
        status: true,
        eventType: true,
        eventId: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return transactions;
  }

  async getTransactionDetails(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) throw new NotFoundException('Transaction Does Not Exist');

    return transaction;
  }
}
