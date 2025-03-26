"use client";

import { signupUser } from "@/app/lib/actions";
import { SignupState } from "@/app/lib/types";
import {
  AuthProviderButtons,
  Button,
  InputField,
  PasswordStrengthTooltip,
  VFlex,
} from "@/app/ui/components";
import { signIn } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";
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

  const { errors, values, success } = state || initialState;

  // Auto sign in after successful signup
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

        <Button type="submit" fullWidth loading={isPending}>
          Create Account
        </Button>
      </form>

      <AuthProviderButtons />
    </VFlex>
  );
}
