import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as OTPAuth from 'otpauth';
import { randomString } from '../utils/helpers.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async send2fa(user: User) {
    if (user.is2FAEnabled)
      throw new BadRequestException('2FA is already enabled');

    const totp = new OTPAuth.TOTP({
      issuer: 'moneybankingx.com',
      label: 'moneybankingx',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(randomString(12)),
    });

    const otpAuth_url = totp.toString();
    const base32Secret = totp.secret.base32;
    user.otp2FASecret = base32Secret;

    await this.userRepository.save(user);

    return {
      qrValue: otpAuth_url,
      secret: base32Secret,
    };
  }

  async verify2fa(user: User, code: string) {
    const totp = new OTPAuth.TOTP({
      issuer: 'moneybankingx.com',
      label: 'moneybankingx',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: user.otp2FASecret,
    });
    const delta = totp.validate({ token: code.toString(), window: 10 });

    if (delta == null) throw new BadRequestException('Invalid code');

    user.is2FAEnabled = true;
    await this.userRepository.save(user);

    return user;
  }

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findOne(body: object) {
    return this.userRepository.findOne({ where: body });
  }

  async findOneArray(body: Array<object>) {
    return this.userRepository.findOne({ where: body });
  }

  async save(body: object) {
    return this.userRepository.save(body);
  }

  async search2FA(valueToSearch: string) {
    return this.userRepository
      .createQueryBuilder('users')
      .where("users.hash->>'value' = :value", { value: valueToSearch })
      .getMany();
  }
}
