import { Module, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtUsersStrategy } from './strategies/user.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { CacheManagerModule } from '../cache-manager/cache-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV.toLowerCase()}`,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
    CacheManagerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtUsersStrategy, Logger],
})
export class AuthModule {}
