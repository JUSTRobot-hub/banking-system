import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class AmountDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'amount',
    example: 1000,
  })
  @IsNumber()
  amount: number;
}

export class TransactionTransferDto extends PartialType(AmountDto) {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Reciever account',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  to: string;
}
