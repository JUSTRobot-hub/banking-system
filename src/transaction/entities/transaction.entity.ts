import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionType } from '../../constants/enums.constants';
import { Account } from '../../account/entities/account.entity';

@Entity({
  name: 'transactions',
})
export class Transaction {
  @ApiProperty({
    description: 'ID of user',
    example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
  })
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: TransactionType })
  @Expose()
  type: string;

  @ApiProperty({
    description: 'amount of transaction',
    example: 1000,
  })
  @Expose()
  @Column({ type: 'double precision', default: 0, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'id of user',
    example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
  })
  @Expose()
  @Index()
  @ManyToOne(() => Account, { nullable: true })
  receiver: Account;

  @ApiProperty({
    description: 'id of user',
    example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
  })
  @Expose()
  @Index()
  @ManyToOne(() => Account, { nullable: true })
  sender: Account;

  @ApiProperty({
    description: 'id of user',
    example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
  })
  @Expose()
  @Index()
  @ManyToOne(() => Account)
  account: Account;

  @ApiProperty({ description: 'Created date of user' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date of user' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
