import { TransactionService } from '@circle/transaction/transaction.service';
import { FEE, KFK_NAMES } from '@circle/utils/constants';
import { WalletService } from '@circle/wallet/wallet.service';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  PrismaClient,
  Transaction,
  TransactionEventType,
  TransactionStatus,
  TransactionType,
  Currency,
} from '@prisma/client';
import { lastValueFrom } from 'rxjs';
import {
  DepositActionDto,
  WithdrawalActionDto,
  ConvertActionDto,
  ExternalTransactionActionDto,
  InternalTransferActionDto,
  SavingsActionDto,
  BillPaymentActionDto,
  InsuranceActionDto,
  StockTradeActionDto,
  LoanActionDto,
  InvestmentActionDto,
  CreditCardActionDto,
} from './dto/wallet-action.dto';

@Injectable()
export class WalletActionService {
  constructor(
    private prisma: PrismaClient,
    private transactionService: TransactionService,
    private walletService: WalletService,
    @Inject(KFK_NAMES.BANK_SERVICE)
    private readonly bankclient: ClientProxy,
    @Inject(KFK_NAMES.SAVINGS_SERVICE)
    private readonly savingsclient: ClientProxy,
    @Inject(KFK_NAMES.BILLS_SERVICE)
    private readonly billsclient: ClientProxy,
    @Inject(KFK_NAMES.INSURANCE_SERVICE)
    private readonly insuranceclient: ClientProxy,
    @Inject(KFK_NAMES.STOCK_TRADING_SERVICE)
    private readonly stockTradeclient: ClientProxy,
    @Inject(KFK_NAMES.LOAN_SERVICE)
    private readonly loanclient: ClientProxy,
    @Inject(KFK_NAMES.INVESTMENT_SERVICE)
    private readonly investclient: ClientProxy,
    @Inject(KFK_NAMES.CREDIT_CARD_SERVICE)
    private readonly creditCardClient: ClientProxy,
  ) {}

  async convertAction(userId: string, data: ConvertActionDto) {
    const { exchangeRate, fees, finalAmount } = await this.calculateConvertRate(
      data.sourceCurrency,
      data.destCurrency,
      data.amount,
      FEE.convert,
    );

    let sourceTx: Transaction, destinationTx: Transaction;
    await this.walletService.lockWallet(userId, data.sourceCurrency);
    const convert = await this.prisma.$transaction(async (prisma) => {
      const convert = await prisma.convertEvent.create({
        data: {
          currencyFrom: data.sourceCurrency,
          currencyTo: data.destCurrency,
          fromAmount: data.amount,
          exchangeRate,
          fees,
          toAmount: finalAmount,
        },
      });

      sourceTx = await this.transactionService.createTransaction(prisma, {
        amount: data.amount,
        userId,
        currency: data.sourceCurrency,
        eventType: TransactionEventType.ConvertEvent,
        eventId: convert.id,
        type: TransactionType.DEBIT,
      });

      destinationTx = await this.transactionService.createTransaction(prisma, {
        amount: finalAmount,
        userId,
        eventId: convert.id,
        currency: data.destCurrency,
        eventType: TransactionEventType.ConvertEvent,
        type: TransactionType.CREDIT,
      });

      return convert;
    });

    await this.transactionService.updateTransactionStatus(
      sourceTx.id,
      TransactionStatus.CONFIRMED,
    );

    await this.transactionService.updateTransactionStatus(
      destinationTx.id,
      TransactionStatus.CONFIRMED,
    );

    await this.walletService.unlockWallet(
      userId,
      data.sourceCurrency,
      convert.id,
    );
    return convert;
  }

  async internalTransferAction(
    fromUser: string,
    data: InternalTransferActionDto,
  ) {
    const fees = data.amount * FEE.internalTransfer;
    const finalAmount = data.amount - fees;

    let sourceTx: Transaction, destinationTx: Transaction;
    await this.walletService.lockWallet(fromUser, data.currency);
    const internalTransfer = await this.prisma.$transaction(async (prisma) => {
      const internalTransfer = await prisma.internalTransferEvent.create({
        data: {
          fromUser,
          fees,
          toUser: data.targetUser,
          amount: data.amount,
          currency: data.currency,
        },
      });

      sourceTx = await this.transactionService.createTransaction(prisma, {
        amount: data.amount,
        userId: fromUser,
        currency: data.currency,
        eventType: TransactionEventType.InternalTransferEvent,
        eventId: internalTransfer.id,
        type: TransactionType.DEBIT,
      });

      destinationTx = await this.transactionService.createTransaction(prisma, {
        amount: finalAmount,
        userId: data.targetUser,
        currency: data.currency,
        eventType: TransactionEventType.InternalTransferEvent,
        eventId: internalTransfer.id,
        type: TransactionType.CREDIT,
      });

      return internalTransfer;
    });

    await this.transactionService.updateTransactionStatus(
      sourceTx.id,
      TransactionStatus.CONFIRMED,
    );
    await this.transactionService.updateTransactionStatus(
      destinationTx.id,
      TransactionStatus.CONFIRMED,
    );

    await this.walletService.unlockWallet(
      fromUser,
      data.currency,
      internalTransfer.id,
    );
    return internalTransfer;
  }

  async withdrawalAction(userId: string, data: WithdrawalActionDto) {
    const fees = data.amount * FEE.withdrawal;
    const finalAmount = data.amount - fees;

    await this.walletService.lockWallet(userId, data.currency);
    const Withdrawal = await this.prisma.$transaction(async (prisma) => {
      const Withdrawal = await prisma.withdrawalEvent.create({
        data: {
          userId,
          fees,
          amount: data.amount,
          currency: data.currency,
        },
      });

      const sourceTx = await this.transactionService.createTransaction(prisma, {
        amount: data.amount,
        userId,
        currency: data.currency,
        eventType: TransactionEventType.WithdrawalEvent,
        eventId: Withdrawal.id,
        type: TransactionType.DEBIT,
      });

      Object.assign(sourceTx, {
        accountId: data.accountId,
        amount: finalAmount,
      });
      this.bankclient.emit(
        { cmd: 'withdrawal', access: ['user.withdrawal'] },
        sourceTx,
      );

      return Withdrawal;
    });

    await this.walletService.unlockWallet(userId, data.currency, Withdrawal.id);
    return Withdrawal;
  }

  private async depositAction(thirdPartyTxId: string, data: DepositActionDto) {
    const fees = data.amount * FEE.deposit;
    const finalAmount = data.amount - fees;

    return this.prisma.$transaction(async (prisma) => {
      const Deposit = await this.prisma.depositEvent.create({
        data: {
          fees,
          userId: data.userId,
          currency: data.currency,
          amount: data.amount,
        },
      });

      return this.transactionService.createTransaction(prisma, {
        amount: finalAmount,
        userId: data.userId,
        currency: data.currency,
        eventType: TransactionEventType.WithdrawalEvent,
        eventId: Deposit.id,
        type: TransactionType.CREDIT,
        thirdPartyTxId,
      });
    });
  }

  async savingsAction(userId: string, data: SavingsActionDto) {
    const fees = data.amount * FEE.savings;
    const finalAmount = data.amount - fees;

    await this.walletService.lockWallet(userId, data.currency);
    const savings = await this.prisma.$transaction(async (prisma) => {
      const savings = await prisma.savingsEvent.create({
        data: {
          userId,
          fees,
          amount: data.amount,
          currency: data.currency,
          savingsType: data.savingsType,
        },
      });

      const sourceTx = await this.transactionService.createTransaction(prisma, {
        amount: data.amount,
        userId,
        currency: data.currency,
        eventType: TransactionEventType.SavingsEvent,
        eventId: savings.id,
        type: TransactionType.DEBIT,
      });

      await lastValueFrom(
        this.savingsclient.emit(
          { cmd: 'savings', access: ['user.withdrawal'] },
          {
            data: savings,
            txId: sourceTx.id,
            finalAmount,
          },
        ),
      );

      return savings;
    });

    await this.walletService.unlockWallet(userId, data.currency, savings.id);
    return savings;
  }

  async paybillsAction(userId: string, data: BillPaymentActionDto) {
    const fees = data.amount * FEE.bill;
    const finalAmount = data.amount - fees;

    await this.walletService.lockWallet(userId, data.currency);
    const bills = await this.prisma.$transaction(async (prisma) => {
      const bills = await prisma.billPaymentEvent.create({
        data: {
          userId,
          fees,
          amount: data.amount,
          currency: data.currency,
          billType: data.billType,
          billData: data.billData,
        },
      });

      const sourceTx = await this.transactionService.createTransaction(prisma, {
        amount: data.amount,
        userId,
        currency: data.currency,
        eventType: TransactionEventType.BillPaymentEvent,
        eventId: bills.id,
        type: TransactionType.DEBIT,
      });

      await lastValueFrom(
        this.billsclient.emit(
          { cmd: 'savings', access: ['user.withdrawal'] },
          {
            data: bills,
            txId: sourceTx.id,
            finalAmount,
          },
        ),
      );

      return bills;
    });

    await this.walletService.unlockWallet(userId, data.currency, bills.id);
    return bills;
  }

  async insuranceAction(userId: string, data: InsuranceActionDto) {
    const fees = data.amount * FEE.insurance;
    const finalAmount = data.amount - fees;

    await this.walletService.lockWallet(userId, data.currency);
    const insurance = await this.prisma.$transaction(async (prisma) => {
      const insurance = await prisma.insuranceEvent.create({
        data: {
          userId,
          fees,
          amount: data.amount,
          currency: data.currency,
          insuranceType: data.insuranceType,
          insuranceData: data.insuranceData,
        },
      });

      const sourceTx = await this.transactionService.createTransaction(prisma, {
        amount: data.amount,
        userId,
        currency: data.currency,
        eventType: TransactionEventType.InsuranceEvent,
        eventId: insurance.id,
        type: TransactionType.DEBIT,
      });

      await lastValueFrom(
        this.insuranceclient.emit(
          { cmd: 'savings', access: ['user.withdrawal'] },
          {
            data: insurance,
            txId: sourceTx.id,
            finalAmount,
          },
        ),
      );

      return insurance;
    });

    await this.walletService.unlockWallet(userId, data.currency, insurance.id);
    return insurance;
  }

  async stockTradeAction(userId: string, data: StockTradeActionDto) {
    const fees = data.amount * FEE.stock;
    const finalAmount = data.amount - fees;

    await this.walletService.lockWallet(userId, data.currency);
    const stockTrading = await this.prisma.$transaction(async (prisma) => {
      const stockTrading = await prisma.tradeStockEvent.create({
        data: {
          userId,
          fees,
          amount: data.amount,
          currency: data.currency,
          tradeStockData: data.stockTradingData,
        },
      });

      const sourceTx = await this.transactionService.createTransaction(prisma, {
        amount: data.amount,
        userId,
        currency: data.currency,
        eventType: TransactionEventType.TradeStockEvent,
        eventId: stockTrading.id,
        type: TransactionType.DEBIT,
      });

      await lastValueFrom(
        this.stockTradeclient.emit(
          { cmd: 'savings', access: ['user.withdrawal'] },
          {
            data: stockTrading,
            txId: sourceTx.id,
            finalAmount,
          },
        ),
      );

      return stockTrading;
    });

    await this.walletService.unlockWallet(
      userId,
      data.currency,
      stockTrading.id,
    );
    return stockTrading;
  }

  async loanAction(userId: string, data: LoanActionDto) {
    const fees = data.amount * FEE.loan;
    const finalAmount = data.amount - fees;

    await this.walletService.lockWallet(userId, data.currency);
    const loanTrading = await this.prisma.$transaction(async (prisma) => {
      const loanTrading = await prisma.loanEvent.create({
        data: {
          userId,
          fees,
          amount: data.amount,
          currency: data.currency,
        },
      });

      const sourceTx = await this.transactionService.createTransaction(prisma, {
        amount: data.amount,
        userId,
        currency: data.currency,
        eventType: TransactionEventType.LoanEvent,
        eventId: loanTrading.id,
        type: TransactionType.DEBIT,
      });

      await lastValueFrom(
        this.loanclient.emit(
          { cmd: 'savings', access: ['user.withdrawal'] },
          {
            data: loanTrading,
            txId: sourceTx.id,
            finalAmount,
          },
        ),
      );

      return loanTrading;
    });

    await this.walletService.unlockWallet(
      userId,
      data.currency,
      loanTrading.id,
    );
    return loanTrading;
  }

  async investmentAction(userId: string, data: InvestmentActionDto) {
    const fees = data.amount * FEE.investment;
    const finalAmount = data.amount - fees;

    await this.walletService.lockWallet(userId, data.currency);
    const investment = await this.prisma.$transaction(async (prisma) => {
      const investment = await prisma.investmentEvent.create({
        data: {
          userId,
          fees,
          amount: data.amount,
          currency: data.currency,
        },
      });

      const sourceTx = await this.transactionService.createTransaction(prisma, {
        amount: data.amount,
        userId,
        currency: data.currency,
        eventType: TransactionEventType.InvestmentEvent,
        eventId: investment.id,
        type: TransactionType.DEBIT,
      });

      await lastValueFrom(
        this.investclient.emit(
          { cmd: 'savings', access: ['user.withdrawal'] },
          {
            data: investment,
            txId: sourceTx.id,
            finalAmount,
          },
        ),
      );

      return investment;
    });

    await this.walletService.unlockWallet(userId, data.currency, investment.id);
    return investment;
  }

  async creditCardAction(userId: string, data: CreditCardActionDto) {
    const fees = data.amount * FEE.creditCard;
    const finalAmount = data.amount - fees;

    await this.walletService.lockWallet(userId, data.currency);
    const creditCard = await this.prisma.$transaction(async (prisma) => {
      const creditCard = await prisma.creditCardEvent.create({
        data: {
          userId,
          fees,
          amount: data.amount,
          currency: data.currency,
        },
      });

      const sourceTx = await this.transactionService.createTransaction(prisma, {
        amount: data.amount,
        userId,
        currency: data.currency,
        eventType: TransactionEventType.CreditCardEvent,
        eventId: creditCard.id,
        type: TransactionType.DEBIT,
      });

      await lastValueFrom(
        this.creditCardClient.emit(
          { cmd: 'savings', access: ['user.withdrawal'] },
          {
            data: creditCard,
            txId: sourceTx.id,
            finalAmount,
          },
        ),
      );

      return creditCard;
    });

    await this.walletService.unlockWallet(userId, data.currency, creditCard.id);
    return creditCard;
  }

  async externalTransactionEvent(data: ExternalTransactionActionDto) {
    let transaction = await this.prisma.transaction.findFirst({
      where: { thirdPartyTxId: data.thirdPartyTxId },
    });

    if (!transaction) {
      switch (data.txType) {
        case TransactionEventType.DepositEvent:
          transaction = await this.depositAction(
            data.thirdPartyTxId,
            data.data,
          );
          break;
        default:
          break;
      }
    }

    await this.transactionService.updateTransactionStatus(
      transaction.id,
      data.status,
      data.thirdPartyDetails,
    );
  }

  async calculateConvertRate(
    currencyFrom: Currency,
    currencyTo: Currency,
    amount: number,
    feePercentage: number,
  ) {
    const fromRate = await this.prisma.assetPrice.findFirst({
      where: { currency: currencyFrom },
      orderBy: { priceAt: 'desc' },
      select: { amount: true },
    });

    const toRate = await this.prisma.assetPrice.findFirst({
      where: { currency: currencyTo },
      orderBy: { priceAt: 'desc' },
      select: { amount: true },
    });

    const exchangeRate = fromRate.amount / toRate.amount;
    const destinationAmount = exchangeRate * amount;
    const fees = destinationAmount * (feePercentage / 100);
    const finalAmount = destinationAmount - fees;

    return { exchangeRate, destinationAmount, fees, finalAmount };
  }
}
