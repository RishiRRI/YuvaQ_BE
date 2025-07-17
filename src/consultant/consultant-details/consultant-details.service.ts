import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsultantDetail } from './entities/consultant-detail.entity';
import { CreateConsultantDetailDto } from './dto/create-consultant-detail.dto';
import { UpdateConsultantDetailDto } from './dto/update-consultant-detail.dto';

@Injectable()
export class ConsultantDetailService {
  constructor(
    @InjectModel(ConsultantDetail.name, 'Yuva')
    private readonly model: Model<ConsultantDetail>,
  ) {}

  async create(dto: CreateConsultantDetailDto): Promise<ConsultantDetail> {
    return await new this.model(dto).save();
  }

  async findAll(): Promise<ConsultantDetail[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ConsultantDetail> {
    const detail = await this.model.findById(id).exec();
    if (!detail)
      throw new NotFoundException(`ConsultantDetail ${id} not found`);
    return detail;
  }

  async update(
    id: string,
    dto: UpdateConsultantDetailDto,
  ): Promise<ConsultantDetail> {
    const updated = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`ConsultantDetail ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<ConsultantDetail> {
    const deleted = await this.model.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`ConsultantDetail ${id} not found`);
    return deleted;
  }
}
