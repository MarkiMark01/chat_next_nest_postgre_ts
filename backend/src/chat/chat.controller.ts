import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Delete,
  BadRequestException
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from '@prisma/client';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  async getAll(@Query('userId') userId: string) {
    const id = parseInt(userId);
    if (isNaN(id)) return [];
    return this.chatService.getChats(id);
  }

  @Post()
  async create(@Body() body: { userId: number; title: string }) {
    if (!body.userId) throw new BadRequestException('User ID is required');
    return this.chatService.createChat(body.userId, body.title);
  }

  @Post(':id/messages')
  async addMsg(
    @Param('id') chatId: string,
    @Body() body: { role: string; content: string },
  ): Promise<Message> {
    if (!chatId || chatId === 'undefined') {
      throw new BadRequestException('Invalid Chat ID');
    }
    return this.chatService.addMessage(chatId, body.role, body.content);
  }

  @Patch(':id')
  async rename(@Param('id') id: string, @Body('title') title: string) {
    return this.chatService.updateChatTitle(id, title);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.chatService.deleteChat(id);
  }
}