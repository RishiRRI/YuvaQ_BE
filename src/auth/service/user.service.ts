import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../schemas/user.schema';
const bcrypt = require('bcryptjs');
import * as crypto from 'crypto';

import { ChangePasswordDto } from '../dto/change-password-dto';
import { MailService } from 'src/mail/mail.service';
import { UpdateGoogleTokensDto } from '../dto/update-googleTokens.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, 'Yuva')
    private userModel: Model<User>,
    private mail: MailService,
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

  async findAll(): Promise<User[]> {
    return this.userModel
      .find()
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return updatedUser;
  }

  async updateGoogleTokens(
    id: string,
    updateDto: UpdateGoogleTokensDto,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return deletedUser;
  }

  async removeByUserId(userId: string): Promise<User> {
    const deleted = await this.userModel.findOneAndDelete({ userId }).exec();

    if (!deleted) {
      throw new NotFoundException(`User with userId "${userId}" not found`);
    }
    return deleted;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    if (
      changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword
    ) {
      throw new Error('New password and confirm password do not match');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      saltRounds,
    );

    user.password = hashedPassword;

    return user.save();
  }

  async findByPhoneNumber(phoneNumber: string) {
    return this.userModel.findOne({
      phoneNumber: phoneNumber,
    });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email: email,
    });
  }

  async findByUserId(userId: string) {
    return this.userModel.findOne({
      userId: userId,
    });
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { fcmToken }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    return user;
  }
}
