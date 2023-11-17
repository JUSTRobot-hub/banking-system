// transaction.controller.ts
import { Post, Body, Param, Query, Get, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { AmountDto, TransactionTransferDto } from './dto/transaction.dto';
import { BearerAuthPackDecorator } from '../utils/nest.utils';
import { BasicApiDecorators, DefaultResponseDto } from '../utils/swagger.utils';
import { AccountAccessGuard } from '../account/guards/account.guard';
import { PaginationDto } from '../utils/typeorm.utils';

@BearerAuthPackDecorator({ path: 'Transaction', version: '1' })
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'Get all transactions by account number',
    },
    description: 'get all transactions by account number',
    isArray: false,
    dto: Transaction,
  })
  @Get(':accountNumber')
  @UseGuards(AccountAccessGuard)
  async getAllTransactions(
    @Query() paginationDto: PaginationDto,
    @Param('accountNumber') param: string,
  ) {
    return this.transactionService.getAllTransactions(param, paginationDto);
  }

  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'deposit to account',
    },
    description: 'deposit to account successfully',
    isArray: false,
    dto: Transaction,
  })
  @UseGuards(AccountAccessGuard)
  @Post('deposit/:accountNumber')
  async deposit(
    @Param('accountNumber') accountNumber: string,
    @Body()
    amountDto: AmountDto,
  ) {
    return await this.transactionService.deposit(accountNumber, amountDto);
  }

  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'withdraw to account',
    },
    description: 'withdraw to account successfully',
    isArray: false,
    dto: DefaultResponseDto,
  })
  @Post('withdraw/:accountNumber')
  @UseGuards(AccountAccessGuard)
  async withdraw(
    @Param('accountNumber') accountNumber: string,
    @Body()
    amountDto: AmountDto,
  ) {
    return await this.transactionService.withdraw(accountNumber, amountDto);
  }

  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'transfer to account',
    },
    description: 'transference to account successfully',
    isArray: false,
    dto: DefaultResponseDto,
  })
  @Post('transfer/:accountNumber')
  @UseGuards(AccountAccessGuard)
  async transfer(
    @Param('accountNumber') accountNumber: string,
    @Body() transactionTransferDto: TransactionTransferDto,
  ) {
    return await this.transactionService.transfer(
      accountNumber,
      transactionTransferDto,
    );
  }
}
