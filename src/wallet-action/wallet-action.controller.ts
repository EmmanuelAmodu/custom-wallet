import { JwtAuthGuard } from '@circle/auth/auth.guard';
import { AuthToken } from '@circle/auth/auth.strategy';
import { GetAuthData } from '@circle/auth/get-user.decorator';
import { HttpResponse } from '@circle/utils/http.response';
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import {
  ConvertActionDto,
  WithdrawalActionDto,
  InternalTransferActionDto,
  ExternalTransactionActionDto,
  SavingsActionDto,
  BillPaymentActionDto,
  InsuranceActionDto,
  StockTradeActionDto,
  LoanActionDto,
  InvestmentActionDto,
} from './dto/wallet-action.dto';
import { WalletActionService } from './wallet-action.service';

@Controller('wallet-action')
export class WalletActionController {
  constructor(
    private readonly walletActionService: WalletActionService,
    private response: HttpResponse,
  ) {}

  @Post('convert')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'convert currency symbol' })
  async createConvertAction(
    @GetAuthData() authData: AuthToken,
    @Body() data: ConvertActionDto,
    @Res() res: Response,
  ) {
    const convert = await this.walletActionService.convertAction(
      authData.userId,
      data,
    );

    return this.response.okResponse(
      res,
      'Asset Converted Successfully',
      convert,
    );
  }

  @Post('transfer')
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'send asset amount to another user on the platform',
  })
  async createInternalTransactionAction(
    @GetAuthData() authData: AuthToken,
    @Body() data: InternalTransferActionDto,
    @Res() res: Response,
  ) {
    const transfer = await this.walletActionService.internalTransferAction(
      authData.userId,
      data,
    );

    return this.response.okResponse(
      res,
      'Asset Transferred Successfully',
      transfer,
    );
  }

  @Post('withdrawal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'withdraw from balance',
  })
  async createWithdrawalAction(
    @GetAuthData() authData: AuthToken,
    @Body() data: WithdrawalActionDto,
    @Res() res: Response,
  ) {
    const Withdrawal = await this.walletActionService.withdrawalAction(
      authData.userId,
      data,
    );

    return this.response.okResponse(res, 'Withdrawal Created', Withdrawal);
  }

  @Post('savings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'create savings',
  })
  async savingsAction(
    @GetAuthData() authData: AuthToken,
    @Body() data: SavingsActionDto,
    @Res() res: Response,
  ) {
    const savings = await this.walletActionService.savingsAction(
      authData.userId,
      data,
    );

    return this.response.okResponse(res, 'Savings Created', savings);
  }

  @Post('pay-bills')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'pay bills',
  })
  async paybillsAction(
    @GetAuthData() authData: AuthToken,
    @Body() data: BillPaymentActionDto,
    @Res() res: Response,
  ) {
    const bill = await this.walletActionService.paybillsAction(
      authData.userId,
      data,
    );

    return this.response.okResponse(res, 'Bill payment Created', bill);
  }

  @Post('insurance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'insurance plan',
  })
  async insuranceAction(
    @GetAuthData() authData: AuthToken,
    @Body() data: InsuranceActionDto,
    @Res() res: Response,
  ) {
    const insurance = await this.walletActionService.insuranceAction(
      authData.userId,
      data,
    );

    return this.response.okResponse(res, 'insurance Created', insurance);
  }

  @Post('stock-trade')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'insurance plan',
  })
  async stockTradeAction(
    @GetAuthData() authData: AuthToken,
    @Body() data: StockTradeActionDto,
    @Res() res: Response,
  ) {
    const stock = await this.walletActionService.stockTradeAction(
      authData.userId,
      data,
    );

    return this.response.okResponse(res, 'stock trade Created', stock);
  }

  @Post('loans')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'loan action created',
  })
  async loanAction(
    @GetAuthData() authData: AuthToken,
    @Body() data: LoanActionDto,
    @Res() res: Response,
  ) {
    const loan = await this.walletActionService.loanAction(
      authData.userId,
      data,
    );

    return this.response.okResponse(res, 'loans Created', loan);
  }

  @Post('investment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'loan action created',
  })
  async investmentAction(
    @GetAuthData() authData: AuthToken,
    @Body() data: InvestmentActionDto,
    @Res() res: Response,
  ) {
    const investment = await this.walletActionService.investmentAction(
      authData.userId,
      data,
    );

    return this.response.okResponse(res, 'investment Created', investment);
  }

  @Post('credit-card')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'loan action created',
  })
  async creditCardAction(
    @GetAuthData() authData: AuthToken,
    @Body() data: InvestmentActionDto,
    @Res() res: Response,
  ) {
    const creditCard = await this.walletActionService.creditCardAction(
      authData.userId,
      data,
    );

    return this.response.okResponse(res, 'credit card Created', creditCard);
  }

  @EventPattern({
    cmd: 'external-transaction-action',
    access: ['user.transaction.update'],
  })
  async createDepositAction(@Payload() data: ExternalTransactionActionDto) {
    await this.walletActionService.externalTransactionEvent(data);
  }
}
