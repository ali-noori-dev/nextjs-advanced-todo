import { authorizeUser } from "@/app/lib/auth";
import { AUTH_MESSAGES } from "@/app/lib/constants";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

jest.mock("@/app/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("authorizeUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws an error if credentials object is undefined", async () => {
    // @ts-expect-error - intentionally testing undefined case
    await expect(authorizeUser(undefined)).rejects.toThrow(
      AUTH_MESSAGES.ERRORS.MISSING_CREDENTIALS
    );
  });

  it("throws an error if email or password is missing", async () => {
    await expect(authorizeUser({ email: "", password: "" })).rejects.toThrow(
      AUTH_MESSAGES.ERRORS.MISSING_CREDENTIALS
    );
    await expect(authorizeUser({ email: "test@example.com" })).rejects.toThrow(
      AUTH_MESSAGES.ERRORS.MISSING_CREDENTIALS
    );
  });

  it("throws an error if user is not found", async () => {
    (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    await expect(
      authorizeUser({ email: "nonexistent@example.com", password: "pass123" })
    ).rejects.toThrow(AUTH_MESSAGES.ERRORS.INCORRECT_CREDENTIALS);
  });

  it("throws an error if password is incorrect", async () => {
    (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      email: "test@example.com",
      password: "hashedpassword",
    });
    (mockedBcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(
      authorizeUser({ email: "test@example.com", password: "wrongPass" })
    ).rejects.toThrow(AUTH_MESSAGES.ERRORS.INCORRECT_CREDENTIALS);
  });

  it("returns user if credentials are valid", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      password: "hashedpassword",
    };
    (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);
    (mockedBcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    const result = await authorizeUser({
      email: "test@example.com",
      password: "validPass",
    });
    expect(result).toEqual(mockUser);
  });
});
