import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmountDto, TransactionTransferDto } from './dto/transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { AccountService } from '../account/account.service';
import { ConfigService } from '../config/config.service';
import { PaginationDto } from '../utils/typeorm.utils';
import { Account } from '../account/entities/account.entity';
import { TransactionType } from '../constants/enums.constants';
import { DefaultResponseDto } from '../utils/swagger.utils';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private accountService: AccountService,
    private configService: ConfigService,
    private logger: Logger,
  ) {}

  async getAllTransactions(
    accountNumber: string,
    paginationDto: PaginationDto,
  ) {
    const [result, total] = await this.transactionRepository.findAndCount({
      where: { account: { accountNumber } },
      order: { createdAt: paginationDto.order },
      skip: (paginationDto.page - 1) * paginationDto.limit || 0,
      take: paginationDto.limit,
      relations: ['sender', 'receiver', 'sender.user', 'receiver.user'],
      select: {
        id: true,
        type: true,
        amount: true,
        createdAt: true,
        sender: {
          id: true,
          accountNumber: true,
          user: { id: true, firstName: true, lastName: true },
        },
        receiver: {
          id: true,
          accountNumber: true,
          user: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return {
      data: result,
      total,
      pages: Math.ceil(total / paginationDto.limit),
    };
  }

  async deposit(accountNumber: string, { amount }: AmountDto) {
    const appConfig = await this.configService.getConfig();
    if (amount < appConfig.minDeposit || amount > appConfig.maxDeposit) {
      this.logger.error(
        `${accountNumber}: amount ${amount} must be between - ${appConfig.maxDeposit} - ${appConfig.minDeposit}`,
      );
      throw new BadRequestException(
        `amount must be between ${appConfig.minDeposit} and ${appConfig.maxDeposit}`,
      );
    }

    return this.accountService.managerTransaction(
      async (transactionalEntityManager: any) => {
        const account = await transactionalEntityManager.findOne(Account, {
          where: { accountNumber },
          lock: { mode: 'pessimistic_write' },
        });

        if (!account) throw new NotFoundException('Account not found');

        account.balance += amount; // Update account balance

        const newTransaction = this.transactionRepository.create({
          type: TransactionType.Deposit,
          account,
          amount,
        });
        await transactionalEntityManager.save([account, newTransaction]);
        return new DefaultResponseDto();
      },
    );
  }

  async withdraw(accountNumber: string, { amount }: AmountDto) {
    const appConfig = await this.configService.getConfig();

    if (amount < appConfig.minWithdraw || amount > appConfig.maxWithdraw) {
      this.logger.error(
        `${accountNumber}: amount ${amount} must be between ${appConfig.minWithdraw} and ${appConfig.maxWithdraw}`,
      );
      throw new BadRequestException(
        `amount must be between ${appConfig.minWithdraw} and ${appConfig.maxWithdraw}`,
      );
    }
    return this.accountService.managerTransaction(
      async (transactionalEntityManager) => {
        const account = await transactionalEntityManager.findOne(Account, {
          where: { accountNumber },
          lock: { mode: 'pessimistic_write' },
        });

        if (!account) throw new NotFoundException('Account not found');

        if (account.balance < amount)
          throw new BadRequestException('Insufficient balance');

        account.balance -= amount; // Update account balance

        const newTransaction = this.transactionRepository.create({
          type: TransactionType.Withdraw,
          account,
          amount: -amount,
        });
        await transactionalEntityManager.save([account, newTransaction]);
        return new DefaultResponseDto();
      },
    );
  }

  async transfer(
    accountNumber: string,
    { to, amount }: TransactionTransferDto,
  ) {
    if (accountNumber === to) {
      this.logger.error(
        `${accountNumber} cannot transfer to same account ${to}`,
      );
      throw new BadRequestException('Cannot transfer to same account');
    }
    return this.accountService.managerTransaction(
      async (transactionalEntityManager) => {
        const fromAccount = await transactionalEntityManager.findOne(Account, {
          where: { accountNumber: accountNumber },
          lock: { mode: 'pessimistic_write' },
        });

        const toAccount = await transactionalEntityManager.findOne(Account, {
          where: { accountNumber: to },
          lock: { mode: 'pessimistic_write' },
        });

        if (!fromAccount || !toAccount)
          throw new NotFoundException('Accounts not found');

        if (toAccount.blocked)
          throw new BadRequestException('Account is blocked');

        if (fromAccount.balance < amount)
          throw new BadRequestException('Insufficient balance for transfer');

        fromAccount.balance -= amount;
        toAccount.balance += amount;

        await transactionalEntityManager.save([fromAccount, toAccount]);

        const fromTransaction = this.transactionRepository.create({
          type: TransactionType.Transfer,
          account: fromAccount,
          amount: -amount,
          receiver: toAccount,
        });

        const toTransaction = this.transactionRepository.create({
          type: TransactionType.Transfer,
          account: toAccount,
          amount,
          sender: fromAccount,
        });
        await transactionalEntityManager.save([fromTransaction, toTransaction]);
        return new DefaultResponseDto();
      },
    );
  }
}
