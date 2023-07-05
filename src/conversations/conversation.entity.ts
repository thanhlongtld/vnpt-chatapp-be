import { ConversationMember } from 'src/conversation-member/conversation-member.entity';
import { Message } from 'src/messages/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  name: string;

  @Column('bool', {
    default: true,
  })
  isPersonal: boolean;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @OneToMany(
    () => ConversationMember,
    (conversationMember) => conversationMember.conversation,
  )
  members: ConversationMember[];
}
