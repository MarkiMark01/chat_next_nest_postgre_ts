import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  sendNewMessage(message: any) {
    this.server.emit('receiveMessage', message);
  }
  sendTypingStatus(chatId: string, isTyping: boolean) {
  this.server.emit('typingStatus', { chatId, isTyping });
}
}