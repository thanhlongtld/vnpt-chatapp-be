import { NestFactory } from '@nestjs/core';
import { SocialBotFactory } from './social-bots/bots/social-bot-factory';
import { BotName } from './social-bots/constants/bot-name';
import { Scenes, session } from 'telegraf';
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { ConversationsModule } from './conversations/conversations.module';
import { ConversationsService } from './conversations/conversations.service';
import { MessagesModule } from './messages/messages.module';
import { MessagesService } from './messages/messages.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.select(UsersModule).get(UsersService, {
    strict: true,
  });
  const conversationsService = app
    .select(ConversationsModule)
    .get(ConversationsService, {
      strict: true,
    });
  const messagesService = app.select(MessagesModule).get(MessagesService, {
    strict: true,
  });

  const socialBotFactory = new SocialBotFactory(BotName.TELEGRAM_BOT);

  const telegramBot = socialBotFactory.getBot();

  const botClient = telegramBot.getClient();

  const usernameWizard = new Scenes.WizardScene(
    'username-widzard',
    (ctx: any) => {
      ctx.reply("What's your username?");

      ctx.wizard.state.data = { test: 'hello' };

      return ctx.wizard.next();
    },
    async (ctx: any) => {
      const username = ctx.message.text;

      const user = await usersService.findByUsername(username);

      if (!user) {
        ctx.reply('Incorrect username, press /start to try again!');

        return ctx.scene.leave();
      }

      await usersService.saveTelegramId(
        user.id,
        String(ctx.update.message.from.id),
      );

      ctx.reply('Done!');

      return ctx.scene.leave();
    },
  );

  const stage = new Scenes.Stage([usernameWizard]);

  botClient.use(session());
  botClient.use(stage.middleware());

  botClient.start((ctx: any) => {
    ctx.scene.enter('username-widzard');
  });

  botClient.on('text', async (ctx) => {
    const telegramId = String(ctx.from.id);

    const user = await usersService.findByTelegramId(telegramId);

    if (!user) {
      return await ctx.reply('Press /start to input your username first!');
    }

    const randomUser = await usersService.getRandomOtherUser(user.id);

    const conversation =
      await conversationsService.getOrCreatePersonalConversation(
        user.id,
        randomUser.id,
      );

    await messagesService.newMessage(conversation, user, ctx.message.text);
  });

  botClient.launch();
}

bootstrap();
