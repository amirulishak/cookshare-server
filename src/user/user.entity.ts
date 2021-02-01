import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as argon2 from 'argon2';
import { Recipe } from '../recipe/recipe.entity';
import { Comment } from '../recipe/comment.entity';
import { Subscription } from './subscription.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column()
  password!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ nullable: true, length: 60 })
  website: string;

  @Column({ nullable: true, length: 255 })
  bio: string;

  @Column({ nullable: true, length: 255 })
  location: string;

  @Column({
    nullable: true,
    length: 1000,
  })
  avatarUrl: string;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Recipe, (recipe) => recipe.creator)
  recipes: Recipe[];

  @OneToMany(() => Comment, (comment) => comment.creator)
  comments: Comment[];

  @OneToMany(() => Subscription, (subscription) => subscription.subscriber)
  subscriptions: Subscription[];

  @OneToMany(() => Subscription, (subscription) => subscription.subscribedTo)
  subscribers: Subscription[];

  async validatePassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }
}
