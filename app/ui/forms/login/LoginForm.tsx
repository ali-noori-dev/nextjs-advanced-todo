"use client";

import { loginUser } from "@/app/lib/actions";
import { AUTH_MESSAGES, Routes } from "@/app/lib/constants";
import type { LoginState } from "@/app/lib/types";
import {
  AuthProviderButtons,
  Button,
  InputField,
  VFlex,
} from "@/app/ui/components";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
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

  const { errors, values } = state || initialState;

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const errorParam = searchParams.get("error");

  const errorMessage =
    errorParam === "OAuthAccountNotLinked"
      ? AUTH_MESSAGES.ERRORS.OAUTH_ACCOUNT_NOT_LINKED
      : undefined;

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

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

        <input type="hidden" name="redirectTo" value={callbackUrl} />

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
