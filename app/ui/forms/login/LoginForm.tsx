"use client";

import { Routes } from "@/app/lib/constants";
import {
  AuthProviderButtons,
  Button,
  InputField,
  VFlex,
} from "@/app/ui/components";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import styles from "./login-form.module.scss";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { email, password, callbackUrl: "/" });
  };

  return (
    <VFlex className={styles["login-form__wrapper"]}>
      <form onSubmit={handleSubmit} className={styles["login-form"]}>
        <InputField
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />

        <InputField
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <Link
          href={Routes.ForgotPassword}
          className={styles["login-form__forget"]}
        >
          Forgot password?
        </Link>

        <Button type="submit" fullWidth>
          Log in
        </Button>
      </form>

      <AuthProviderButtons />
    </VFlex>
  );
}
