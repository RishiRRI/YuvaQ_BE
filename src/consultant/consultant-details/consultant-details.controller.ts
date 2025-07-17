import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateConsultantDetailDto } from './dto/create-consultant-detail.dto';
import { UpdateConsultantDetailDto } from './dto/update-consultant-detail.dto';
import { ConsultantDetail } from './entities/consultant-detail.entity';
import { ConsultantDetailService } from './consultant-details.service';

@Controller('/api/consultantDetail')
export class ConsultantDetailController {
  constructor(private readonly service: ConsultantDetailService) {}

  @Post()
  create(@Body() dto: CreateConsultantDetailDto): Promise<ConsultantDetail> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<ConsultantDetail[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ConsultantDetail> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateConsultantDetailDto,
  ): Promise<ConsultantDetail> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ConsultantDetail> {
    return this.service.remove(id);
  }
}
