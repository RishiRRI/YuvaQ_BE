// src/google/google-oauth.service.ts
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleOAuthService {
  private oauth: OAuth2Client;

  constructor() {
    this.oauth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  generateAuthUrl(userId: string): string {
    return this.oauth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/calendar'],
      state: userId,                     // we pass the user’s app-ID back
    });
  }

  async exchangeCode(code: string) {
    const { tokens } = await this.oauth.getToken(code);
    return tokens; // contains refresh_token on first consent
  }

  getCalendar(tokens) {
    this.oauth.setCredentials(tokens);
    return google.calendar({ version: 'v3', auth: this.oauth });
  }
}
