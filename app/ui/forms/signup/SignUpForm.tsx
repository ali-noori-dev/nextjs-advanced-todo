"use client";

import { signupUser } from "@/app/lib/actions";
import type { SignupState } from "@/app/lib/types";
import {
  AuthProviderButtons,
  Button,
  InputField,
  PasswordStrengthTooltip,
  VFlex,
} from "@/app/ui/components";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import styles from "./signup-form.module.scss";

const initialState: SignupState = {
  errors: {},
  values: { name: "", email: "", password: "" },
};

export function SignUpForm() {
  const [password, setPassword] = useState("");

  const [state, formAction, isPending] = useActionState(
    signupUser,
    initialState
  );

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const { errors, values } = state || initialState;

  return (
    <VFlex className={styles["signup-form__wrapper"]}>
      <form action={formAction} className={styles["signup-form"]} noValidate>
        <InputField
          label="Full Name"
          placeholder="Enter your full name"
          name="name"
          autoComplete="name"
          error={!!errors.name}
          helperText={errors.name}
          defaultValue={values.name}
        />

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

        <PasswordStrengthTooltip password={password}>
          <InputField
            label="Password"
            placeholder="Create a password"
            name="password"
            type="password"
            autoComplete="password"
            error={!!errors.password}
            helperText={errors.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </PasswordStrengthTooltip>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <Button
          type="submit"
          aria-label="Create Account"
          fullWidth
          loading={isPending}
        >
          Create Account
        </Button>
      </form>

      <AuthProviderButtons />
    </VFlex>
  );
}
