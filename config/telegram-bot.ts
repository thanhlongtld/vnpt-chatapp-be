import 'dotenv/config';

export default () => ({
  telegramBot: {
    token: process.env.TELEGRAM_BOT_TOKEN,
  },
});
