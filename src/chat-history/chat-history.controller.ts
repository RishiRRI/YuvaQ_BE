import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import { AddMessageDto } from './dto/add-message.dto';
import { ChatHistory } from './entities/chat-history.entity';

@Controller('/api/chatHistory')
export class ChatHistoryController {
  constructor(private readonly service: ChatHistoryService) {}

  @Post()
  create(@Body() dto: CreateChatHistoryDto): Promise<ChatHistory> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<ChatHistory[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ChatHistory> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateChatHistoryDto,
  ): Promise<ChatHistory> {
    return this.service.update(id, dto);
  }

  @Post('addMessage/:id')
  addMessage(
    @Param('id') id: string,
    @Body() dto: AddMessageDto,
  ): Promise<ChatHistory> {
    return this.service.addMessage(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ChatHistory> {
    return this.service.remove(id);
  }
}
