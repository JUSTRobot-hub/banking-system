import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ConfigDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'Minimum deposit',
    example: 50,
  })
  @IsNumber()
  @IsNotEmpty()
  minDeposit: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Maximum deposit',
    example: 4000,
  })
  @IsNumber()
  @IsNotEmpty()
  maxDeposit: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Minimum withdraw',
    example: 50,
  })
  @IsNumber()
  @IsNotEmpty()
  minWithdraw: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Maximum withdraw',
    example: 5000,
  })
  @IsNumber()
  @IsNotEmpty()
  maxWithdraw: number;

  id: string;
}
