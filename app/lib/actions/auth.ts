"use server";

import { AUTH_MESSAGES } from "@/app/lib/constants";
import { prisma } from "@/app/lib/prisma";
import { loginSchema, signupSchema } from "@/app/lib/schemas";
import type { LoginState, SignupState } from "@/app/lib/types";
import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";

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
    const validated = loginSchema.safeParse(values);

    if (!validated.success) {
      return { values, errors: handleValidationError(validated.error) };
    }

    const user = await findUserByEmail(validated.data.email);

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
      (await bcrypt.compare(validated.data.password, user.password));

    if (!passwordIsCorrect) {
      return {
        values,
        errors: {
          email: AUTH_MESSAGES.ERRORS.INCORRECT_CREDENTIALS,
          password: " ",
        },
      };
    }

    await signIn("credentials", formData);

    return { values, errors: {} };
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("Login error:", error);
      return handleServerError<LoginState>(values);
    }
    throw error;
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

    await signIn("credentials", formData);

    return { values, errors: {} };
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("Signup error:", error);
      return handleServerError<SignupState>(values);
    }
    throw error;
  }
}
