import {
  NotFoundException,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { sanitizeUser } from '../shared/sanitize-user';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(private userRepository: UserRepository) {}

  /**
   * Get User
   * @param {any} options
   * @returns {Promise<User>}
   */
  async getUser(options?: any): Promise<User> {
    const user = await this.userRepository.findOne(options);
    return user;
  }

  /**
   * Create User
   * @param {User} user
   * @returns {Promise<void>}
   */
  async createUser(user: User): Promise<void> {
    return await this.userRepository.saveUser(user);
  }

  /**
   * Remove User
   * @param {User} user
   * @returns {Promise<void>}
   */
  async deleteUser(user: User): Promise<void> {
    return await this.userRepository.removeUser(user);
  }

  /**
   * Soft Remove User
   * @param {User} user
   * @returns {Promise<void>}
   */
  async softRemoveUser(user: User): Promise<void> {
    return await this.userRepository.softRemoveUser(user);
  }

  /**
   * Update Profile
   * @param {UpdateProfileDto} updateProfileDto
   * @param {User} user
   * @returns {Promise<void>}
   */
  async updateUser(
    updateProfileDto: UpdateProfileDto,
    user: User,
  ): Promise<void> {
    const { name, website, bio, location, avatarUrl } = updateProfileDto;

    user.name = name;
    user.website = website;
    user.bio = bio;
    user.location = location;
    user.avatarUrl = avatarUrl;

    await this.userRepository.saveUser(user);
  }

  /**
   * Follow User
   * @param {number} id
   * @param {User} subscriber
   * @returns {Promise<void>}
   */
  async followUser(id: number, subscriber: User): Promise<void> {
    const user = await this.getUser({ id });
    if (!user) throw new NotFoundException(`User not found`);

    sanitizeUser(user);

    if (user.id !== subscriber.id) {
      this.userRepository.followUser(user, subscriber);
    } else throw new BadRequestException(`You cannot follow yourself`);
  }

  /**
   * Get All Following
   * @param {User} user
   * @returns {Promise<User[]>}
   */
  async getAllFollowings(user: User): Promise<User[]> {
    return await this.userRepository.getAllFollowings(user);
  }

  /**
   * Get All Followers
   * @param {User} user
   * @returns {Promise<User[]>}
   */
  async getAllFollowers(user: User): Promise<User[]> {
    return await this.userRepository.getAllFollowers(user);
  }
}
