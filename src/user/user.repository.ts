import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { appendHttp } from 'src/shared/append-http';

import { EntityRepository, Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { User } from './user.entity';

/**
 * User Respository
 */
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('RecipeRepository');

  /**
   * Save User
   * @param {User} user
   * @returns {Promise<void>}
   */
  async saveUser(user: User): Promise<void> {
    try {
      user.website = appendHttp(user.website);
      user.avatarUrl = appendHttp(user.avatarUrl);
      await user.save();
    } catch (error) {
      // duplicate username
      if (error.code === '23505')
        throw new ConflictException('Username already exists');
      else throw new InternalServerErrorException();
    }
  }

  /**
   * Remove User Permanently
   * @param {User} user
   * @returns {Promise<void>}
   */
  async removeUser(user: User): Promise<void> {
    try {
      await user.remove();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Soft Remove User
   * @param {User} user
   * @returns {Promise<void>}
   */
  async softRemoveUser(user: User): Promise<void> {
    try {
      await user.softRemove();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Follow user
   * @param {User} user
   * @param {User} subscriber
   * @returns {Promise<void>}
   */
  async followUser(user: User, subscriber: User) {
    const subscription = new Subscription();
    subscription.subscriber = subscriber;
    subscription.subscribedTo = user;

    try {
      await subscription.save();
    } catch (error) {
      this.logger.error(
        `Failed to save the subscription for user "${subscriber.name}"`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }
  }

  /**
   * Get All Following
   * @param {User} user
   * @returns {Promise<User[]>}
   */
  async getAllFollowings(user: User): Promise<User[]> {
    const query = this.createQueryBuilder('u')
      .select('u.name')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('s.subscribedToId')
          .from(Subscription, 's')
          .where('s.subscriberId = :userId')
          .getQuery();
        return 'u.id IN' + subQuery;
      })
      .setParameter('userId', user.id)
      .orderBy('u.name');

    try {
      const users = await query.getMany();
      return users;
    } catch (error) {
      this.logger.error(
        `Failed to get following for user "${user.email}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  /**
   * Get All Followers
   * @param {User} user
   * @returns {Promise<USer[]>}
   */
  async getAllFollowers(user: User): Promise<User[]> {
    const query = this.createQueryBuilder('u')
      .select('u.name')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('s.subscriberId')
          .from(Subscription, 's')
          .where('s.subscribedToId = :userId')
          .getQuery();
        return 'u.id IN' + subQuery;
      })
      .setParameter('userId', user.id)
      .orderBy('u.name');

    try {
      const users = await query.getMany();
      return users;
    } catch (error) {
      this.logger.error(
        `Failed to get following for user "${user.email}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
