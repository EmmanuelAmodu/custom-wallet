import config from '../../config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { InternalCacheService } from '@circle/internal-cache/internal-cache.service';

export interface AuthToken {
  userId: string;
  exp: number;
  access: string[];
  ip: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private cacheService: InternalCacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    const authData = await this.cacheService.get<AuthToken>(payload.authId);
    if (!authData)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    request['authData'] = authData;
    return authData;
  }
}
