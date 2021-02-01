import { BaseEntity, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Subscription extends BaseEntity {
  @ManyToOne(() => User, (user) => user.subscriptions, {
    primary: true,
    onDelete: 'CASCADE',
  })
  subscriber: User;

  @ManyToOne(() => User, (user) => user.subscribers, {
    primary: true,
    onDelete: 'CASCADE',
  })
  subscribedTo: User;

  @CreateDateColumn()
  createdAt: Date;
}
