import { Routes } from "@/app/lib/constants";
import { Center } from "@/app/ui/components";
import { LoginForm } from "@/app/ui/forms";
import Link from "next/link";
import styles from "./login.module.scss";
import LottieAnimation from "./LottieAnimation";

const WelcomeSection = () => (
  <div className={styles["login-page__welcome-section"]}>
    <Center className={styles["login-page__welcome-content"]}>
      <h2>Welcome to TaskNest</h2>
      <p>Start managing your tasks effortlessly.</p>
      <p>Stay productive, stay organized, and achieve your goals.</p>
    </Center>

    <div className={styles["login-page__animation"]}>
      <LottieAnimation />
    </div>
  </div>
);

const FormSection = () => (
  <Center className={styles["login-page__form-section"]}>
    <div className={styles["login-page__card"]}>
      <h2 className={styles["login-page__title"]}>Log in</h2>

      <p className={styles["login-page__text"]}>
        Welcome back! Please enter your details
      </p>

      <LoginForm />

      <p className={styles["login-page__footer"]}>
        Don't have an account?{" "}
        <Link
          className={styles["login-page__footer-link"]}
          href={Routes.SignUp}
        >
          Sign up
        </Link>
      </p>
    </div>
  </Center>
);

export default function LoginPage() {
  return (
    <main className={styles["login-page"]}>
      <FormSection />
      <WelcomeSection />
    </main>
  );
}
