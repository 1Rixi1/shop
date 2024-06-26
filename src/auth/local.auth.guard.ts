import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const response = context.switchToHttp().getRequest();

    const isAuth = (await super.canActivate(context)) as boolean;

    await super.logIn(response);

    return isAuth;
  }
}
