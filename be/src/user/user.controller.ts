import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ApiResponseWrapper } from 'src/common/decorator/api-response-swapper.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @ApiResponseWrapper(UserResponseDto)
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    console.log(user);
    return user;
  }

  @Post('/vocabularies/:id')
  async saveUserVocab(@CurrentUser() user: User, @Param('id') id: string) {
    return this.userService.saveUserVocab(id, user);
  }

  @Get('/vocabularies')
  async getUserVocab(@CurrentUser() user: User) {
    return this.userService.getListUserVocab(user);
  }

  @Delete('/vocabularies/:id')
  async deleteUserVocab(@CurrentUser() user: User, @Param('id') id: string) {
    return this.userService.deleteUserVocab(user, id);
  }

  @Patch('update-me')
  async updateMe(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
    return this.userService.updateMe(user, dto);
  }

  @Get('me')
  async getMe(@CurrentUser() user: User) {
    return this.userService.getMe(user);
  }
}
