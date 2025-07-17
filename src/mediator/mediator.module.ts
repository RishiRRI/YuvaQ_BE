// src/mediator/mediator.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mediator, MediatorSchema } from './entities/mediator.entity';
import { MediatorService } from './mediator.service';
import { MediatorController } from './mediator.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Mediator.name, schema: MediatorSchema }],
      'Yuva',
    ),
  ],
  providers: [MediatorService],
  controllers: [MediatorController],
})
export class MediatorModule {}
