import { loginUser, signupUser } from "@/app/lib/actions";
import { AUTH_MESSAGES } from "@/app/lib/constants";
import { prisma } from "@/app/lib/prisma";
import type { User } from "@prisma/client";
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

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    auth: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    handlers: jest.fn(),
  })),
}));

jest.mock("next-auth/providers/credentials", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    authorize: jest.fn(),
  })),
}));

jest.mock("next-auth/providers/github", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    id: "github",
    name: "GitHub",
    type: "oauth",
  })),
}));

jest.mock("next-auth/providers/google", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    id: "google",
    name: "Google",
    type: "oauth",
  })),
}));

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
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

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

    it("returns error for password shorter than minimum length", async () => {
      const res = await loginUser(
        undefined,
        createFormData({
          email: "test@example.com",
          password: "short",
        })
      );

      expect(res.errors.password).toBe(
        AUTH_MESSAGES.VALIDATION.PASSWORD_LENGTH
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

    it("handles OAuth users with different providers", async () => {
      const testCases = [
        {
          provider: "google",
          expectedLabel: "Google",
        },
        {
          provider: "github",
          expectedLabel: "GitHub",
        },
        {
          provider: "unknown",
          expectedLabel: "an external provider",
        },
        {
          provider: null,
          expectedLabel: "an external provider",
        },
      ];

      for (const { provider, expectedLabel } of testCases) {
        // Mock user without password (OAuth user)
        (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
          ...TEST_USER,
          password: null,
        });

        // Mock account with different providers
        (mockedPrisma.account.findFirst as jest.Mock).mockResolvedValueOnce(
          provider
            ? {
                provider,
                type: "oauth",
                userId: TEST_USER.id,
              }
            : null
        );

        const testValues = {
          email: "test@example.com",
          password: "password123",
        };
        const res = await loginUser(undefined, createFormData(testValues));

        expect(res).toEqual({
          values: testValues,
          errors: {
            email: AUTH_MESSAGES.ERRORS.OAUTH_LOGIN(expectedLabel),
            password: " ",
          },
        });

        // Clear mocks for next iteration
        (mockedPrisma.user.findUnique as jest.Mock).mockClear();
        (mockedPrisma.account.findFirst as jest.Mock).mockClear();
      }
    });

    it("returns success on valid credentials", async () => {
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(
        TEST_USER
      );

      (mockedBcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const res = await loginUser(undefined, createFormData(TEST_USER as any));

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

    it("returns error for password shorter than minimum length", async () => {
      const res = await signupUser(
        undefined,
        createFormData({
          name: "John Doe",
          email: "test@example.com",
          password: "short",
        })
      );

      expect(res.errors.password).toBe(
        AUTH_MESSAGES.VALIDATION.PASSWORD_LENGTH
      );
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

    it("handles account creation failure", async () => {
      // Mock that user doesn't exist yet
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      // Mock create to return null (failure case)
      (mockedPrisma.user.create as jest.Mock).mockResolvedValueOnce(null);
      // Mock password hashing
      (mockedBcrypt.hash as jest.Mock).mockResolvedValueOnce("hashedPassword");

      const testValues = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const res = await signupUser(undefined, createFormData(testValues));

      expect(res).toEqual({
        values: testValues,
        errors: {
          email: AUTH_MESSAGES.ERRORS.ACCOUNT_CREATE_FAILED,
          password: " ",
        },
      });
      expect(mockedPrisma.user.create).toHaveBeenCalled();
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

      expect(res.errors).toEqual({});
    });
  });
});
