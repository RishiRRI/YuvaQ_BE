import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistory } from './entities/chat-history.entity';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';
import { AddMessageDto } from './dto/add-message.dto';

@Injectable()
export class ChatHistoryService {
  constructor(
    @InjectModel(ChatHistory.name, 'Yuva')
    private readonly model: Model<ChatHistory>,
  ) {}

  async create(dto: CreateChatHistoryDto): Promise<ChatHistory> {
    return new this.model(dto).save();
  }

  async findAll(): Promise<ChatHistory[]> {
    return this.model.find().sort({ updatedAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ChatHistory> {
    const doc = await this.model.findById(id).exec();
    if (!doc) throw new NotFoundException(`ChatHistory ${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateChatHistoryDto): Promise<ChatHistory> {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`ChatHistory ${id} not found`);
    return updated;
  }

  /** Push a single new message into the messages array */
  async addMessage(id: string, msg: AddMessageDto): Promise<ChatHistory> {
    const updated = await this.model
      .findByIdAndUpdate(
        id,
        {
          $push: {
            messages: { ...msg, sentAt: new Date() },
          },
        },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException(`ChatHistory ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<ChatHistory> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`ChatHistory ${id} not found`);
    return deleted;
  }
}
