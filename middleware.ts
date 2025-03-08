import { Routes } from "@/app/lib/constants";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    pages: {
      signIn: Routes.Login, // Redirect to login page if not authenticated
    },
  }
);

export const config = {
  matcher: [
    /*
     * Protect all routes except:
     * - API routes (`/api`)
     * - Next.js static files (`/_next/static`)
     * - Image optimization files (`/_next/image`)
     * - Public assets (`/public`, `/favicon.ico`)
     * - Authentication pages (`/auth/signup`, `/auth/login`, `/auth/forgot-password`)
     *
     * This ensures that unauthenticated users can access the sign-up, login,
     * and forgot password pages while protecting other routes.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|auth/signup|auth/login|auth/forgot-password).*)",
  ],
};
