import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateFcmTokenDto } from '../dto/update-fcm-token.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../service/user.service';
import { User } from '../schemas/user.schema';

@Controller('/api/users/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('normalRegister')
  create(@Body() createUserDto: CreateUserDto) {
    // console.log(createUserDto);
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
  
  @Get('findByUserId/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<User | null> {
    return this.userService.findByUserId(userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }

  @Delete('removeByUserId/:userId')
  removeByUserId(@Param('userId') userId: string) {
    return this.userService.removeByUserId(userId);
  }
}
