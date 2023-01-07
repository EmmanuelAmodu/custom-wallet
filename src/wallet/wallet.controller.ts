import { JwtAuthGuard } from '@circle/auth/auth.guard';
import { AuthToken } from '@circle/auth/auth.strategy';
import { GetAuthData } from '@circle/auth/get-user.decorator';
import { HttpResponse } from '@circle/utils/http.response';
import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserAsset } from './dto/wallet.dto';
import { WalletService } from './wallet.service';
import { Currency } from '@prisma/client';

@Controller('wallet')
export class WalletController {
  constructor(
    private walletService: WalletService,
    private response: HttpResponse,
  ) {}

  @Get('wallet/:currency')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'get or create a asset wallet' })
  @ApiParam({ enum: Currency, name: 'currency' })
  async getUserWallet(
    @GetAuthData() auth: AuthToken,
    @Param('currency') currency: Currency,
    @Res() res: Response,
  ) {
    const wallet = await this.walletService.getOrCreate(currency, auth.userId);
    return this.response.okResponse(res, 'Fetched User Asset Balance', wallet);
  }

  @Get('wallet')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'get all user wallets' })
  async getAllUserWallet(@GetAuthData() auth: AuthToken, @Res() res: Response) {
    const wallets = await this.walletService.getAllUserWallets(auth.userId);
    return this.response.okResponse(
      res,
      'Fetched All User Asset Balances',
      wallets,
    );
  }

  @EventPattern({ cmd: 'create-user-wallet' })
  async createUserAssets(@Payload() data: CreateUserAsset) {
    await this.walletService.generateUserAssetWallets(
      data.userId,
      data.currency,
    );
  }
}
