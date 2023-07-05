import { Conversation } from 'src/conversations/conversation.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ConversationMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.conversations)
  user: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.members)
  conversation: Conversation;

  @Column({
    type: 'timestamptz',
  })
  joinedTime: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  leftTime: Date;
}
