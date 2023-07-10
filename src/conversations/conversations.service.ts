import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { In, Repository } from 'typeorm';
import { ConversationMember } from 'src/conversation-member/conversation-member.entity';
import { CreateGroupConversationDto } from 'src/conversations/dtos/create-group-conversation.dto';
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
      isPersonal: false,
    });

    const members = addingUsers.map((user) =>
      this.conversationMemberRepository.create({
        user,
        joinedTime: new Date(),
      }),
    );

    await this.conversationMemberRepository.save(members);

    conversation.members = members;

    return await this.conversationRepository.save(conversation);
  }

  async getOrCreatePersonalConversation(
    firstUserId: number,
    secondUserId: number,
  ): Promise<Conversation> {
    const createdPersonalConversation =
      await this.conversationRepository.findOne({
        where: {
          isPersonal: true,
          members: {
            user: In([firstUserId, secondUserId]),
          },
        },
        relations: {
          members: {
            user: true,
          },
          messages: {
            user: true,
          },
        },
      });

    if (
      createdPersonalConversation &&
      createdPersonalConversation.members.length === 2
    ) {
      return createdPersonalConversation;
    }

    const addingUsers = await this.userRepository.find({
      where: {
        id: In([firstUserId, secondUserId]),
      },
    });

    const conversationName = addingUsers.map((user) => user.username).join(',');

    const newConversation = this.conversationRepository.create({
      name: conversationName,
      isPersonal: true,
    });

    const members = addingUsers.map((user) =>
      this.conversationMemberRepository.create({
        user,
        joinedTime: new Date(),
      }),
    );

    await this.conversationMemberRepository.save(members);

    newConversation.members = members;

    return await this.conversationRepository.save(newConversation);
  }

  async getDetail(id: number) {
    return await this.conversationRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        members: {
          user: true,
        },
        messages: {
          user: true,
        },
      },
      order: {
        messages: {
          sentTime: 'ASC',
        },
      },
    });
  }

  async checkUserInGroupConversation(conversationId: number, userId: number) {
    return Boolean(
      await this.conversationRepository.findOneOrFail({
        where: {
          id: conversationId,
          isPersonal: false,
          members: {
            user: In([userId]),
          },
        },
        relations: {
          members: {
            user: true,
          },
          messages: {
            user: true,
          },
        },
      }),
    );
  }
}
