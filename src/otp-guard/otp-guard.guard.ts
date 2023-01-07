import { InternalCacheService } from '@circle/internal-cache/internal-cache.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class OtpGuard implements CanActivate {
  constructor(
    private readonly cache: InternalCacheService,
    private reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const levels = this.reflector.get<string[]>('levels', context.getHandler());
    if (!levels) return true;

    const request = context.switchToHttp().getRequest();
    const authData = request.authData;

    let hasAccess: boolean;

    this.getServiceAccess(levels, authData.userId).then((hasAccess) => {
      hasAccess = hasAccess;
    });

    return hasAccess;
  }

  async getServiceAccess(level: string | string[], userId: string) {
    const otp = await this.cache.get<string>(userId);
    if (!otp) throw new UnauthorizedException('Invalid Authorixation');
    const userOtp = otp.split('_');

    return true;
  }
}
