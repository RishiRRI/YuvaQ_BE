// src/mail/mail.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('/api/mail')
export class MailController {
  constructor(private readonly mail: MailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async send(@Body() dto: SendMailDto) {
    await this.mail.sendCustomEmail(dto.to, dto.subject, dto.message);
    return { success: true };
  }
}
