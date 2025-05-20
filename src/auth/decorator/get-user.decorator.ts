import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      return null;
    }

    if (data) {
      return (request.user as any)[data]; // or define a proper user type
    }
    return request.user;
  },
);
