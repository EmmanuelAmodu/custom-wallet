import { JwtAuthGuard } from '@circle/auth/auth.guard';
import { AuthToken } from '@circle/auth/auth.strategy';
import { GetAuthData } from '@circle/auth/get-user.decorator';
import { HttpResponse } from '@circle/utils/http.response';
import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { QueryTransactionHistoryDto } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private response: HttpResponse,
  ) {}

  @EventPattern({
    cmd: 'update-transaction',
    access: ['user.transaction.update'],
  })
  async updateTransaction(@Payload() data: any) {
    await this.transactionService.updateTransactionStatus(
      data.id,
      data.status,
      data.thirdPartyDetails,
    );
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'get all transaction history' })
  async getTransactionHistory(
    @GetAuthData() authData: AuthToken,
    @Query() query: QueryTransactionHistoryDto,
    @Res() res: Response,
  ) {
    const transactions = await this.transactionService.getUserTransactions(
      authData.userId,
      query,
    );

    return this.response.okResponse(
      res,
      'Fetched Transaction History',
      transactions,
    );
  }

  @Get('details/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'get transaction details' })
  async getTransactionDetails(@Param('id') id: string, @Res() res: Response) {
    const transaction = await this.transactionService.getTransactionDetails(id);

    return this.response.okResponse(
      res,
      'Fetched Transaction Details',
      transaction,
    );
  }
}
