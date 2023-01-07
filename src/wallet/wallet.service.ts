import { ERROR_CODES } from '@circle/utils/constants';
import { ErrorResponse } from '@circle/utils/error.util';
import { Injectable } from '@nestjs/common';
import { Currency, Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaClient, private error: ErrorResponse) {}

  async lockWallet(userId: string, currency: Currency) {
    const wallet = await this.getOrCreate(currency, userId);

    if (wallet.locked)
      this.error.badRequest(ERROR_CODES.WALLET_LOCKED, {
        message: 'Please try again in a few minutes',
      });

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { locked: true },
    });
  }

  async unlockWallet(
    userId: string,
    currency: Currency,
    lastEventtId?: string,
  ) {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        userId,
        currency,
      },
      select: { id: true },
    });

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { locked: false, lastEventtId },
    });
  }

  async create(userId: string, currency: Currency) {
    return await this.prisma.wallet.create({
      data: {
        currency,
        userId,
      },
    });
  }

  async creditWallet(
    prisma: Prisma.TransactionClient,
    currency: Currency,
    userId: string,
    amount: number,
  ) {
    const { id } = await this.getOrCreate(currency, userId);
    return prisma.wallet.update({
      where: { id },
      data: { balance: { increment: amount } },
    });
  }

  async debitWallet(
    prisma: Prisma.TransactionClient,
    currency: Currency,
    userId: string,
    amount: number,
  ) {
    const { id, balance } = await this.getOrCreate(currency, userId);
    if (balance - amount <= 0) {
      this.unlockWallet(userId, currency);
      throw this.error.badRequest(
        ERROR_CODES.INSUFFICIENT_WALLET_BALANCE,
        'InSufficient balance to complete this transaction',
      );
    }

    return prisma.wallet.update({
      where: { id },
      data: { balance: { decrement: amount } },
    });
  }

  async getOrCreate(currency: Currency, userId: string) {
    let wallet = await this.prisma.wallet.findFirst({
      where: {
        currency,
        userId,
      },
    });
    if (!wallet)
      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          currency,
        },
      });

    return wallet;
  }

  async getAllUserWallets(userId: string) {
    return this.prisma.wallet.findMany({
      where: { userId },
    });
  }

  async generateUserAssetWallets(userId: string, currency: Currency) {
    await this.getOrCreate(currency, userId);
    await this.getOrCreate(Currency.USD, userId);
  }
}
