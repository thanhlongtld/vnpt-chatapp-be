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
import { Conversation } from './conversation.entity';
import { User } from 'src/users/user.entity';

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
    const conversation = new Conversation();
    conversation.id = conversationId;

    const user = new User();
    user.id = userId;

    const newMessage = await this.messagesService.newMessage(
      conversation,
      user,
      text,
    );

    this.server.to(conversationId.toString()).emit('newMessage', newMessage);

    return 'Message sent';
  }
}
