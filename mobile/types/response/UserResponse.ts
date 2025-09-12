import { z } from 'zod';

export const PermissionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const RoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  permissions: z.array(PermissionSchema),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isActive: z.boolean(),
  username: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  roles: z.array(RoleSchema),
});

export type Permission = z.infer<typeof PermissionSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type User = z.infer<typeof UserSchema>;