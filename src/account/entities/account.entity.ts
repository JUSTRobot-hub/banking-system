import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({
  name: 'accounts',
})
export class Account {
  @ApiProperty({
    description: 'ID of user',
    example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
  })
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'account number of account',
    example: 'Mostafa',
  })
  @Expose()
  @Column({ unique: true })
  @Index()
  accountNumber: string;

  @ApiProperty({
    description: 'IBAN of account',
    example: 'Mostafa',
  })
  @Expose()
  @Column({ unique: true })
  IBAN: string;

  @ApiProperty({
    description: 'id of user',
    example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
  })
  @Exclude()
  @ManyToOne(() => User, { cascade: true })
  user: User;

  @ApiProperty({
    description: 'balance of account',
    example: 100,
  })
  @Expose()
  @Column({ type: 'double precision', default: 0, scale: 2 })
  balance: number;

  @Index()
  @Column('boolean', { default: false })
  blocked: boolean;

  @ApiProperty({ description: 'Created date of user' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date of user' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
