import { Injectable, OnModuleInit } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Permission } from 'src/permission/entities/permission.entity';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly entityManager: EntityManager) {}

  async onModuleInit() {
    const basePerms = [
      'user.read',
      'user.create',
      'user.update',
      'user.delete',
      'lesson.view',
    ];

    const permissions: Permission[] = [];

    // Tạo hoặc lấy các permission
    for (const name of basePerms) {
      let perm = await this.entityManager.findOne(Permission, {
        where: { name },
      });
      if (!perm) {
        perm = this.entityManager.create(Permission, { name });
        perm = await this.entityManager.save(perm);
      }
      permissions.push(perm);
    }

    // Quyền cho role "user"
    const userPerms = permissions.filter(
      (p) => p.name === 'user.read' || p.name === 'lesson.view',
    );

    // Role admin: có tất cả quyền
    let adminRole = await this.entityManager.findOne(Role, {
      where: { name: 'admin' },
      relations: ['permissions'],
    });
    if (!adminRole) {
      adminRole = this.entityManager.create(Role, {
        name: 'admin',
        permissions,
      });
    } else {
      const map = new Map(adminRole.permissions.map((p) => [p.name, p]));
      permissions.forEach((p) => map.set(p.name, p));
      adminRole.permissions = Array.from(map.values());
    }
    await this.entityManager.save(adminRole);

    // Role user: chỉ có quyền xem
    let userRole = await this.entityManager.findOne(Role, {
      where: { name: 'user' },
      relations: ['permissions'],
    });
    if (!userRole) {
      userRole = this.entityManager.create(Role, {
        name: 'user',
        permissions: userPerms,
      });
    } else {
      const map = new Map(userRole.permissions.map((p) => [p.name, p]));
      userPerms.forEach((p) => map.set(p.name, p));
      userRole.permissions = Array.from(map.values());
    }
    await this.entityManager.save(userRole);

    console.log('✅ Seed roles & permissions hoàn tất!');
  }
}
