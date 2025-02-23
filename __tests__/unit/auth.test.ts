import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/auth";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { createMocks } from "node-mocks-http";

// Mock prisma and bcrypt
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock("bcrypt");

describe("Authentication API", () => {
  it("should require both email and password", async () => {
    const testCases = [
      { email: "test@example.com", password: "" },
      { email: "", password: "somePassword" },
      { email: "", password: "" },
    ];

    for (const credentials of testCases) {
      const { req, res } = createMocks({
        method: "POST",
        body: credentials,
      });

      await NextAuth(req, res, authOptions);

      expect(res._getStatusCode()).toBe(401);
    }
  });

  it("should return an error for invalid credentials", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const { req, res } = createMocks({
      method: "POST",
      body: { email: "test@example.com", password: "wrongPass" },
    });

    await NextAuth(req, res, authOptions);

    expect(res._getStatusCode()).toBe(401);
  });

  it("should authenticate a user with valid credentials", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "123",
      email: "test@example.com",
      password: await bcrypt.hash("correctPass", 10),
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { email: "test@example.com", password: "correctPass" },
    });

    await NextAuth(req, res, authOptions);

    expect(res._getStatusCode()).toBe(200);
  });
});
