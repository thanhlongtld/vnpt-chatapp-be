import { Telegraf } from 'telegraf';
import { BotName } from '../constants/bot-name';

export interface SocialBot {
  name: BotName;

  client: Telegraf;

  getClient: () => Telegraf;

  sendMessageToUser: (userId: string, text) => Promise<void>;
}
