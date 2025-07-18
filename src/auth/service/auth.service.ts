import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcryptjs');
import { UserService } from './user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schemas/user.schema';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name, 'Yuva')
    private userModel: Model<User>,
    // private mail: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new this.userModel({
      ...rest,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    if (!user.emailVerified) {
      throw new UnauthorizedException('Please Verify your email first');
    }

    if (!user.phoneNumberVerified) {
      throw new UnauthorizedException('Please verify your phone number first');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect password');
    }
    const token = this.jwtService.sign({ id: user._id });
    await this.userService.updateFcmToken(user.id, token);

    console.log(token);
    return {
      success: true,
      token: token,
      // id: user._id,
      // name: user.fullName,
      user: {
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        userId: user._id,
      },
      msg: 'Login Successful',
    };
  }
}
