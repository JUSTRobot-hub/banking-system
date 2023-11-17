import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async createAccount(user: User) {
    const accounts = await this.accountRepository.find({
      where: { user: { id: user.id } },
    });

    if (accounts.length >= user.maxAllowedAccounts)
      throw new BadRequestException(
        'You have reached the maximum number of accounts',
      );

    const account = this.accountRepository.create({
      accountNumber: `${Math.floor(Math.random() * 1000000000000000)}`,
      IBAN: `EG${Math.floor(Math.random() * 1000000000000000)}`,
      user,
    });
    return this.accountRepository.save(account);
  }

  async getAllAccounts(user: User): Promise<Account[]> {
    return this.accountRepository.find({ where: { user: { id: user.id } } });
  }

  async getAccountById(accountNumber: string): Promise<Account> {
    return this.accountRepository.findOne({
      where: { accountNumber },
    });
  }

  async getAccountByAccountNumber(accountNumber: string): Promise<Account> {
    return this.accountRepository.findOne({
      where: { accountNumber },
      relations: ['user'],
    });
  }

  async deleteAccount(accountNumber: string): Promise<Account> {
    const accountToDelete = await this.getAccountByAccountNumber(accountNumber);
    if (accountToDelete) {
      await this.accountRepository.softDelete(accountNumber);
      return accountToDelete;
    }
    return null;
  }

  managerTransaction(body) {
    return this.accountRepository.manager.transaction(body);
  }

  async eligible(user: User, accountNumber: string) {
    const account = await this.getAccountByAccountNumber(accountNumber);
    if (!account) throw new NotFoundException('Account not found');
    if (account.blocked) throw new BadRequestException('Account is blocked');
    if (account.user.id !== user.id) throw new BadRequestException();
    return { success: true };
  }
}
