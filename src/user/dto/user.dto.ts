import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({
    type: String,
    description: 'User Email Must Be valid',
    uniqueItems: true,
  })
  email: string;

  @MinLength(6)
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Password Must be more than 6  chars',
  })
  password: string;
}
export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({
    type: String,
    description: 'User Email Must Be valid',
    uniqueItems: true,
  })
  email: string;

  @MinLength(6)
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Password Must be more than 6  chars',
  })
  password: string;
}

export class Get2FAResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'qrValue url',
    example: 'http://test.com',
  })
  qrValue: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'secret code',
    example: 'test',
  })
  secret: string;
}
