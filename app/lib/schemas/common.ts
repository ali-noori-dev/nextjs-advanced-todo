import { VALIDATION_MESSAGES } from "@/app/lib/constants/messages";
import { z } from "zod";

export const titleSchema = z
  .string()
  .min(1, { message: VALIDATION_MESSAGES.TITLE_REQUIRED })
  .max(100, { message: VALIDATION_MESSAGES.TITLE_MAX_LENGTH });
