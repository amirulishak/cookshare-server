import { User } from '../user/user.entity';
import { Recipe } from './recipe.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ length: 500 })
  text: string;

  @Column()
  recipeId: string;

  @Column()
  creatorId: string;

  @ManyToOne(() => User, (user) => user.comments, {
    onUpdate: 'CASCADE',
  })
  creator: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  recipe: Recipe;
}
