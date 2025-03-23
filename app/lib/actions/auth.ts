"use server";

import { prisma } from "@/app/lib/prisma";
import { LoginState, SignupState } from "@/app/lib/types";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";
import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, { message: "Please enter your email address" })
  // Use .pipe() to run the email format check only if the field is not empty
  .pipe(z.string().email({ message: "Please enter a valid email address" }));

const passwordSchema = z
  .string()
  .min(1, { message: "Please enter your password" })
  .pipe(
    z.string().min(8, { message: "Password must be at least 8 characters" })
  );

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const signupSchema = z.object({
  name: z.string().min(1, { message: "Please enter your full name" }),
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

    // Authenticate user with NextAuth
    const result = await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      callbackUrl: "/",
    });

    if (result?.error) {
      return {
        values,
        errors: { email: result.error, password: " " },
      };
    }

    // On success, return empty errors but still include the values
    return { values, errors: {} };
  } catch (error) {
    return {
      values,
      errors: {
        email: "Something went wrong. Please try again",
        password: " ",
      },
    };
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

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.data.email },
    });

    if (existingUser) {
      return {
        values,
        errors: { email: "This email is already registered" },
      };
    }

    const hashedPassword = await bcrypt.hash(validated.data.password, 10);

    await prisma.user.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        password: hashedPassword,
      },
    });

    // On success, return empty errors and success true
    return { values, errors: {}, success: true };
  } catch (error) {
    return {
      values,
      errors: {
        email: "Something went wrong. Please try again",
        password: " ",
      },
    };
  }
}
