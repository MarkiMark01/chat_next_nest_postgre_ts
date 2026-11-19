import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ALLOWED_ORIGINS } from '../cors';

@WebSocketGateway({
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      const payload = await this.jwtService.verifyAsync(token);
      client.join(`user:${payload.sub}`);
    } catch {
      client.disconnect();
    }
  }

  sendNewMessage(userId: number, message: any) {
    this.server.to(`user:${userId}`).emit('receiveMessage', message);
  }

  sendTypingStatus(userId: number, chatId: string, isTyping: boolean) {
    this.server.to(`user:${userId}`).emit('typingStatus', { chatId, isTyping });
  }

  sendError(userId: number, chatId: string, message: string) {
    this.server.to(`user:${userId}`).emit('aiError', { chatId, message });
  }
}