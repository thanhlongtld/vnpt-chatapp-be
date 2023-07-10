import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { Conversation } from 'src/conversations/conversation.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async newMessage(conversation: Conversation, user: User, text: string) {
    const message = this.messageRepository.create({
      conversation,
      user,
      text,
      sentTime: new Date(),
    });

    const createdMessage = await this.messageRepository.save(message);

    return await this.messageRepository.findOne({
      where: {
        id: createdMessage.id,
      },
      relations: {
        user: true,
      },
    });
  }
}
