import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAuthData = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.authData;

    return user;
  },
);
