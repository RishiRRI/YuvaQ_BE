// src/mediator/mediator.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mediator } from './entities/mediator.entity';
import { CreateMediatorDto } from './dto/create-mediator.dto';
import { UpdateMediatorDto } from './dto/update-mediator.dto';

@Injectable()
export class MediatorService {
  constructor(
    @InjectModel(Mediator.name, 'Yuva')
    private readonly mediatorModel: Model<Mediator>,
  ) {}

  async create(dto: CreateMediatorDto): Promise<Mediator> {
    const doc = new this.mediatorModel(dto);
    return doc.save();
  }

  async findAll(): Promise<Mediator[]> {
    return this.mediatorModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Mediator> {
    const medi = await this.mediatorModel.findById(id).exec();
    if (!medi) {
      throw new NotFoundException(`Mediator with ID "${id}" not found`);
    }
    return medi;
  }

  async update(id: string, dto: UpdateMediatorDto): Promise<Mediator> {
    const updated = await this.mediatorModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Mediator with ID "${id}" not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<Mediator> {
    const deleted = await this.mediatorModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Mediator with ID "${id}" not found`);
    }
    return deleted;
  }
}
