import { DataSource } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { Permission } from 'src/permission/entities/permission.entity';

export async function seedRolesAndPermissions(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(Role);
  const permRepo = dataSource.getRepository(Permission);

  // Danh sách permission cần có
  const basePerms = [
    'user.read',
    'user.create',
    'user.update',
    'user.delete',
    'lesson.view',
  ];

  // Tạo permissions nếu chưa tồn tại (idempotent)
  const permissions: Permission[] = [];
  for (const name of basePerms) {
    let perm = await permRepo.findOne({ where: { name } });
    if (!perm) {
      perm = permRepo.create({ name });
      await permRepo.save(perm);
    }
    permissions.push(perm);
  }

  // Lấy quyền cho user role
  const userPerms = permissions.filter(
    (p) => p.name === 'user.read' || p.name === 'lesson.view',
  );

  // Tạo role admin (có tất cả quyền)
  let adminRole = await roleRepo.findOne({
    where: { name: 'admin' },
    relations: ['permissions'],
  });
  if (!adminRole) {
    adminRole = roleRepo.create({ name: 'admin', permissions });
  } else {
    // merge quyền mới nếu chưa có
    const map = new Map(adminRole.permissions.map((p) => [p.name, p]));
    permissions.forEach((p) => map.set(p.name, p));
    adminRole.permissions = Array.from(map.values());
  }
  await roleRepo.save(adminRole);

  // Tạo role user (chỉ có quyền xem)
  let userRole = await roleRepo.findOne({
    where: { name: 'user' },
    relations: ['permissions'],
  });
  if (!userRole) {
    userRole = roleRepo.create({ name: 'user', permissions: userPerms });
  } else {
    const map = new Map(userRole.permissions.map((p) => [p.name, p]));
    userPerms.forEach((p) => map.set(p.name, p));
    userRole.permissions = Array.from(map.values());
  }
  await roleRepo.save(userRole);
}
