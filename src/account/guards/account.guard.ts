import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AccountService } from '../account.service';

@Injectable()
export class AccountAccessGuard implements CanActivate {
  constructor(private readonly accountService: AccountService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accountNumber = request.params.accountNumber;
    const userId = request.user?.id;
    try {
      const account = await this.accountService.getAccountByAccountNumber(
        accountNumber,
      );
      if (!account || account.blocked || account?.user?.id !== userId) {
        // Unauthorized access
        return false;
      }

      // Authorized access
      return true;
    } catch (e) {
      return false;
    }
  }
}
