import { User } from '../user/user.entity';
import { Comment } from './comment.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface Steps {
  description: string;
  attachmentUrl: string;
}

@Entity()
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ length: 55 })
  name: string;

  @Column({ nullable: true, length: 500 })
  story: string;

  @Column({ nullable: true, length: 25 })
  portion: string;

  @Column({ nullable: true, length: 25 })
  cookTime: string;

  @Column('simple-array')
  ingredients: string[];

  @Column('jsonb')
  steps: Array<Steps>;

  @Column({ nullable: true, length: 1000 })
  thumbnailUrl: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column()
  creatorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.recipes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  creator: User;

  @OneToMany(() => Comment, (comment) => comment.recipe)
  comments: Comment[];
}
