import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateGroupConversationDto } from 'src/conversations/dtos/create-group-conversation.dto';
import { GetOrCreatePersonalConversation } from 'src/conversations/dtos/get-or-create-personal-conversation.dto';
import { Conversation } from './conversation.entity';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/joined')
  async getJoinedConversations(@Request() req): Promise<Conversation[]> {
    return await this.conversationsService.getJoinedConversations(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create-group-conversation')
  async createGroupConversation(
    @Request() req,
    @Body() data: CreateGroupConversationDto,
  ): Promise<Conversation> {
    if (!data.memberIds.includes(req.user.id)) {
      data.memberIds.push(req.user.id);
    }

    return await this.conversationsService.createGroupConversation(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/get-create-personal-conversation')
  async createPersonalConversation(
    @Request() req,
    @Body() data: GetOrCreatePersonalConversation,
  ): Promise<Conversation> {
    const conversation =
      await this.conversationsService.getOrCreatePersonalConversation(
        req.user.id,
        data.otherUserId,
      );

    return conversation;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async detail(@Param('id') id: number): Promise<Conversation> {
    return await this.conversationsService.getDetail(id);
  }
}
