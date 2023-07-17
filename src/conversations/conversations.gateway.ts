import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';
import { ConversationsService } from './conversations.service';
import { User } from 'src/users/user.entity';
import { SocialBotService } from 'src/social-bots/social-bot.service';
import { BotName } from 'src/social-bots/constants/bot-name';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ConversationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
    private readonly socialBotService: SocialBotService,
  ) {}

  @SubscribeMessage('joinPersonalConversation')
  async joinPersonalConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody('firstUserId') firstUserId: number,
    @MessageBody('secondUserId') secondUserId: number,
  ) {
    const conversation =
      await this.conversationsService.getOrCreatePersonalConversation(
        firstUserId,
        secondUserId,
      );

    client.join(conversation.id.toString());

    return conversation;
  }

  @SubscribeMessage('joinGroupConversation')
  async joinGroupConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody('conversationId') conversationId: number,
    @MessageBody('userId') userId: number,
  ) {
    try {
      await this.conversationsService.checkUserInGroupConversation(
        conversationId,
        userId,
      );

      client.join(conversationId.toString());

      return 'joined';
    } catch (error) {
      return 'not-allowed';
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('conversationId') conversationId: number,
    @MessageBody('userId') userId: number,
    @MessageBody('text') text: string,
  ): Promise<string> {
    const conversation = await this.conversationsService.getDetail(
      conversationId,
    );

    if (!conversation) {
      return 'conversation-not-found';
    }

    const user = new User();
    user.id = userId;

    const newMessage = await this.messagesService.newMessage(
      conversation,
      user,
      text,
    );

    this.server.to(conversationId.toString()).emit('newMessage', newMessage);

    if (conversation.isPersonal) {
      const otherMember = conversation.members.find(
        (member) => member.user.id !== userId,
      );

      if (otherMember && otherMember.user.telegramId) {
        await this.socialBotService.sendMessageToUser(
          BotName.TELEGRAM_BOT,
          otherMember.user.telegramId,
          text,
        );
      }
    }

    return 'Message sent';
  }
}
