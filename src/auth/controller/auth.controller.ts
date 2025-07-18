import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  HostParam,
  Req,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from '../service/user.service';
import * as crypto from 'crypto';
import { CreateUserDto } from '../dto/create-user.dto';


@Controller('/api/auth/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UserService,

  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto, @Req() request: Request) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  // @Post('otp/send-email')
  // async sendOtp(@Body('email') email: string) {
  //   await this.emailOtp.sendOtp(email);
  //   return { success: true, message: 'OTP sent' };
  // }

  // @Post('otp/verify-email')
  // async verifyEmailOtp(@Body() body: { email: string; code: string }) {
  //   const signupToken = await this.emailOtp.verifyOtp(body.email, body.code);
  //   return { success: true, signupToken };
  // }

  // @Post('otp/send-phone')
  // async sendPhoneOtp(@Body('phoneNumber') phoneNumber: string) {
  //   await this.phoneOtp.sendOtp(phoneNumber);
  //   return { success: true, message: 'Phone OTP sent via WhatsApp' };
  // }

  // @Post('otp/verify-phone')
  // async verifyPhoneOtp(@Body() body: { phoneNumber: string; code: string }) {
  //   await this.phoneOtp.verifyOtp(body.phoneNumber, body.code);
  //   return { success: true, message: 'Phone number verified' };
  // }

  // @Post('register')
  // async register(
  //   @Body('signupToken') signupToken: string,
  //   @Body() dto: CreateUserDto,
  // ) {
  //   const email = await this.emailOtp.assertEmailVerified(signupToken);

  //   dto.email = email;
  //   dto.emailVerified = true;
  //   dto.phoneNumberVerified = true;
  //   const user = await this.authService.create(dto);
  //   return { success: true, user };
  // }

  @UseGuards(AuthGuard())
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('connected')
  async handleConnect(@Body() payload: { id: string }): Promise<string> {
    const id: string = payload.id;

    if (id.length > 0) {
      const user = await this.usersService.findOne(id);
      console.log(`User connected: ${user.fullName}`);

      return `User connected: ${user.fullName}`;
    }

    return 'User ID is empty!';
  }

  @Post('disconnected')
  async handleDisconnect(@Body() payload: { id: string }): Promise<string> {
    const id: string = payload.id;

    if (id.length > 0) {
      const user = await this.usersService.findOne(id);
      console.log(`User disconnected: ${user.fullName}`);

      return `User disconnected: ${user.fullName}`;
    }

    return 'User ID is empty!';
  }
}
