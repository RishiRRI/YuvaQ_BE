import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name, 'Yuva')
    private readonly model: Model<Client>,
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    const doc = new this.model(dto);
    return doc.save();
  }

  async findAll(): Promise<Client[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Client> {
    const item = await this.model.findById(id).exec();
    if (!item) throw new NotFoundException(`Client with ID "${id}" not found`);
    return item;
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`Client with ID "${id}" not found`);
    return updated;
  }

  async remove(id: string): Promise<Client> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`Client with ID "${id}" not found`);
    return deleted;
  }
}
