import telegramBotConfig from '../../../config/telegram-bot';
import { Telegraf } from 'telegraf';
import { BotName } from '../constants/bot-name';
import { SocialBot } from './social-bot';

export class TelegramBot implements SocialBot {
  name = BotName.TELEGRAM_BOT;

  client = new Telegraf(telegramBotConfig().telegramBot.token, {
    handlerTimeout: 9_000_000,
  });

  getClient = () => {
    return this.client;
  };

  sendMessageToUser = async (userId: string, text: string) => {
    const botClient = this.getClient();

    await botClient.telegram.sendMessage(userId, {
      text,
    });
  };
}
