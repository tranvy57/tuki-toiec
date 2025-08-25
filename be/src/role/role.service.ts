import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from 'src/permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
  ) {}

  async createRole(name: string): Promise<Role> {
    const role = this.roleRepo.create({ name });
    return this.roleRepo.save(role);
  }

  async assignPermission(roleId: string, permName: string) {
    const role = await this.roleRepo.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    const perm = await this.permRepo.findOne({ where: { name: permName } });

    if (!role) throw new Error('Role not found');
    if (!perm) throw new Error('Permission not found');
    role.permissions.push(perm);

    return this.roleRepo.save(role);
  }
}
