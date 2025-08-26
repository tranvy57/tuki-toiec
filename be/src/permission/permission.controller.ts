import { Controller, Post, Body } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Public()
  create(@Body('name') name: string) {
    return this.permissionService.createPermission(name);
  }
}
