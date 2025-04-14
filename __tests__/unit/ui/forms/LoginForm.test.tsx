import { AUTH_MESSAGES } from "@/app/lib/constants";
import { LoginForm } from "@/app/ui/forms/login/LoginForm";
import { render, screen, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import { useActionState } from "react";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

describe("LoginForm", () => {
  const mockFormAction = jest.fn();
  const baseState = {
    values: { email: "test@example.com", password: "123456" },
    errors: {},
    success: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses initialState when state is undefined", () => {
    (useActionState as jest.Mock).mockReturnValue([
      undefined,
      mockFormAction,
      false,
    ]);

    render(<LoginForm />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("displays validation errors when present", () => {
    const stateWithErrors = {
      ...baseState,
      errors: {
        email: AUTH_MESSAGES.VALIDATION.EMAIL_REQUIRED,
        password: AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED,
      },
    };

    (useActionState as jest.Mock).mockReturnValue([
      stateWithErrors,
      mockFormAction,
      false,
    ]);

    render(<LoginForm />);

    expect(
      screen.getByText(AUTH_MESSAGES.VALIDATION.EMAIL_REQUIRED)
    ).toBeInTheDocument();

    expect(
      screen.getByText(AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED)
    ).toBeInTheDocument();
  });

  it("disables submit button while loading", () => {
    (useActionState as jest.Mock).mockReturnValue([
      baseState,
      mockFormAction,
      true,
    ]);

    render(<LoginForm />);
    const button = screen.getByRole("button", { name: "Log in" });

    expect(button).toBeDisabled();
  });

  it("calls signIn when login is successful", async () => {
    const stateWithSuccess = {
      ...baseState,
      success: true,
    };

    (useActionState as jest.Mock).mockReturnValue([
      stateWithSuccess,
      mockFormAction,
      false,
    ]);

    render(<LoginForm />);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: baseState.values.email,
        password: baseState.values.password,
        callbackUrl: "/",
      });
    });
  });
});
