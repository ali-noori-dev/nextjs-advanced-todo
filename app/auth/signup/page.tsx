import { AuthLayout } from "@/app/auth/components";
import { APP_NAME, Routes } from "@/app/lib/constants";
import { SignUpForm } from "@/app/ui/forms";

export default function SignUpPage() {
  return (
    <AuthLayout
      welcomeTitle={`Join ${APP_NAME} Today`}
      welcomeDescription="Create your account and start your productivity journey. Organize, collaborate, and achieve more together."
      formTitle="Create Account"
      formDescription="Get started with your free account"
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref={Routes.Login}
      form={<SignUpForm />}
    />
  );
}
