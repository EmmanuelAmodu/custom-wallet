import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './jwt-guard/jwt-guard.guard';
import { OtpGuard } from './otp-guard/otp-guard.guard';
import { OtpLevel } from './otp.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @UseGuards(OtpGuard)
  @OtpLevel('get-hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
