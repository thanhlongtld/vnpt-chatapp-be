import { Injectable } from '@nestjs/common';
import { BotName } from './constants/bot-name';
import { SocialBotFactory } from './bots/social-bot-factory';

@Injectable()
export class SocialBotService {
  async sendMessageToUser(botName: BotName, userId: string, text: string) {
    const socialBotFactory = new SocialBotFactory(botName);

    const bot = socialBotFactory.getBot();

    await bot.sendMessageToUser(userId, text);
  }
}
