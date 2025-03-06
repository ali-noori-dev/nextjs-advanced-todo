"use client";

import { Routes } from "@/app/lib/constants";
import { Button, Center, Flex, InputField, VFlex } from "@/app/ui/components";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
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

      <Center className={styles["login-form__or-container"]}>
        <span className={styles["login-form__or"]}>OR</span>
      </Center>

      <Flex className={styles["login-form__social-providers"]}>
        <Button
          className={styles["login-form__provider-button"]}
          onClick={() => signIn("google")}
          fullWidth
        >
          <FcGoogle size={18} />
          Continue with Google
        </Button>

        <Button
          className={styles["login-form__provider-button"]}
          onClick={() => signIn("github")}
          fullWidth
        >
          <FaGithub size={18} />
          Continue with GitHub
        </Button>
      </Flex>
    </VFlex>
  );
}
