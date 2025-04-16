import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export async function withCurrentUser(
  handler: (email: string) => Promise<Response>
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  return handler(session.user.email);
}
