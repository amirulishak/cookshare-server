import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { JwtPayLoad } from './jwt/jwt-payload.interface';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/user.entity';
import { AuthData } from './auth-data.interface';
import * as config from 'config';
import { UserService } from 'src/user/user.service';
import { sanitizeUser } from 'src/shared/sanitize-user';

/**
 * Authentication Service
 */
@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Register User
   * @param {RegisterDto} registerDto
   * @returns {Promise<AuthData>}
   */
  async register(registerDto: RegisterDto): Promise<AuthData> {
    const { email, password, name } = registerDto;

    if (!(await this.userService.getUser({ email }))) {
      const user = new User();

      user.email = email;
      user.password = await argon2.hash(password);
      user.name = name.trim();

      await this.userService.createUser(user);

      sanitizeUser(user);

      return {
        userId: user.id,
        ...(await this.createToken({ userId: user.id })),
      };
    } else {
      throw new ConflictException();
    }
  }

  /**
   * Login User
   * @param {AuthDto} authDto
   * @returns {Promise<AuthData>}
   */
  async login(authDto: AuthDto): Promise<AuthData> {
    const { email, password } = authDto;
    const user = await this.userService.getUser({ email });

    if (user && (await user.validatePassword(password))) {
      sanitizeUser(user);

      return {
        userId: user.id,
        ...(await this.createToken({ userId: user.id })),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Create User Token
   * @param {any} object
   * @param {string} expiresIn
   * @returns {Promise<{ accessToken, expiresIn}>}
   */
  private async createToken(object: any): Promise<{ accessToken; expiresIn }> {
    const payload: JwtPayLoad = object;
    const expiresIn = config.get('jwt').expiresIn;
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );
    return { accessToken, expiresIn };
  }
}
