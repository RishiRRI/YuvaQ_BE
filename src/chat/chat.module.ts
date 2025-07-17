import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import {
  ChatThreadForConsultant,
  ChatThreadForConsultantSchema,
} from './entities/chat-thread-for-consultant.entity';
import {
  ChatThreadForMediator,
  ChatThreadForMediatorSchema,
} from './entities/chat-thread-for-mediator.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ChatThreadForMediator.name,
          schema: ChatThreadForMediatorSchema,
        },
      ],
      'Yuva',
    ),
    MongooseModule.forFeature(
      [
        {
          name: ChatThreadForConsultant.name,
          schema: ChatThreadForConsultantSchema,
        },
      ],
      'Yuva',
    ),
  ],

  providers: [ChatService, ChatGateway],
  // controllers: [ChatController],
})
export class ChatModule {}
