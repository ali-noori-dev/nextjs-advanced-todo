"use server";

import { LoginState } from "@/app/lib/types";
import { signIn } from "next-auth/react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

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
      const errors: Record<string, string> = {};
      validated.error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      return { values, errors };
    }

    // Authenticate user with NextAuth
    const result = await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      callbackUrl: "/",
      redirect: false,
    });

    if (result?.error) {
      return {
        values,
        errors: { email: "Invalid email or password", password: " " },
      };
    }

    // On success, return empty errors but still include the values
    return { values, errors: {} };
  } catch (error) {
    return {
      values,
      errors: {
        email: "Something went wrong. Please try again.",
        password: " ",
      },
    };
  }
}
