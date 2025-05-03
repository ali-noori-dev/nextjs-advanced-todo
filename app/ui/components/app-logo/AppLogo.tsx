import { APP_NAME } from "@/app/lib/constants";
import { Center } from "@/app/ui/components";
import { satisfy } from "@/app/ui/fonts";
import Image from "next/image";
import logo from "../../../../public/tasknest-logo.png";
import styles from "./app-logo.module.scss";

interface AppLogoProps {
  size?: "sm" | "md";
}

export function AppLogo({ size = "md" }: AppLogoProps) {
  const imageSize = {
    sm: 60,
    md: 100,
  }[size];

  return (
    <Center>
      <Image
        src={logo}
        alt={`${APP_NAME} Logo`}
        width={imageSize}
        height={imageSize}
      />

      <h1
        className={`
        ${styles["app-logo__title"]} 
        ${styles[`app-logo__title--${size}`]} 
        ${satisfy.className}
      `}
      >
        {APP_NAME}
      </h1>
    </Center>
  );
}
