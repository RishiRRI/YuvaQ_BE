import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConsultantService } from './consultant.service';
import { CreateConsultantDto } from './dto/create-consultant.dto';
import { UpdateConsultantDto } from './dto/update-consultant.dto';
import { Consultant } from './entities/consultant.entity';

type StoredFile = Express.Multer.File & {
  location: string;
};

@Controller('/api/consultant')
export class ConsultantController {
  constructor(private readonly service: ConsultantService) {}

  @Post()
  @UseInterceptors(FileInterceptor('consultantImage'))
  create(
    @UploadedFile() file: StoredFile,        
    @Body() dto: CreateConsultantDto,
  ) {
    if (file?.location) {
      dto.consultantImage = file.location;
    }
    return this.service.create(dto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('consultantImage'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: StoredFile,
    @Body() dto: UpdateConsultantDto,
  ) {
    if (file?.location) {
      dto.consultantImage = file.location;
    }
    return this.service.update(id, dto);
  }

  @Get('byExpertise')
  findByExpertise(
    @Query('expertise') expertise: string | string[],
  ): Promise<Consultant[]> {
    const list = Array.isArray(expertise)
      ? expertise
      : expertise
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    return this.service.findByExpertise(list);
  }

  @Get()
  findAll(): Promise<Consultant[]> {
    return this.service.findAll();
  }

  @Get('verified')
  findAllVerifiedConsultant(): Promise<Consultant[]> {
    return this.service.findAllVerifiedConsultant();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Consultant> {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Consultant> {
    return this.service.remove(id);
  }

  @Get('completion/:id')
  async completion(@Param('id') id: string) {
    const percentage = await this.service.completion(id);
    return { percentage };
  }
}
