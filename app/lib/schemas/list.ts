import { z } from "zod";
import { titleSchema } from "./common";

export const createListSchema = z.object({
  title: titleSchema,
});
