// src/meet/meet.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MeetService } from './meet.service';

@Controller('/api/meet')
export class MeetController {
  constructor(private meet: MeetService) {}

  /** userId query param identifies the app’s user record */
  @Get('new')
  async newMeet(@Query('userId') userId: string) {
    const meetUrl = await this.meet.create30MinMeet(userId);
    return { meetUrl };
  }
}
