import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserSignUpDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'user firstname',
    example: 'Mostafa',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'user lastname',
    example: 'ElBadry',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Username',
    example: 'JUSTROBOT-HUB',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'user email',
    example: 'elbadrymoe1@gmail.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Phone number',
    example: '01000138008',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Address',
    example: 'Cairo, Egypt',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Password',
    example: 'testxd',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class UserLoginDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'user email or username',
    example: 'example@gmail.com | username12461',
  })
  @IsString()
  @IsNotEmpty()
  emailOrUsername: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Password',
    example: 'testxd',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class Validate2FADto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'token',
    example: 'sgfl13kagkafaskdfpwqprtkpektpaksfpk',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'code',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}
