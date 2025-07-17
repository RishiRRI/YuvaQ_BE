import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CreateMeetingDetailDto } from './dto/create-meeting-detail.dto';
import { UpdateMeetingDetailDto } from './dto/update-meeting-detail.dto';
import { MeetingDetail } from './entities/meeting-detail.entity';
import { MeetingDetailService } from './meeting-details.service';

@Controller('/api/meetingDetail')
export class MeetingDetailController {
  constructor(private readonly service: MeetingDetailService) {}

  @Post()
  create(@Body() dto: CreateMeetingDetailDto) {
    return this.service.create(dto);
  }

  @Post(':id/extend')
  extend(@Param('id') id: string) {
    return this.service.extend(id);
  }

  @Post(':id/extendForNewClient')
  extendForNewClient(@Param('id') id: string) {
    return this.service.extendForNewClient(id);
  }

  @Get('free/:consultantId/:date')
  free(@Param('consultantId') id: string, @Param('date') date: string) {
    return this.service.listFreeSlots(id, date);
  }

  // @Post()
  // create(@Body() dto: CreateMeetingDetailDto): Promise<MeetingDetail> {
  //   return this.service.create(dto);
  // }

  @Get('filters')
  findByFilters(
    @Query('consultantId') consultantId?: string,
    @Query('clientId') clientId?: string,
    @Query('meetingStatus') meetingStatus?: string,
  ): Promise<MeetingDetail[]> {
    return this.service.findByFilters({
      consultantId,
      clientId,
      meetingStatus,
    });
  }

  @Get()
  findAll(): Promise<MeetingDetail[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MeetingDetail> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMeetingDetailDto,
  ): Promise<MeetingDetail> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<MeetingDetail> {
    return this.service.remove(id);
  }
}
