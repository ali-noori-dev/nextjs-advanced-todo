import { AUTH_MESSAGES } from "@/app/lib/constants";
import { SignUpForm } from "@/app/ui/forms/signup/SignUpForm";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { useActionState } from "react";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

describe("SignUpForm", () => {
  const mockFormAction = jest.fn();
  const baseState = {
    values: {
      name: "Ali Noori",
      email: "ali@example.com",
      password: "TestPass123",
    },
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

    render(<SignUpForm />);

    // Verify form is rendered with initial empty values
    expect(screen.getByLabelText("Full Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Password")).toHaveValue("");

    // Verify no error messages are shown
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("displays field-specific validation errors", () => {
    const stateWithErrors = {
      ...baseState,
      errors: {
        name: AUTH_MESSAGES.VALIDATION.NAME_REQUIRED,
        email: AUTH_MESSAGES.VALIDATION.EMAIL_INVALID,
        password: AUTH_MESSAGES.VALIDATION.PASSWORD_LENGTH,
      },
    };

    (useActionState as jest.Mock).mockReturnValue([
      stateWithErrors,
      mockFormAction,
      false,
    ]);

    render(<SignUpForm />);

    expect(
      screen.getByText(AUTH_MESSAGES.VALIDATION.NAME_REQUIRED)
    ).toBeInTheDocument();

    expect(
      screen.getByText(AUTH_MESSAGES.VALIDATION.EMAIL_INVALID)
    ).toBeInTheDocument();

    expect(
      screen.getByText(AUTH_MESSAGES.VALIDATION.PASSWORD_LENGTH)
    ).toBeInTheDocument();
  });

  it("updates password field value on change", async () => {
    const user = userEvent.setup();
    (useActionState as jest.Mock).mockReturnValue([
      baseState,
      mockFormAction,
      false,
    ]);

    render(<SignUpForm />);

    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "newpassword123");

    expect(passwordInput).toHaveValue("newpassword123");
  });

  it("disables submit button during loading", () => {
    (useActionState as jest.Mock).mockReturnValue([
      baseState,
      mockFormAction,
      true,
    ]);

    render(<SignUpForm />);
    const button = screen.getByRole("button", { name: "Create Account" });

    expect(button).toBeDisabled();
  });

  it("calls signIn after successful signup", async () => {
    const successState = { ...baseState, success: true };

    (useActionState as jest.Mock).mockReturnValue([
      successState,
      mockFormAction,
      false,
    ]);

    render(<SignUpForm />);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: baseState.values.email,
        password: baseState.values.password,
        callbackUrl: "/",
      });
    });
  });
});
