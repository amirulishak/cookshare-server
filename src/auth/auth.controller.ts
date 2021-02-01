import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthData } from './auth-data.interface';
/**
 * User Controller
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  /**
   * Register User
   * [POST]: api/v1/auth/register
   * @param {RegisterDto} registerDto
   * @returns {Promise<AuthData>}
   */
  @Post('/register')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Persists a newly created user to database' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthData> {
    return await this.authService.register(registerDto);
  }

  /**
   * Login User
   * [POST]: api/v1/auth/login
   * @param {AuthDto} authDto
   * @returns {Promise<AuthData>}
   */
  @Post('/login')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Validates a user against database' })
  async login(@Body() authDto: AuthDto): Promise<AuthData> {
    return this.authService.login(authDto);
  }
}
