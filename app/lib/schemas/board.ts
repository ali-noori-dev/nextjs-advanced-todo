import { VALIDATION_MESSAGES } from "@/app/lib/constants";
import { z } from "zod";

export const createListSchema = z.object({
  title: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.TITLE_REQUIRED })
    .max(100, { message: VALIDATION_MESSAGES.TITLE_MAX_LENGTH }),
});

export const createCardSchema = z.object({
  title: z.string().min(1, { message: VALIDATION_MESSAGES.TITLE_REQUIRED }),
});
