import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto, UserSignUpDto } from './dto/auth.dto';
import * as dayjs from 'dayjs';
import * as crypto from 'crypto';
import * as OTPAuth from 'otpauth';
import { CacheManagerService } from '../cache-manager/cache-manager.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    public userService: UserService,
    private jwtService: JwtService,
    private cacheManager: CacheManagerService,
    private logger: Logger,
  ) {}

  generateToken(user: any) {
    const payload = { id: user.id };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  async signup(userSignUpDto: UserSignUpDto) {
    const isDuplicate = await this.userService.findOneArray([
      { email: userSignUpDto.email },
      { phone: userSignUpDto.phone },
      { username: userSignUpDto.username },
    ]);

    if (isDuplicate) {
      if (userSignUpDto.email == isDuplicate.email) {
        throw new BadRequestException('Email already exists');
      } else if (userSignUpDto.phone == isDuplicate.phone) {
        throw new BadRequestException('Phone already exists');
      } else if (userSignUpDto.username == isDuplicate.username) {
        throw new BadRequestException('Username already exists');
      }
    }

    const user = await this.userService.create({
      ...userSignUpDto,
    });
    user.token = this.generateToken(user);

    return user;
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.userService.findOneArray([
      { email: userLoginDto.emailOrUsername },
      { username: userLoginDto.emailOrUsername },
    ]);
    if (!user) throw new NotFoundException('User not found');
    if (user.blocked)
      throw new ForbiddenException('Your account has been blocked');

    const isPassword = await user.passwordCheck(userLoginDto.password);
    if (!isPassword) throw new BadRequestException('Wrong password');

    //token , hash
    if (user.is2FAEnabled) {
      user.token = null;
      user.hash = {
        expiryDate: dayjs().add(5, 'minutes').toDate(),
        value: crypto.randomBytes(32).toString('hex'), //h
      };
      await this.userService.save(user);
    } else {
      user.token = this.generateToken(user);
      user.hash = null;
    }

    return user;
  }

  async validate2fa(hash: string, code: string) {
    const [user] = await this.userService.search2FA(hash);
    if (
      !user ||
      dayjs(user.hash.expiryDate).isBefore(dayjs().toDate()) ||
      !user.is2FAEnabled
    )
      throw new BadRequestException('Token maybe expired or invalid');

    const totp = new OTPAuth.TOTP({
      issuer: 'moneybankingx.com',
      label: 'moneybankingx',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: user.otp2FASecret,
    });

    const delta = totp.validate({ token: code, window: 10 });

    if (delta == null) throw new BadRequestException('Invalid code');

    user.token = this.generateToken(user);
    user.hash = null;
    await this.userService.save(user);
    return user;
  }

  async destroyToken(token: string) {
    const decodedToken = this.jwtService.decode(token);
    const diff = dayjs(decodedToken.exp * 1000).diff(
      dayjs().toDate(),
      'millisecond',
    );
    await this.cacheManager.set(token, token, diff);
    return { status: 'OK' };
  }
}
