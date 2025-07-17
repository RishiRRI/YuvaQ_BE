import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expertise } from './entities/expertise.entity';
import { CreateExpertiseDto } from './dto/create-expertise.dto';
import { UpdateExpertiseDto } from './dto/update-expertise.dto';

@Injectable()
export class ExpertiseService {
  constructor(
    @InjectModel(Expertise.name, 'Yuva')
    private readonly model: Model<Expertise>,
  ) {}

  async create(dto: CreateExpertiseDto): Promise<Expertise> {
    const doc = new this.model(dto);
    return doc.save();
  }

  async findAll(): Promise<Expertise[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Expertise> {
    const item = await this.model.findById(id).exec();
    if (!item)
      throw new NotFoundException(`Business Area with ID "${id}" not found`);
    return item;
  }

  async update(id: string, dto: UpdateExpertiseDto): Promise<Expertise> {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`Business Area with ID "${id}" not found`);
    return updated;
  }

  async remove(id: string): Promise<Expertise> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`Business Area with ID "${id}" not found`);
    return deleted;
  }
}
