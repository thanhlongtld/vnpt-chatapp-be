import { BotName } from '../constants/bot-name';
import { TelegramBot } from './telegram-bot';

export class SocialBotFactory {
  name: BotName;

  constructor(name: BotName) {
    this.name = name;
  }

  getBot = () => {
    switch (this.name) {
      case BotName.TELEGRAM_BOT:
        return new TelegramBot();

      default:
        return new TelegramBot();
    }
  };
}
