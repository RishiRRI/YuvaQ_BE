import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expertise, ExpertiseSchema } from './entities/expertise.entity';
import { ExpertiseService } from './expertise.service';
import { ExpertiseController } from './expertise.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Expertise.name, schema: ExpertiseSchema }],
      'Yuva',
    ),
  ],
  providers: [ExpertiseService],
  controllers: [ExpertiseController],
})
export class ExpertiseModule {}
