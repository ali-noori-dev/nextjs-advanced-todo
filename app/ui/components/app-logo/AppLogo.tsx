import { APP_NAME } from "@/app/lib/constants";
import { Center } from "@/app/ui/components";
import { satisfy } from "@/app/ui/fonts";
import logo from "@/public/tasknest-logo.png";
import Image from "next/image";
import styles from "./app-logo.module.scss";

export function AppLogo() {
  return (
    <Center>
      <Image src={logo} alt={`${APP_NAME} Logo`} width={100} height={100} />

      <h1 className={`${styles["app-logo__title"]} ${satisfy.className}`}>
        {APP_NAME}
      </h1>
    </Center>
  );
}
