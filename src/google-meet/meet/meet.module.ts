// src/meet/meet.module.ts
import { Module } from '@nestjs/common';
import { MeetService } from './meet.service';
import { MeetController } from './meet.controller';
import { GoogleModule } from '../google/google.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [GoogleModule, AuthModule],
  providers: [MeetService],
  controllers: [MeetController],
})
export class MeetModule {}