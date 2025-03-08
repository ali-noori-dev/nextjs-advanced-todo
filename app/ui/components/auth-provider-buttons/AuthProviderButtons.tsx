import { Button, Center, Flex } from "@/app/ui/components";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import styles from "./auth-provider-buttons.module.scss";

export function AuthProviderButtons() {
  return (
    <>
      <Center className={styles["auth-providers__or-container"]}>
        <span className={styles["auth-providers__or"]}>OR</span>
      </Center>

      <Flex className={`${styles["auth-providers__container"]}`}>
        <Button
          className={styles["auth-providers__button"]}
          onClick={() => signIn("google")}
          fullWidth
        >
          <FcGoogle size={18} />
          Continue with Google
        </Button>

        <Button
          className={styles["auth-providers__button"]}
          onClick={() => signIn("github")}
          fullWidth
        >
          <FaGithub size={18} />
          Continue with GitHub
        </Button>
      </Flex>
    </>
  );
}
