import { Routes } from "@/app/lib/constants";
import { authConfig } from "@/auth.config";
import { NextRequest } from "next/server";

describe("authConfig", () => {
  it("should define signIn page route", () => {
    expect(authConfig.pages?.signIn).toBe(Routes.Login);
  });

  it("should use JWT session strategy", () => {
    expect(authConfig.session?.strategy).toBe("jwt");
  });

  it("should define a secret", () => {
    expect(authConfig.secret).toBe(process.env.NEXTAUTH_SECRET);
  });

  describe("callbacks.authorized", () => {
    const callback = authConfig.callbacks?.authorized!;

    const createMockRequest = (pathname: string): NextRequest =>
      ({
        nextUrl: { pathname },
      } as unknown as NextRequest);

    it("returns false if unauthenticated user visits home", () => {
      const result = callback({
        auth: null,
        request: createMockRequest("/"),
      });
      expect(result).toBe(false);
    });

    it("returns true if authenticated user visits home", () => {
      const result = callback({
        auth: { user: { id: "1" } } as any,
        request: createMockRequest("/"),
      });
      expect(result).toBe(true);
    });
  });
});
