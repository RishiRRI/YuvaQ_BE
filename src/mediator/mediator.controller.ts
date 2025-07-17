// src/mediator/mediator.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MediatorService } from './mediator.service';
import { CreateMediatorDto } from './dto/create-mediator.dto';
import { UpdateMediatorDto } from './dto/update-mediator.dto';
import { Mediator } from './entities/mediator.entity';

@Controller('/api/mediators')
export class MediatorController {
  constructor(private readonly service: MediatorService) {}

  @Post()
  create(@Body() dto: CreateMediatorDto): Promise<Mediator> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<Mediator[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Mediator> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMediatorDto,
  ): Promise<Mediator> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Mediator> {
    return this.service.remove(id);
  }
}
