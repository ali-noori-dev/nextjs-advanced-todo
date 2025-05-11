import { AUTH_MESSAGES } from "@/app/lib/constants";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function authorizeUser(credentials: {
  email?: string;
  password?: string;
}) {
  if (!credentials?.email || !credentials.password) {
    throw new Error(AUTH_MESSAGES.ERRORS.MISSING_CREDENTIALS);
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user?.password || ""
  );

  if (!user || !isPasswordValid) {
    throw new Error(AUTH_MESSAGES.ERRORS.INCORRECT_CREDENTIALS);
  }

  return user;
}
