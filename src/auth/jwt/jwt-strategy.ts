import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as config from 'config';
import { JwtPayLoad } from './jwt-payload.interface';
import { User } from '../../user/user.entity';
import { UnauthorizedException } from '@nestjs/common';

import { sanitizeUser } from '../../shared/sanitize-user';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../user/user.repository';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayLoad): Promise<User> {
    const { userId } = payload;
    const user = await this.userRepository.findOne({ id: userId });

    if (!user) throw new UnauthorizedException();

    sanitizeUser(user);
    return user;
  }
}
