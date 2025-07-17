import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ExpertiseService } from './expertise.service';
import { CreateExpertiseDto } from './dto/create-expertise.dto';
import { UpdateExpertiseDto } from './dto/update-expertise.dto';
import { Expertise } from './entities/expertise.entity';

@Controller('/api/expertise')
export class ExpertiseController {
  constructor(private readonly service: ExpertiseService) {}

  @Post()
  create(@Body() dto: CreateExpertiseDto): Promise<Expertise> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<Expertise[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Expertise> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateExpertiseDto,
  ): Promise<Expertise> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Expertise> {
    return this.service.remove(id);
  }
}
