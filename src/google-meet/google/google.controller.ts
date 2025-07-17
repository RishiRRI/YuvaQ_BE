// src/google/google.controller.ts
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GoogleOAuthService } from './google-oauth.service';
import { UserService } from 'src/auth/service/user.service';

@Controller('/api/google')
export class GoogleController {
  constructor(
    private gauth: GoogleOAuthService,
    private users: UserService,
  ) {}

  /** Step 1: redirect to Google */
  @Get('auth')
  auth(@Query('userId') userId: string, @Res() res: Response) {
    const url = this.gauth.generateAuthUrl(userId);
    return res.redirect(url);
  }

  /** Step 2: Google redirects back here with `code` */
  @Get('oauth2callback')
  async callback(
    @Query('code') code: string,
    @Query('state') userId: string,
    @Res() res: Response,
  ) {
    const tokens = await this.gauth.exchangeCode(code);

    // persist refresh_token; for demo just store on user doc
    await this.users.updateGoogleTokens(userId, { googleTokens: tokens });

    return res.send('Google Calendar linked. You may close this tab.');
  }
}
