import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetUser } from '../shared/decorators/get-user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';

/**
 * User Controller
 */
@ApiTags('user')
@Controller('user')
export class UserController {
  private logger = new Logger('UserController');

  constructor(private userService: UserService) {}

  /**
   * Get User By Id
   * [GET]: api/v1/user/:id
   * @param {number} id
   * @returns {Promise<User>}
   */
  @Get('/:id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  async getUserById(@Param('id', ParseIntPipe) id: string): Promise<User> {
    const user = await this.userService.getUser({ id });

    if (!user) throw new NotFoundException(`User not found`);
    else return user;
  }

  /**
   * Update Profile
   * [PATCH]: api/v1/user
   * @param {UpdateProfileDto} updateProfileDto
   * @param {User} user
   * @returns {Promise<void>}
   */
  @Patch()
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Update profile of current user' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully updated.',
  })
  updateUser(
    @Body() updateProfileDto: UpdateProfileDto,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(`Updating user "${user.email}"`);
    return this.userService.updateUser(updateProfileDto, user);
  }

  /**
   * Follow User
   * [POST]: api/v1/user/follow/:id
   * @param {number} id
   * @param {User} subscriber
   * @returns {Promise<void>}
   */
  @Post('/follow/:id')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  followUser(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() subscriber: User,
  ): Promise<void> {
    return this.userService.followUser(id, subscriber);
  }

  /**
   * Get All Following
   * [GET]: api/v1/user/following
   * @param {User} user
   * @returns {Promise<User[]>}
   */
  @Get('/following')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Retrieve all followings.' })
  getAllFollowings(@GetUser() user: User): Promise<User[]> {
    return this.userService.getAllFollowings(user);
  }

  /**
   * Get All Followers
   * [GET]: api/v1/user/followers
   * @param {User} user
   * @returns {Promise<User[]>}
   */
  @Get('/followers')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Retrieve all followers.' })
  getAllFollowers(@GetUser() user: User): Promise<User[]> {
    return this.userService.getAllFollowers(user);
  }
}
