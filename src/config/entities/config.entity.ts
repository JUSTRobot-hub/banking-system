import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'config',
})
export class Config {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'account number of account',
    example: 'Mostafa',
  })
  @Column({ type: 'int' })
  minDeposit: number;

  @ApiProperty({
    description: 'IBAN of account',
    example: 'Mostafa',
  })
  @Column({ type: 'int' })
  maxDeposit: number;

  @ApiProperty({
    description: 'id of user',
    example: '89c018cc-8a77-4dbd-94e1-dbaa710a2a9c',
  })
  @Column({ type: 'int' })
  minWithdraw: number;

  @ApiProperty({
    description: 'balance of account',
    example: 100,
  })
  @Column({ type: 'int' })
  maxWithdraw: number;
}
