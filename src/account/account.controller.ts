// account.controller.ts
import { Get, Post, Param, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { AccountAccessGuard } from './guards/account.guard';
import { BearerAuthPackDecorator } from '../utils/nest.utils';
import { BasicApiDecorators } from '../utils/swagger.utils';
import { Serialize } from '../interceptors/serialize.interceptor';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@BearerAuthPackDecorator({ path: 'Account', version: '1' })
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'Create a new account',
    },
    description: 'Account created successfully',
    isArray: false,
    dto: Account,
  })
  @Serialize(Account)
  @Post()
  async createAccount(@GetUser() user: User): Promise<Account> {
    return this.accountService.createAccount(user);
  }

  @BasicApiDecorators({
    response: 200,
    operation: {
      summary: 'Get all accounts',
    },
    description: 'All accounts retrieved successfully',
    isArray: false,
    dto: Account,
  })
  @Serialize(Account)
  @Get()
  async getAllAccounts(@GetUser() user: User): Promise<Account[]> {
    return this.accountService.getAllAccounts(user);
  }

  @BasicApiDecorators({
    response: 200,
    operation: {
      summary: 'Get account by account number',
    },
    description: 'Account retrieved successfully',
    isArray: false,
    dto: Account,
  })
  @Serialize(Account)
  @Get(':accountNumber')
  @UseGuards(AccountAccessGuard)
  async getAccountById(
    @Param('accountNumber') accountNumber: string,
  ): Promise<Account> {
    return this.accountService.getAccountById(accountNumber);
  }
}
