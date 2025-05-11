import { Routes } from "@/app/lib/constants";
import { AppLogo, Button, Center } from "@/app/ui/components";
import { auth, signOut } from "@/auth";
import Image from "next/image";
import { FaPowerOff } from "react-icons/fa";
import styles from "./header.module.scss";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className={styles.header}>
      <Center gap="32px">
        {user && (
          <Center gap="8px">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name ?? "User Avatar"}
                width={40}
                height={40}
                priority
              />
            )}

            <span className={styles["header__user-fullname"]}>{user.name}</span>
          </Center>
        )}

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: Routes.Login });
          }}
        >
          <Button variant="outlined" size="small" type="submit">
            <FaPowerOff className={styles["header__signout-icon"]} />
            Sign Out
          </Button>
        </form>
      </Center>

      <AppLogo size="sm" />
    </header>
  );
}
