import { Body, Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Conversation } from './conversation.entity';
import { CreateGroupConversationDto } from 'src/dtos/create-group-conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/joined')
  async getJoinedConversations(@Request() req): Promise<Conversation[]> {
    return await this.conversationsService.getJoinedConversations(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/create-group-conversation')
  async createGroupConversation(
    @Request() req,
    @Body() data: CreateGroupConversationDto,
  ): Promise<Conversation> {
    if (!data.memberIds.includes(req.user.id)) {
      data.memberIds.push(req.user.id);
    }

    return await this.conversationsService.createGroupConversation(data);
  }
}
