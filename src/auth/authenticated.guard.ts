import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const response = context.switchToHttp().getResponse();

    return response.isAuthenticated();
  }
}
