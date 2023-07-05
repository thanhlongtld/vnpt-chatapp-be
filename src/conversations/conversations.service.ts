import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { In, Repository } from 'typeorm';
import { ConversationMember } from 'src/conversation-member/conversation-member.entity';
import { CreateGroupConversationDto } from 'src/dtos/create-group-conversation.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationMember)
    private conversationMemberRepository: Repository<ConversationMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getJoinedConversations(userId: any) {
    return this.conversationRepository.find({
      where: {
        members: {
          user: userId,
        },
      },
      relations: {
        members: true,
      },
    });
  }

  async createGroupConversation(data: CreateGroupConversationDto) {
    const addingUsers = await this.userRepository.find({
      where: {
        id: In(data.memberIds),
      },
    });

    const conversation = this.conversationRepository.create({
      name: data.name,
    });

    const members = addingUsers.map((user) =>
      this.conversationMemberRepository.create({
        user,
      }),
    );
    conversation.members = members;

    return await this.conversationRepository.save(conversation);
  }
}
