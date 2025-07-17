import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ConsultantDetail,
  ConsultantDetailSchema,
} from './entities/consultant-detail.entity';
import { ConsultantDetailController } from './consultant-details.controller';
import { ConsultantDetailService } from './consultant-details.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ConsultantDetail.name, schema: ConsultantDetailSchema }],
      'Yuva',
    ),
  ],
  providers: [ConsultantDetailService],
  controllers: [ConsultantDetailController],
})
export class ConsultantDetailModule {}
