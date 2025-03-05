"use client";

import { InputField } from "@/app/ui/components";
import { signIn } from "next-auth/react";
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
    <div>
      <form onSubmit={handleSubmit} className={styles["login-form"]}>
        <InputField
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className={styles["login-form__remember"]}>
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember for 30 days</label>

          <a href="#" className={styles["login-form__remember-link"]}>
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className={`${styles["login-form__button"]} ${styles["login-form__button--login"]}`}
        >
          Log in
        </button>
      </form>

      <div className={styles["login-form__or"]}>OR</div>

      <button
        className={`${styles["login-form__button"]} ${styles["login-form__button--google"]}`}
        onClick={() => signIn("google")}
      >
        Continue with Google
      </button>

      <button
        className={`${styles["login-form__button"]} ${styles["login-form__button--github"]}`}
        onClick={() => signIn("github")}
      >
        Continue with GitHub
      </button>
    </div>
  );
}
