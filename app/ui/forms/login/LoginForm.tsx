"use client";

import { loginUser } from "@/app/lib/actions";
import { Routes } from "@/app/lib/constants";
import type { LoginState } from "@/app/lib/types";
import {
  AuthProviderButtons,
  Button,
  InputField,
  VFlex,
} from "@/app/ui/components";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import styles from "./login-form.module.scss";

const initialState: LoginState = {
  errors: {},
  values: { email: "", password: "" },
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState
  );

  const { errors, values, success } = state || initialState;

  // Auto sign in after successful login
  useEffect(() => {
    if (success) {
      signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/",
      });
    }
  }, [success]);

  return (
    <VFlex className={styles["login-form__wrapper"]}>
      <form action={formAction} className={styles["login-form"]} noValidate>
        <InputField
          label="Email"
          placeholder="Enter your email"
          name="email"
          type="email"
          autoComplete="username"
          error={!!errors.email}
          helperText={errors.email}
          defaultValue={values.email}
        />

        <InputField
          label="Password"
          placeholder="Enter your password"
          name="password"
          type="password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password}
          defaultValue={values.password}
        />

        <Link
          href={Routes.ForgotPassword}
          className={styles["login-form__forget"]}
        >
          Forgot password?
        </Link>

        <Button type="submit" aria-label="Log in" fullWidth loading={isPending}>
          Log in
        </Button>
      </form>

      <AuthProviderButtons />
    </VFlex>
  );
}
