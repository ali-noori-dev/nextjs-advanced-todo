import { AUTH_MESSAGES } from "@/app/lib/constants";
import { LoginForm } from "@/app/ui/forms";
import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import toast from "react-hot-toast";

jest.mock("@/app/lib/actions", () => ({
  loginUser: jest.fn(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => null,
    }));
    (useActionState as jest.Mock).mockReturnValue([null, jest.fn(), false]);
  });

  it("displays error toast when OAuthAccountNotLinked error exists", () => {
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: (param: string) =>
        param === "error" ? "OAuthAccountNotLinked" : null,
    }));

    render(<LoginForm />);
    expect(toast.error).toHaveBeenCalledWith(
      AUTH_MESSAGES.ERRORS.OAUTH_ACCOUNT_NOT_LINKED
    );
  });

  it("uses custom callback URL from search params", () => {
    const TEST_CALLBACK_URL = "/dashboard";
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: (param: string) =>
        param === "callbackUrl" ? TEST_CALLBACK_URL : null,
    }));

    render(<LoginForm />);
    expect(screen.getByDisplayValue(TEST_CALLBACK_URL)).toBeInTheDocument();
  });
});
