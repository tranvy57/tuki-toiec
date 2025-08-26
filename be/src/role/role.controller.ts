import { Controller, Post, Body, Param } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body('name') name: string) {
    return this.roleService.createRole(name);
  }

  @Post(':id/permissions')
  assignPermission(@Param('id') id: string, @Body('perm') perm: string) {
    return this.roleService.assignPermission(id, perm);
  }
}
