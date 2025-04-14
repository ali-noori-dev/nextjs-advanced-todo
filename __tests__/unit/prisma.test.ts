import type { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

jest.mock("@prisma/client", () => {
  const Actual = jest.requireActual("@prisma/client");
  return {
    ...Actual,
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    })),
  };
});

describe("prisma.ts", () => {
  const originalEnv = process.env;

  const setNodeEnv = (value: "development" | "production" | "test") => {
    (process.env as typeof process.env & { NODE_ENV: string }).NODE_ENV = value;
  };

  beforeEach(() => {
    jest.resetModules(); // Clear module cache
    process.env = { ...originalEnv }; // Reset env
    (globalThis as any).prisma = undefined; // Reset singleton
  });

  afterAll(() => {
    process.env = originalEnv;
    (globalThis as any).prisma = undefined;
  });

  it("creates a PrismaClient instance if not already defined", async () => {
    setNodeEnv("development");

    const { prisma } = await import("@/app/lib/prisma");

    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe("function");
  });

  it("uses existing global PrismaClient if defined", async () => {
    setNodeEnv("development");

    const mockInstance = { mocked: true };
    globalThis.prisma = mockInstance as any;

    const { prisma } = await import("@/app/lib/prisma");

    expect(prisma).toBe(mockInstance);
  });

  it("reuses existing PrismaClient in development", async () => {
    setNodeEnv("development");

    const { prisma: first } = await import("@/app/lib/prisma");
    const { prisma: second } = await import("@/app/lib/prisma");

    expect(first).toBe(second);
  });

  it("does not assign prisma to global in production", async () => {
    setNodeEnv("production");

    const { prisma } = await import("@/app/lib/prisma");

    expect(prisma).toBeDefined();
    expect(globalThis.prisma).toBeUndefined(); // Should not persist in global
  });
});
