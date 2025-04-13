import { AppLogo, VCenter } from "@/app/ui/components";
import Link from "next/link";
import AuthAnimation from "../AuthAnimation";
import styles from "./auth-layout.module.scss";

interface AuthLayoutProps {
  welcomeTitle: string;
  welcomeDescription: string;
  formTitle: string;
  formDescription: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  form: React.ReactNode;
}

export function AuthLayout({
  welcomeTitle,
  welcomeDescription,
  formTitle,
  formDescription,
  footerText,
  footerLinkText,
  footerLinkHref,
  form,
}: AuthLayoutProps) {
  function WelcomeSection() {
    return (
      <div className={styles["auth-layout__welcome-section"]}>
        <VCenter className={styles["auth-layout__welcome-content"]}>
          <h2>{welcomeTitle}</h2>
          <p>{welcomeDescription}</p>
        </VCenter>

        <div className={styles["auth-layout__animation"]}>
          <AuthAnimation />
        </div>
      </div>
    );
  }

  function FormSection() {
    return (
      <VCenter className={styles["auth-layout__form-section"]}>
        <AppLogo />

        <div className={styles["auth-layout__card"]}>
          <h2 className={styles["auth-layout__title"]}>{formTitle}</h2>
          <p className={styles["auth-layout__description"]}>
            {formDescription}
          </p>
          {form}
        </div>

        <p className={styles["auth-layout__footer"]}>
          {footerText}{" "}
          <Link
            className={styles["auth-layout__footer-link"]}
            href={footerLinkHref}
          >
            {footerLinkText}
          </Link>
        </p>
      </VCenter>
    );
  }

  return (
    <main className={styles["auth-layout"]}>
      <FormSection />
      <WelcomeSection />
    </main>
  );
}
