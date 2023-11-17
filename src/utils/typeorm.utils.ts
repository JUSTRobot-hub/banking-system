import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { Column, ColumnOptions } from 'typeorm';
import { Order } from '../constants/enums.constants';

export class PaginationDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    type: Number,
    description: 'page number',
    example: 1,
    required: true,
  })
  page = 1;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    type: Number,
    description: 'limit number',
    example: 10,
    required: true,
  })
  limit = 10;

  @IsEnum(Order)
  @ApiProperty({
    type: String,
    description: 'order',
    example: Order.ASC,
    enum: Order,
    required: true,
  })
  order = Order.ASC;
}

export function BasicTypeORMProperty(
  options: {
    expose: boolean;
    otherSwaggerOptions?: ApiPropertyOptions;
    swagger: {
      type: any;
      required: boolean;
      description?: string;
      example?: any;
    };
    column: ColumnOptions;
  } = {
    expose: false,
    swagger: {
      type: String,
      required: false,
    },
    column: {},
    otherSwaggerOptions: {},
  },
) {
  return applyDecorators(
    options.expose ? Expose() : Exclude(),
    ApiProperty({ ...options.swagger, ...options.otherSwaggerOptions }),
    Column({
      required: options.swagger.required,
      ...Object(options.column),
    }),
  );
}
