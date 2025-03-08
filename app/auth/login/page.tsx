import { APP_NAME, Routes } from "@/app/lib/constants";
import { LoginForm } from "@/app/ui/forms";
import { AuthLayout } from "../components/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout
      welcomeTitle={`Welcome to ${APP_NAME}`}
      welcomeDescription="Start managing your tasks effortlessly. Stay productive, stay organized, and achieve your goals."
      formTitle="Log in"
      formDescription="Welcome back! Please enter your details"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref={Routes.SignUp}
      form={<LoginForm />}
    />
  );
}
