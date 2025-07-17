// src/meeting-detail/meeting-detail.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MeetingDetail,
  MeetingDetailSchema,
} from './entities/meeting-detail.entity';
import { MeetingDetailController } from './meeting-details.controller';
import { MeetingDetailService } from './meeting-details.service';
import {
  Consultant,
  ConsultantSchema,
} from 'src/consultant/entities/consultant.entity';
import { Client, ClientSchema } from 'src/client/entities/client.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: MeetingDetail.name, schema: MeetingDetailSchema },
        { name: Consultant.name, schema: ConsultantSchema },
        { name: Client.name, schema: ClientSchema },
      ],
      'Yuva',
    ),
  ],
  providers: [MeetingDetailService],
  controllers: [MeetingDetailController],
})
export class MeetingDetailModule {}
