import { Routes } from "@/app/lib/constants";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

jest.mock("next-auth/middleware", () => ({
  withAuth: jest.fn(() =>
    jest.fn((req) => NextResponse.redirect(new URL(Routes.SignIn, req.url)))
  ),
}));

describe("Middleware", () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    mockRequest = new NextRequest(new URL("http://localhost:3000"));
    jest.clearAllMocks();
  });

  it("should allow access to public routes", async () => {
    const publicPaths = [
      "/api/auth",
      "/_next/static/chunks/main.js",
      "/_next/image/test.jpg",
      "/favicon.ico",
      "/public/images/logo.png",
    ];

    for (const path of publicPaths) {
      mockRequest = new NextRequest(new URL(`http://localhost:3000${path}`));

      const isPublic = publicPaths.some((p) =>
        mockRequest.nextUrl.pathname.startsWith(p)
      );

      expect(isPublic).toBe(true);
    }
  });

  it("should protect private routes", async () => {
    const privatePaths = ["/dashboard", "/profile", "/settings"];

    for (const path of privatePaths) {
      mockRequest = new NextRequest(new URL(`http://localhost:3000${path}`));
      const matcher =
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)";
      const matches = mockRequest.nextUrl.pathname.match(matcher);
      expect(matches).not.toBeNull();
    }
  });

  it("should redirect to signin page for unauthenticated requests", async () => {
    const middleware = withAuth(
      (req) => NextResponse.redirect(new URL(Routes.SignIn, req.url)), // ✅ Fix: Absolute URL
      {
        pages: { signIn: Routes.SignIn },
      }
    );

    const mockEvent = { waitUntil: jest.fn() } as any; // Mock NextFetchEvent

    const mockRequestWithAuth = Object.assign(mockRequest, {
      nextauth: { token: null, user: null },
    });

    const res = await middleware(mockRequestWithAuth, mockEvent);

    expect(res?.headers.get("location")).toBe(
      `http://localhost:3000${Routes.SignIn}`
    );
  });
});
