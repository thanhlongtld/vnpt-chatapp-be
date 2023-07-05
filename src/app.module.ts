import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '../config/app';
import authConfig from '../config/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { ConversationMemberModule } from './conversation-member/conversation-member.module';
import postgresConfig from '../config/postgres';
import corsConfig from '../config/cors';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, postgresConfig, corsConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('postgres'),
      }),
    }),

    UsersModule,
    AuthModule,
    ConversationsModule,
    MessagesModule,
    ConversationMemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
