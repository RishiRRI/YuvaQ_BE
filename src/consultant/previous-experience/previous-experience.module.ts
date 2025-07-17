import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PreviousExperience,
  PreviousExperienceSchema,
} from './entities/previous-experience.entity';
import { PreviousExperienceService } from './previous-experience.service';
import { PreviousExperienceController } from './previous-experience.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: PreviousExperience.name, schema: PreviousExperienceSchema }],
      'Yuva',
    ),
  ],
  providers: [PreviousExperienceService],
  controllers: [PreviousExperienceController],
})
export class PreviousExperienceModule {}
