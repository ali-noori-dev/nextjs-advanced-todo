import { Routes } from "@/app/lib/constants";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type AuthMode = "client" | "server";

async function withCurrentUser<T = Response>(
  handler: (email: string) => Promise<T>,
  options?: { mode?: AuthMode }
): Promise<T | Response> {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    if (options?.mode === "client") {
      return new Response("Unauthorized", { status: 401 });
    } else {
      redirect(Routes.Login);
    }
  }

  return handler(userEmail);
}

export async function withCurrentUserAPI(
  handler: (email: string) => Promise<Response>
) {
  return withCurrentUser(handler, { mode: "client" });
}

export async function withCurrentUserPage<T>(
  handler: (email: string) => Promise<T>
): Promise<T> {
  const result = await withCurrentUser<T>(handler, { mode: "server" });

  return result as T;
}
