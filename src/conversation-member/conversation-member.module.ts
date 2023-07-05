import { Module } from '@nestjs/common';
import { ConversationMemberService } from './conversation-member.service';
import { ConversationMemberController } from './conversation-member.controller';

@Module({
  controllers: [ConversationMemberController],
  providers: [ConversationMemberService],
})
export class ConversationMemberModule {}
