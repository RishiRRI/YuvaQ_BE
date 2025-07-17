import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QualificationService } from './qualification.service';
import { CreateQualificationDto } from './dto/create-qualification.dto';
import { UpdateQualificationDto } from './dto/update-qualification.dto';
import { Qualification } from './entities/qualification.entity';

type StoredFile = Express.Multer.File & { location: string };

@Controller('/api/qualification')
export class QualificationController {
  constructor(private readonly service: QualificationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() file: StoredFile,
    @Body() dto: CreateQualificationDto,
  ): Promise<Qualification> {
    if (file?.location) dto.image = file.location;
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<Qualification[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Qualification> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: StoredFile,
    @Body() dto: UpdateQualificationDto,
  ): Promise<Qualification> {
    if (file?.location) dto.image = file.location;
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Qualification> {
    return this.service.remove(id);
  }
}
