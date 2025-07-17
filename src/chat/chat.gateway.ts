import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { pendingChats } from './entities/pending-chat';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly chat: ChatService) {}

  @SubscribeMessage('requestHuman')
  handleRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { clientId: string; question: string },
  ) {
    const threadId = crypto.randomUUID();

    pendingChats.set(threadId, {
      clientId: body.clientId,
      question: body.question,
    });

    this.server.emit('incomingChat', {
      threadId,
      clientId: body.clientId,
      question: body.question,
    });

    client.emit('humanRequested', { threadId });
  }

  @SubscribeMessage('acceptChat')
  handleAccept(
    @ConnectedSocket() mediatorSock: Socket,
    @MessageBody() body: { threadId: string; mediatorId: string },
  ) {
    const ticket = pendingChats.get(body.threadId);
    if (!ticket)
      return mediatorSock.emit('acceptError', 'Chat no longer pendiing');

    if (ticket.takenBy)
      return mediatorSock.emit('acceptError', 'Already taken');
    ticket.takenBy = body.mediatorId;

    const room = `thread_${[body.mediatorId, ticket.clientId].sort().join('_')}`;
    mediatorSock.join(room);
    this.server.to(ticket.clientId).socketsJoin(room);

    this.server.to(room).emit('chatAccepted', {
      threadId: body.threadId,
      mediatorId: body.mediatorId,
    });

    this.server.emit('chatAcceptedByMediator', {
      threadId: body.threadId,
      mediatorId: body.mediatorId,
    });

    pendingChats.delete(body.threadId);
  }

  @SubscribeMessage('joinThreadOfMediator')
  handleJoinForMediator(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { mediatorId, clientId }: { mediatorId: string; clientId: string },
  ) {
    const room = `thread_${[mediatorId, clientId].sort().join('_')}`;
    client.join(room);
    client.emit('joined', room);
  }

  @SubscribeMessage('sendMessageOfMediator')
  async handleSendForMediator(
    @MessageBody()
    payload: {
      mediatorId: string;
      clientId: string;
      sender: 'mediator' | 'client';
      body: string;
    },
  ) {
    const { mediatorId, clientId } = payload;

    const msg = await this.chat.sendMessageForMediator(
      mediatorId,
      clientId,
      payload.sender,
      payload.body,
    );

    const room = `thread_${[mediatorId, clientId].sort().join('_')}`;

    // this.server.to(room).emit('newMessageOfMediator', msg);
    this.server.to(room).emit('newMessageOfMediator', {
      ...msg,
      clientId,
      mediatorId,
    });
    return msg;
  }

  @SubscribeMessage('getHistoryOfMediator')
  async handleGetHistoryForMediator(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    {
      mediatorId,
      clientId,
      limit = 30,
      skip = 0,
    }: {
      mediatorId: string;
      clientId: string;
      limit?: number;
      skip?: number;
    },
  ) {
    const msgs = await this.chat.getMessagesForMediator(
      mediatorId,
      clientId,
      limit,
      skip,
    );

    client.emit('getHistoryOfMediator', msgs);
    return msgs;
  }

  @SubscribeMessage('joinThreadOfConsultant')
  handleJoinForConsultant(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { consultantId, clientId }: { consultantId: string; clientId: string },
  ) {
    const room = `thread_${[consultantId, clientId].sort().join('_')}`;
    client.join(room);
    client.emit('joined', room);
  }

  @SubscribeMessage('sendMessageOfConsultant')
  async handleSendForConsultant(
    @MessageBody()
    payload: {
      consultantId: string;
      clientId: string;
      sender: 'consultant' | 'client';
      body: string;
      image?: Express.Multer.File;
    },
  ) {
    const { consultantId, clientId, image } = payload;

    const msg = await this.chat.sendMessageForConsultant(
      consultantId,
      clientId,
      payload.sender,
      payload.body,
      image,
    );

    const room = `thread_${[consultantId, clientId].sort().join('_')}`;

    this.server.to(room).emit('newMessageOfConsultant', msg);
    return msg;
  }

  @SubscribeMessage('getHistoryOfConsultant')
  async handleGetHistoryForConsultant(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    {
      consultantId,
      clientId,
      limit = 30,
      skip = 0,
    }: {
      consultantId: string;
      clientId: string;
      limit?: number;
      skip?: number;
    },
  ) {
    const msgs = await this.chat.getMessagesForConsultant(
      consultantId,
      clientId,
      limit,
      skip,
    );

    client.emit('getHistoryOfConsultant', msgs);
    return msgs;
  }
}
