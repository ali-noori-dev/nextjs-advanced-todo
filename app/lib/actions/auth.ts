"use server";

import { PASSWORD_MIN_LENGTH } from "@/app/lib/constants";
import { prisma } from "@/app/lib/prisma";
import { LoginState, SignupState } from "@/app/lib/types";
import bcrypt from "bcryptjs";
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
    z.string().min(PASSWORD_MIN_LENGTH, {
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    })
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

async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

function handleServerError<T extends { values: any; errors: any }>(
  values: T["values"]
): T {
  return {
    values,
    errors: {
      email: "Something went wrong. Please try again",
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

    const passwordIsCorrect =
      user?.password &&
      (await bcrypt.compare(validation.data.password, user.password));

    if (!passwordIsCorrect) {
      return {
        values,
        errors: { email: "Incorrect email or password", password: " " },
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
        errors: { email: "This email is already registered" },
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
        errors: { email: "Account could not be created. Please try again." },
      };
    }

    // On success, return empty errors and success true
    return { values, errors: {}, success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return handleServerError<SignupState>(values);
  }
}
