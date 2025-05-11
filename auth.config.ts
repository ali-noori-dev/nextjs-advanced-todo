import { Routes } from "@/app/lib/constants";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: Routes.Login,
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isHome = nextUrl.pathname === "/";
      if (isHome && !auth?.user) {
        return false; // will redirect to login
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
