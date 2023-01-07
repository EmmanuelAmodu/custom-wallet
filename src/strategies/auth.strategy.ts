import config from '@circle/config';
import { HttpException, HttpStatus, Injectable, Next } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { InternalCacheService } from '@circle/internal-cache/internal-cache.service';

interface AuthData {
  userId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly cache: InternalCacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    // const authData = await this.cache.get<AuthData>(payload.authId);
    const authData = {
      userId: 'cl96tquwf0000qlwyyyd65yes',
    };

    if (authData) {
      request['authData'] = authData;
      return authData;
    }

    throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  }
}
