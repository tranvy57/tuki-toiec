import z from "zod";
import { BaseEntitySchema } from "../common";


export const permissions = z.object({
  id: z.string(),
  name: z.string(),
});

export const roles = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(permissions),
})

export const UserSchema = BaseEntitySchema.extend({
  email: z.string(),
  phone: z.string().optional(),
  username: z.string(),
  displayName: z.string(),
  avatar: z.string().optional(),
  roles: z.array(roles),
});



export type User = z.infer<typeof UserSchema>;

export interface UserProfile {
  displayName: string;
  avatar?: string;
  birthday?: Date;
  gender?: boolean;
  phone?: string;
  zipcode?: string;
  contact?: string;
  addressDetail?: string;
}

export interface UserStats {
  totalTests: number;
  averageScore: number;
  studyTime: number; // in minutes
  weeklyGoalProgress: number; // percentage
}
