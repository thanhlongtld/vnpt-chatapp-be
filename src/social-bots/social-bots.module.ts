import { Module } from '@nestjs/common';
import { SocialBotService } from './social-bot.service';

@Module({
  controllers: [],
  providers: [SocialBotService],
  exports: [SocialBotService],
})
export class SocialBotsModule {}
