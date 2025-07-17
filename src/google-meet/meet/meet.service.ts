// src/meet/meet.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { GoogleOAuthService } from '../google/google-oauth.service';
import { UserService } from 'src/auth/service/user.service';

@Injectable()
export class MeetService {
  constructor(
    private gauth: GoogleOAuthService,
    private users: UserService,
  ) {}

  async create30MinMeet(userId: string): Promise<string> {
    const user = await this.users.findOne(userId);
    const tokens = user.googleTokens;
    if (!tokens?.refresh_token) {
      throw new BadRequestException('User has not linked Google Calendar');
    }

    const calendar = this.gauth.getCalendar(tokens);

    const start = new Date();
    const end   = new Date(start.getTime() + 30 * 60000);

    const { data } = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: 'Quick Meet',
        start: { dateTime: start.toISOString() },
        end:   { dateTime: end.toISOString() },
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    const meetUrl =
      data.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri;

    if (!meetUrl) throw new Error('Meet URL not returned');
    return meetUrl;
  }
}
