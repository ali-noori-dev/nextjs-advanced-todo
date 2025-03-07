import { APP_NAME, Routes } from "@/app/lib/constants";
import { AppLogo, VCenter } from "@/app/ui/components";
import { LoginForm } from "@/app/ui/forms";
import Link from "next/link";
import styles from "./login.module.scss";
import LottieAnimation from "./LottieAnimation";

const WelcomeSection = () => (
  <div className={styles["login-page__welcome-section"]}>
    <VCenter className={styles["login-page__welcome-content"]}>
      <h2>{`Welcome to ${APP_NAME}`}</h2>
      <p>Start managing your tasks effortlessly.</p>
      <p>Stay productive, stay organized, and achieve your goals.</p>
    </VCenter>

    <div className={styles["login-page__animation"]}>
      <LottieAnimation />
    </div>
  </div>
);

const FormSection = () => (
  <VCenter className={styles["login-page__form-section"]}>
    <AppLogo />

    <div className={styles["login-page__card"]}>
      <h2 className={styles["login-page__title"]}>Log in</h2>

      <p className={styles["login-page__text"]}>
        Welcome back! Please enter your details
      </p>

      <LoginForm />
    </div>

    <p className={styles["login-page__footer"]}>
      Don't have an account?{" "}
      <Link className={styles["login-page__footer-link"]} href={Routes.SignUp}>
        Sign up
      </Link>
    </p>
  </VCenter>
);

export default function LoginPage() {
  return (
    <main className={styles["login-page"]}>
      <FormSection />
      <WelcomeSection />
    </main>
  );
}
