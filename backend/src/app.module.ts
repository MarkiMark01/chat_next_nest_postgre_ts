import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';
import { ChatGateway } from './chat/chat.gateway';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [ChatController],
  providers: [ChatService, PrismaService, ChatGateway],
})
export class AppModule {}



