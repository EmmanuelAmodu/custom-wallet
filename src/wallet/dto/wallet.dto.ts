import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Currency } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ type: String })
  currency: string;

  @ApiHideProperty()
  userId: string;
}

export class CreateUserAsset {
  @IsString()
  userId: string;

  @IsEnum(Currency)
  currency: Currency;
}
