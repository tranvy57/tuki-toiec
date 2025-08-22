import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ApiResponseWrapper } from 'src/common/decorator/api-response-swapper.decorator';
// import { Public } from 'src/common/decorator/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @Public()
  @ApiResponseWrapper(UserResponseDto)
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    console.log(user);
    return user;
  }
}
