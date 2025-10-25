import { title } from "process";
import { z } from "zod";

export const Jsonb = z.record(z.string(), z.any());

export const ItemSchema = z.object({
  id: z.string().uuid(),
  modality: z.string(),
  difficulty: z.string(),
  bandHint: z.number().int(),
  promptJsonb: Jsonb,
  solutionJsonb: Jsonb.optional(),
  rubricJsonb: Jsonb.optional(),
});

export const ItemsResponseSchema = z.object({
  total: z.number().int().nonnegative(),
  count: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  items: z.array(ItemSchema),
});

export type Item = z.infer<typeof ItemSchema>;
export type ItemsResponse = z.infer<typeof ItemsResponseSchema>;
