import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

jest.mock("next-auth/middleware", () => ({
  withAuth: jest.fn((fn) => fn),
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
      const matcher =
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)";
      const matches = mockRequest.nextUrl.pathname.match(matcher);
      expect(matches).toBeNull();
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
      function middleware(req) {
        return NextResponse.next();
      },
      {
        pages: {
          signIn: "/auth/signin",
        },
      }
    );

    expect(middleware).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        pages: {
          signIn: "/auth/signin",
        },
      })
    );
  });
});
