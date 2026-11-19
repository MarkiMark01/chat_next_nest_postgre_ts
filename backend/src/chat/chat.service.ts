import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma.service';
import { ChatGateway } from './chat.gateway';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

@Injectable()
export class ChatService {
  private groq: OpenAI;
  private readonly logger = new Logger(ChatService.name);

  // Чати, в яких ШІ зараз пише відповідь. Не дає запустити дві відповіді одночасно.
  private generatingChats = new Set<string>();

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

  // Перевіряє, що чат існує і належить цьому користувачу.
  // Якщо ні, повертаємо 404 (а не 403), щоб не показувати, що чужий чат існує.
  private async checkChatOwner(chatId: string, userId: number) {
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat || chat.userId !== userId) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }

  async getChats(userId: number) {
    return this.prisma.chat.findMany({
      where: { userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createChat(userId: number, title: string) {
    return this.prisma.chat.create({
      data: { userId, title: title || 'New Chat' },
      include: { messages: true },
    });
  }

  async addMessage(chatId: string, userId: number, content: string) {
    await this.checkChatOwner(chatId, userId);

    if (this.generatingChats.has(chatId)) {
      throw new ConflictException('The assistant is still answering, please wait');
    }

    // role завжди 'user', клієнт більше не може підставити 'system' чи 'assistant'
    const message = await this.prisma.message.create({
      data: { chatId, role: 'user', content },
    });

    // Відповідь ШІ генерується у фоні, а користувач одразу отримує своє повідомлення
    this.generateAiResponse(chatId, userId);
    return message;
  }

  private async generateAiResponse(chatId: string, userId: number) {
    this.generatingChats.add(chatId);

    try {
      this.chatGateway.sendTypingStatus(userId, chatId, true);

      // Беремо 12 останніх повідомлень (desc + take), потім розвертаємо
      // у хронологічний порядок, щоб модель бачила актуальний контекст
      const recent = await this.prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: 'desc' },
        take: 12,
      });
      const history = recent.reverse();

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant. Detect the language used by the user (Ukrainian or English) and respond in that same language. Be concise and natural.',
          },
          ...history.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        ],
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      });

      const aiText = completion.choices[0]?.message?.content;
      if (!aiText) throw new Error('Empty response from model');

      const aiMessage = await this.prisma.message.create({
        data: { chatId, role: 'assistant', content: aiText },
      });

      this.chatGateway.sendNewMessage(userId, aiMessage);
    } catch (error) {
      this.logger.error('GROQ API ERROR:', getErrorMessage(error));
      // Раніше помилка лише писалась у лог, а користувач нічого не бачив
      this.chatGateway.sendError(userId, chatId, 'Failed to get a response. Try again.');
    } finally {
      this.generatingChats.delete(chatId);
      this.chatGateway.sendTypingStatus(userId, chatId, false);
    }
  }

  async updateChatTitle(id: string, userId: number, title: string) {
    await this.checkChatOwner(id, userId);
    return this.prisma.chat.update({ where: { id }, data: { title } });
  }

  async deleteChat(id: string, userId: number) {
    await this.checkChatOwner(id, userId);
    return this.prisma.chat.delete({ where: { id } });
  }
}