// src/google/google-calendar.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

@Injectable()
export class GoogleCalendarService {
  private calendar;

  constructor() {
    // load your service-account credentials
    const key = require('../../../software-project-461904-bdf34d2e0dd7.json');

    // configure a JWT client to impersonate a user (if needed)
    const auth = new JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
       subject: 'ajay.mishra@rrispat.com', // replace or remove if not using delegation
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  /**
   * Creates a Google Calendar event with a Meet link.
   * @param summary Title of the meeting
   * @param start Date object or ISO string
   * @param end   Date object or ISO string
   */
  async createMeetingLink(
    summary: string,
    start: Date,
    end: Date,
  ): Promise<string> {
     const key = require('../../../software-project-461904-bdf34d2e0dd7.json');
    const res = await this.calendar.events.insert({
      // calendarId: 'primary',
      calendarId: key.client_email  ,        // or a specific calendar
      conferenceDataVersion: 1,
      requestBody: {
        summary,
        start: { dateTime: start.toISOString() },
        end:   { dateTime: end.toISOString() },
        conferenceData: {
          createRequest: { requestId: `${Date.now()}` }, // unique ID
           conferenceSolutionKey: { type: 'hangoutsMeet' }   // explicit
        },
      },
    });

    const meetUrl =
      res.data.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri;

      if (!meetUrl) {
  throw new Error('Google Meet link not returned – check domain / scopes');
}
    Logger.log(`Created Meet link: ${meetUrl}`);
    return meetUrl!;
  }
}
