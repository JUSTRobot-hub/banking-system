import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { StrategyName } from '../../constants/enums.constants';

@Injectable()
export class UserAuthGuard extends AuthGuard(StrategyName.JwtUserStrategy) {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    let isAuthenticated: boolean;

    try {
      isAuthenticated = await (super.canActivate(context) as Promise<boolean>);
    } catch (e) {}
    if (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    ) {
      return true;
    }

    if (isAuthenticated) {
      return true;
    }

    return false;
  }
}
