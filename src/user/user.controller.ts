import { Get, Post, Param, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, Get2FAResponseDto, LoginDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { ApiParam } from '@nestjs/swagger';
import { BearerAuthPackDecorator } from '../utils/nest.utils';
import { BasicApiDecorators } from '../utils/swagger.utils';
import { Serialize } from '../interceptors/serialize.interceptor';
import { GetUser } from '../auth/decorators/get-user.decorator';

@BearerAuthPackDecorator({ path: 'User', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @BasicApiDecorators({
    response: 200,
    operation: {
      summary: 'verify user if authorized',
    },
    description: 'validate user',
    isArray: false,
    dto: Get2FAResponseDto,
  })
  @Get('/me')
  @Serialize(User)
  me(@GetUser() user: User) {
    if (user.blocked) throw new BadRequestException('User is blocked');
    return user;
  }

  @BasicApiDecorators({
    response: 200,
    operation: {
      summary: 'Get 2FA secrets',
    },
    description: '2FA secrets generated successfully',
    isArray: false,
    dto: Get2FAResponseDto,
  })
  @Get('/2fa')
  async send2fa(@GetUser() user: User) {
    return await this.userService.send2fa(user);
  }

  @BasicApiDecorators({
    response: 200,
    operation: {
      summary: 'Validate 2FA code',
    },
    description: '2FA validated successfully',
    isArray: false,
    dto: User,
  })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'code of 2FA',
    required: true,
  })
  @Post('/validate-2fa/:code')
  async verify2fa(@GetUser() user: User, @Param('code') code: string) {
    return await this.userService.verify2fa(user, code);
  }
}
