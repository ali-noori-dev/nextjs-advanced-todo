import { AUTH_MESSAGES, PASSWORD_MIN_LENGTH } from "@/app/lib/constants";
import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, { message: AUTH_MESSAGES.VALIDATION.EMAIL_REQUIRED })
  // Use .pipe() to run the email format check only if the field is not empty
  .pipe(z.string().email({ message: AUTH_MESSAGES.VALIDATION.EMAIL_INVALID }));

const passwordSchema = z
  .string()
  .min(1, { message: AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED })
  .pipe(
    z.string().min(PASSWORD_MIN_LENGTH, {
      message: AUTH_MESSAGES.VALIDATION.PASSWORD_LENGTH,
    })
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  name: z.string().min(1, { message: AUTH_MESSAGES.VALIDATION.NAME_REQUIRED }),
  email: emailSchema,
  password: passwordSchema,
});
