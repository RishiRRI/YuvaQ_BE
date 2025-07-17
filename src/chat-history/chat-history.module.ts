import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatHistory, ChatHistorySchema } from './entities/chat-history.entity';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistoryController } from './chat-history.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ChatHistory.name, schema: ChatHistorySchema }],
      'Yuva',
    ),
  ],
  providers: [ChatHistoryService],
  controllers: [ChatHistoryController],
})
export class ChatHistoryModule {}
