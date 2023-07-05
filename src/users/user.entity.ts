import { ConversationMember } from 'src/conversation-member/conversation-member.entity';
import { Message } from 'src/messages/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    select: false,
  })
  password: string;

  @OneToMany(() => Message, (order) => order.user)
  messages: Message[];

  @OneToMany(
    () => ConversationMember,
    (conversationMember) => conversationMember.user,
  )
  conversations: ConversationMember[];
}
