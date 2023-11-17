import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export interface ClassConstructor {
  new (...args: any[]): object;
}

class ParamsDto {
  response: number;

  isArray: boolean;

  operation: {
    summary: string;
    deprecated?: boolean;
    description?: string;
  };

  dto: ClassConstructor;

  description: string;
}

class ErrorClass {
  @ApiProperty({
    type: Number,
    name: 'statusCode',
    description: 'error statusCode',
    example: 0,
  })
  statusCode: number;

  @ApiProperty({
    type: String,
    name: 'message',
    description: 'error message',
    example: 'Error message',
  })
  message: string;

  @ApiProperty({
    type: String,
    name: 'type',
    description: 'error type',
    example: 'Error',
  })
  type: string;
}
export function BasicApiDecorators(ParamsDto: ParamsDto) {
  return applyDecorators(
    ApiOperation(ParamsDto.operation),

    // custom api response
    ApiResponse({
      type: ParamsDto.dto,
      isArray: ParamsDto.isArray,
      status: ParamsDto.response,
      description: `${ParamsDto.response} - ${ParamsDto.description}`,
    }),
    //bad request response
    ApiResponse({
      type: ErrorClass,
      status: 0,
      description: `${HttpStatus.BAD_REQUEST} - Bad Request || ${HttpStatus.NOT_FOUND} - Not Found || ${HttpStatus.FORBIDDEN} - Forbidden || ${HttpStatus.INTERNAL_SERVER_ERROR} - Internal Server Error`,
    }),
  );
}

export class DefaultResponseDto {
  @ApiProperty({
    type: String,
    name: 'status',
    description: 'Status of the response',
    example: 'OK',
  })
  status: string = 'OK';

  @ApiProperty({
    type: Number,
    name: 'statusCode',
    description: 'Status code of the response',
    example: 200,
  })
  statusCode: number = HttpStatus.OK;

  @ApiProperty({
    type: String,
    name: 'message',
    description: 'Message of the response',
    example: 'Resource retrieved successfully',
  })
  message: string = 'Operation successful';

  @ApiProperty({
    type: String,
    name: 'data',
    description: 'Data of the response',
    example: 'custom string',
  })
  data: string;
}

export class IdParamDto {
  @IsString()
  @ApiProperty({
    type: String,
    name: 'id',
    description: 'id of the resource',
    example: '5f5f5f5f5f5f5f5f5f5f5f5f',
  })
  id: string;
}
