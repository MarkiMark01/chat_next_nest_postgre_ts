import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ChatGateway } from './chat.gateway';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private groq: OpenAI;
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private readonly chatGateway: ChatGateway,
  ) {
    if (!process.env.GROQ_API_KEY) {
      this.logger.warn('GROQ_API_KEY is missing in .env file');
    }
    
    this.groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY || 'dummy_key',
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async getChats(userId: number) {
    return this.prisma.chat.findMany({
      where: { userId: Number(userId) },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createChat(userId: number, title: string) {
    try {
      const parsedUserId = Number(userId);
      const user = await this.prisma.user.findUnique({ where: { id: parsedUserId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${parsedUserId} not found`);
      }

      return await this.prisma.chat.create({
        data: { 
          userId: parsedUserId, 
          title: title || 'New Chat' 
        },
        include: { messages: true },
      });
    } catch (error) {
      this.logger.error('DATABASE ERROR:', error);
      throw new InternalServerErrorException(error.message || 'Database error');
    }
  }

  async addMessage(chatId: string, role: string, content: string) {
    try {
      const message = await this.prisma.message.create({
        data: { chatId, role, content },
      });

      if (role === 'user') {
        this.generateAiResponse(chatId).catch(err => this.logger.error("AI Error:", err));
      }
      return message;
    } catch (error) {
      this.logger.error('ADD MESSAGE ERROR:', error);
      throw new InternalServerErrorException('Could not save message');
    }
  }

  private async generateAiResponse(chatId: string) {
    try {
      this.chatGateway.sendTypingStatus(chatId, true);
      
      const history = await this.prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: 'asc' },
        take: 12
      });

      const completion = await this.groq.chat.completions.create({
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant. Detect the language used by the user (Ukrainian or English) and respond in that same language. Be concise and natural.' 
          },
          ...history.map((m) => ({ role: m.role as any, content: m.content })),
        ],
        model: 'llama-3.3-70b-versatile',
      });

      const aiText = completion.choices[0]?.message?.content || 'Sorry, an error occurred while generating the response.';
      
      const aiMessage = await this.prisma.message.create({
        data: { chatId, role: 'assistant', content: aiText },
      });

      this.chatGateway.sendNewMessage(aiMessage);
    } catch (error) {
      this.logger.error('GROQ API ERROR:', error.message);
    } finally {
      this.chatGateway.sendTypingStatus(chatId, false);
    }
  }

  async updateChatTitle(id: string, title: string) {
    return this.prisma.chat.update({ where: { id }, data: { title } });
  }

  async deleteChat(id: string) {
    return this.prisma.chat.delete({ where: { id } });
  }
}