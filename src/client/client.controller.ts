import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { ConsultantService } from 'src/consultant/consultant.service';

type StoredFile = Express.Multer.File & { location: string };

@Controller('/api/client')
export class ClientController {
  constructor(private readonly service: ClientService,   private readonly consultants: ConsultantService,) {}

  @Post()
  @UseInterceptors(FileInterceptor('clientImage'))
  async create(
    @UploadedFile() file: StoredFile,
    @Body() dto: CreateClientDto & { referralCode?: string },
  ): Promise<Client> {
    if (file?.location) dto.clientImage = file.location;
    
   if (dto.referralCode) {
      const cons = await this.consultants.findOneByCode(dto.referralCode);
      if (!cons) {
        throw new BadRequestException('Referral code invalid');
      }
      dto.referredBy = (cons._id as string).toString();
    }

    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<Client[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Client> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('clientImage'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: StoredFile,
    @Body() dto: UpdateClientDto,
  ): Promise<Client> {
    if (file?.location) dto.clientImage = file.location;
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Client> {
    return this.service.remove(id);
  }
}
