import {
  Body,
  Controller,
  Get,
  Param,
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

  @Post(':id/vocabularies')
  async saveUserVocab(@CurrentUser() user: User, @Param('id') id: string) {
    return this.userService.saveUserVocab(id, user);
  }

  @Get('/vocabularies')
  async getUserVocab(@CurrentUser() user: User) {
    return this.userService.getListUserVocab(user);
  }
}
