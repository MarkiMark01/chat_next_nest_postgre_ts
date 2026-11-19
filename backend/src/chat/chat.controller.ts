import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { MyAuthGuard } from '../auth/auth.guard';
import { AddMessageDto, CreateChatDto, RenameChatDto } from './dto/chat.dto';

// MyAuthGuard кладе payload токена в req.user, id користувача лежить у sub
type AuthRequest = { user: { sub: number } };

@UseGuards(MyAuthGuard) // усі маршрути чатів тепер лише для авторизованих
@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  getAll(@Req() req: AuthRequest) {
    return this.chatService.getChats(req.user.sub); // userId з токена, а не з query
  }

  @Post()
  create(@Req() req: AuthRequest, @Body() body: CreateChatDto) {
    return this.chatService.createChat(req.user.sub, body.title ?? '');
  }

  @Post(':id/messages')
  addMsg(@Req() req: AuthRequest, @Param('id') chatId: string, @Body() body: AddMessageDto) {
    return this.chatService.addMessage(chatId, req.user.sub, body.content);
  }

  @Patch(':id')
  rename(@Req() req: AuthRequest, @Param('id') id: string, @Body() body: RenameChatDto) {
    return this.chatService.updateChatTitle(id, req.user.sub, body.title);
  }

  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.chatService.deleteChat(id, req.user.sub);
  }
}