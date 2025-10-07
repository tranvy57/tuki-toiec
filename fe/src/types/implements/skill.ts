import z from "zod";
import { BaseEntitySchema } from "../common";

export const SkillSchema = BaseEntitySchema.extend({
  name: z.string(),
  description: z.string().optional().nullable(),
});
