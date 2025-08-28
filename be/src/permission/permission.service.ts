import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private permRepo: Repository<Permission>,
  ) {}

  async createPermission(name: string): Promise<Permission> {
    const perm = this.permRepo.create({ name });
    return this.permRepo.save(perm);
  }
}
