import { z } from "zod";
import { titleSchema } from "./common";

export const createCardSchema = z.object({
  listId: z.string().uuid(),
  title: titleSchema,
  description: z.string().optional(),
});
