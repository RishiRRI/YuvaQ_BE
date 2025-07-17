import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PreviousExperience } from './entities/previous-experience.entity';
import { CreatePreviousExperienceDto } from './dto/create-previous-experience.dto';
import { UpdatePreviousExperienceDto } from './dto/update-previous-experience.dto';

@Injectable()
export class PreviousExperienceService {
  constructor(
    @InjectModel(PreviousExperience.name, 'Yuva')
    private readonly model: Model<PreviousExperience>,
  ) {}

  async create(dto: CreatePreviousExperienceDto): Promise<PreviousExperience> {
    return await new this.model(dto).save();
  }

  async findAll(): Promise<PreviousExperience[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<PreviousExperience> {
    const exp = await this.model.findById(id).exec();
    if (!exp) throw new NotFoundException(`PreviousExperience ${id} not found`);
    return exp;
  }

  async update(
    id: string,
    dto: UpdatePreviousExperienceDto,
  ): Promise<PreviousExperience> {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`PreviousExperience ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<PreviousExperience> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`PreviousExperience ${id} not found`);
    return deleted;
  }
}
