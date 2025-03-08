"use client";

import {
  AuthProviderButtons,
  Button,
  InputField,
  VFlex,
} from "@/app/ui/components";
import { signIn } from "next-auth/react";
import { useState } from "react";
import styles from "./signup-form.module.scss";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { email, password, callbackUrl: "/" });
  };

  return (
    <VFlex className={styles["signup-form__wrapper"]}>
      <form onSubmit={handleSubmit} className={styles["signup-form"]}>
        <InputField
          label="Full Name"
          placeholder="Enter your full name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />

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
          placeholder="Create a password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />

        <Button type="submit" fullWidth>
          Create Account
        </Button>
      </form>

      <AuthProviderButtons />
    </VFlex>
  );
}
