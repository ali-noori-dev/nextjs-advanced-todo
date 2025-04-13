"use server";

import { AUTH_MESSAGES, PASSWORD_MIN_LENGTH } from "@/app/lib/constants";
import { prisma } from "@/app/lib/prisma";
import { LoginState, SignupState } from "@/app/lib/types";
import bcrypt from "bcryptjs";
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

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const signupSchema = z.object({
  name: z.string().min(1, { message: AUTH_MESSAGES.VALIDATION.NAME_REQUIRED }),
  email: emailSchema,
  password: passwordSchema,
});

function handleValidationError(error: z.ZodError) {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    errors[err.path[0]] = err.message;
  });
  return errors;
}

async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

function handleServerError<T extends { values: any; errors: any }>(
  values: T["values"]
): T {
  return {
    values,
    errors: {
      email: AUTH_MESSAGES.ERRORS.SERVER_ERROR,
      password: " ",
    },
  } as T;
}

export async function loginUser(
  prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const values = {
    email: (formData.get("email") as string) || "",
    password: (formData.get("password") as string) || "",
  };

  try {
    const validation = loginSchema.safeParse(values);

    if (!validation.success) {
      return { values, errors: handleValidationError(validation.error) };
    }

    const user = await findUserByEmail(validation.data.email);

    if (user && !user.password) {
      const account = await prisma.account.findFirst({
        where: { userId: user.id },
      });

      const providerLabels: Record<string, string> = {
        google: "Google",
        github: "GitHub",
      };

      const providerLabel =
        providerLabels[account?.provider ?? ""] || "an external provider";

      return {
        values,
        errors: {
          email: AUTH_MESSAGES.ERRORS.OAUTH_LOGIN(providerLabel),
          password: " ",
        },
      };
    }

    const passwordIsCorrect =
      user?.password &&
      (await bcrypt.compare(validation.data.password, user.password));

    if (!passwordIsCorrect) {
      return {
        values,
        errors: {
          email: AUTH_MESSAGES.ERRORS.INCORRECT_CREDENTIALS,
          password: " ",
        },
      };
    }

    // On success, return empty errors and success true
    return { values, errors: {}, success: true };
  } catch (error) {
    console.error("Login error:", error);
    return handleServerError<LoginState>(values);
  }
}

export async function signupUser(
  prevState: SignupState | undefined,
  formData: FormData
): Promise<SignupState> {
  const values = {
    name: (formData.get("name") as string) || "",
    email: (formData.get("email") as string) || "",
    password: (formData.get("password") as string) || "",
  };

  try {
    const validated = signupSchema.safeParse(values);

    if (!validated.success) {
      return { values, errors: handleValidationError(validated.error) };
    }

    const existingUser = await findUserByEmail(validated.data.email);

    if (existingUser) {
      return {
        values,
        errors: { email: AUTH_MESSAGES.ERRORS.EMAIL_EXISTS, password: " " },
      };
    }

    const hashedPassword = await bcrypt.hash(validated.data.password, 10);

    const createdUser = await prisma.user.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        password: hashedPassword,
      },
    });

    if (!createdUser) {
      return {
        values,
        errors: {
          email: AUTH_MESSAGES.ERRORS.ACCOUNT_CREATE_FAILED,
          password: " ",
        },
      };
    }

    // On success, return empty errors and success true
    return { values, errors: {}, success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return handleServerError<SignupState>(values);
  }
}
