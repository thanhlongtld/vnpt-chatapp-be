import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConversationsService } from './conversations.service';
import { MessagesService } from 'src/messages/messages.service';
import { Server, Socket } from 'socket.io';

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

  @SubscribeMessage('joinConversation')
  joinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody('conversationId') conversationId: number,
  ): string {
    return 'Hello world!';
  }

  @SubscribeMessage('sendMessage')
  sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody('conversationId') conversationId: number,
    @MessageBody('userId') userId: number,
    @MessageBody('text') text: string,
  ): string {
    console.log(text);

    return 'Hello world!';
  }
}
