import { loginUser, signupUser } from "@/app/lib/actions";
import { AUTH_MESSAGES } from "@/app/lib/constants";
import { prisma } from "@/app/lib/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

jest.mock("@/app/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    account: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs");

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

const TEST_USER: Partial<User> = {
  id: "1",
  email: "test@example.com",
  password: "hashedpass",
};

const createFormData = (data: Record<string, string>): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};

describe("auth actions", () => {
  describe("loginUser", () => {
    it("returns validation error for empty fields", async () => {
      const res = await loginUser(
        undefined,
        createFormData({ email: "", password: "" })
      );

      expect(res.errors.email).toBe(AUTH_MESSAGES.VALIDATION.EMAIL_REQUIRED);
      expect(res.errors.password).toBe(
        AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED
      );
    });

    it("returns error if user does not exist", async () => {
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const res = await loginUser(
        undefined,
        createFormData({
          email: "nonexistent@example.com",
          password: "password123",
        })
      );

      expect(res.errors.email).toBe(AUTH_MESSAGES.ERRORS.INCORRECT_CREDENTIALS);
    });

    it("returns error if user has no password (OAuth account)", async () => {
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        ...TEST_USER,
        password: null,
      });

      (mockedPrisma.account.findFirst as jest.Mock).mockResolvedValueOnce({
        provider: "google",
      });

      const res = await loginUser(undefined, createFormData(TEST_USER as any));

      expect(res.errors.email).toMatch(/created using Google/);
    });

    it("returns success on valid credentials", async () => {
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(
        TEST_USER
      );

      (mockedBcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const res = await loginUser(undefined, createFormData(TEST_USER as any));

      expect(res.success).toBe(true);
      expect(res.errors).toEqual({});
    });
  });

  describe("signupUser", () => {
    it("returns validation error for empty fields", async () => {
      const res = await signupUser(
        undefined,
        createFormData({
          name: "",
          email: "",
          password: "",
        })
      );

      expect(res.errors).toEqual({
        name: AUTH_MESSAGES.VALIDATION.NAME_REQUIRED,
        email: AUTH_MESSAGES.VALIDATION.EMAIL_REQUIRED,
        password: AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED,
      });
    });

    it("returns error if user already exists", async () => {
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(
        TEST_USER
      );

      const res = await signupUser(
        undefined,
        createFormData({
          name: "John Doe",
          email: "existing@example.com",
          password: "password123",
        })
      );

      expect(res.errors.email).toBe(AUTH_MESSAGES.ERRORS.EMAIL_EXISTS);
    });

    it("returns success on valid signup", async () => {
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (mockedBcrypt.hash as jest.Mock).mockResolvedValueOnce("hashedPassword");

      (mockedPrisma.user.create as jest.Mock).mockResolvedValueOnce({
        id: "2",
      });

      const res = await signupUser(
        undefined,
        createFormData({
          name: "John Doe",
          email: "new@example.com",
          password: "password123",
        })
      );

      expect(res.success).toBe(true);
      expect(res.errors).toEqual({});
    });
  });
});
