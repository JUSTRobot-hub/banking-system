import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';
import { StrategyName } from '../../constants/enums.constants';
@Injectable()
export class JwtUsersStrategy extends PassportStrategy(
  Strategy,
  StrategyName.JwtUserStrategy,
) {
  constructor(
    private authService: AuthService,
    private cacheManagerService: CacheManagerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const token = req.headers?.authorization?.split(' ')[1];
    const isRevoked = await this.cacheManagerService.get(token);
    if (isRevoked) {
      throw new UnauthorizedException('Invalid Token');
    }
    const user = await this.authService.userService.findOne({
      id: payload.id,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid Token');
    }
    return user;
  }
}
