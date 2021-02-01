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
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ length: 500 })
  text: string;

  @Column()
  recipeId: number;

  @Column()
  creatorId: number;

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
