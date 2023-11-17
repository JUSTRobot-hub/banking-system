import { Get, Post, Body, Param, Headers, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, UserSignUpDto, Validate2FADto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { Request } from 'express';
import { BearerAuthPackDecorator } from '../utils/nest.utils';
import { BasicApiDecorators } from '../utils/swagger.utils';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from '../user/entities/user.entity';

@BearerAuthPackDecorator({ path: 'Auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'user signup',
    },
    description: 'user created successfully',
    isArray: false,
    dto: User,
  })
  @Serialize(User)
  @Public()
  @Post('/signup')
  async signup(@Body() body: UserSignUpDto) {
    return await this.authService.signup(body);
  }

  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'user login',
    },
    description: 'user logged in successfully',
    isArray: false,
    dto: User,
  })
  @Serialize(User)
  @Post('/login')
  @Public()
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.login(userLoginDto);
  }

  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'Validate 2FA',
    },
    description: 'User validated successfully',
    isArray: false,
    dto: User,
  })
  @Serialize(User)
  @Public()
  @Get('/validate-2fa/:token/:code')
  async validate2FA(@Param() params: Validate2FADto) {
    return await this.authService.validate2fa(params.token, params.code);
  }

  @BasicApiDecorators({
    response: 201,
    operation: {
      summary: 'user login',
    },
    description: 'user logged in successfully',
    isArray: false,
    dto: User,
  })
  @Serialize(User)
  @Get('/destroy-token')
  async destroyToken(@Req() req: Request) {
    return await this.authService.destroyToken(
      req.headers.authorization.split(' ')[1],
    );
  }
}
