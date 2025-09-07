import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Public } from 'src/common/decorator/public.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Permissions } from 'src/common/decorator/permission.decorator';
import { CurrentUserInterceptor } from 'src/common/interceptor.ts/current-user.interceptor';

import type { JwtPayload } from './dto/jwt-payload';
import { authResponse } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<authResponse> {
    return this.authService.login(req.user);
  }

  // @Get('profile')
  // getProfile(@User() user: JwtPayload) {
  //   return user;
  // }

  @Get('test')
  @Roles(['admin'])
  testRole() {
    return 'Heehh';
  }

  @Get('test-per')
  @Permissions(['delete-user'])
  testPer() {
    return 'Heehh';
  }
}
