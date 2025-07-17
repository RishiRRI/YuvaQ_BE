import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Qualification } from './entities/qualification.entity';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { UpdateQualificationDto } from './dto/update-qualification.dto';

@Injectable()
export class QualificationService {
  constructor(
    @InjectModel(Qualification.name, 'Yuva')
    private readonly model: Model<Qualification>,
  ) {}

  async create(dto: CreateQualificationDto): Promise<Qualification> {
    return new this.model(dto).save();
  }

  async findAll(): Promise<Qualification[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Qualification> {
    const qual = await this.model.findById(id).exec();
    if (!qual) throw new NotFoundException(`Qualification ${id} not found`);
    return qual;
  }

  async update(
    id: string,
    dto: UpdateQualificationDto,
  ): Promise<Qualification> {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Qualification ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<Qualification> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Qualification ${id} not found`);
    return deleted;
  }
}
