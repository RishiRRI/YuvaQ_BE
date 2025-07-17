import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PreviousExperienceService } from './previous-experience.service';
import { CreatePreviousExperienceDto } from './dto/create-previous-experience.dto';
import { UpdatePreviousExperienceDto } from './dto/update-previous-experience.dto';
import { PreviousExperience } from './entities/previous-experience.entity';

@Controller('/api/previousExperience')
export class PreviousExperienceController {
  constructor(private readonly service: PreviousExperienceService) {}

  @Post()
  create(
    @Body() dto: CreatePreviousExperienceDto,
  ): Promise<PreviousExperience> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<PreviousExperience[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PreviousExperience> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePreviousExperienceDto,
  ): Promise<PreviousExperience> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<PreviousExperience> {
    return this.service.remove(id);
  }
}
