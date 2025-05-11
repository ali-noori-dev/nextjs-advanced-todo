import { SignUpForm } from "@/app/ui/forms";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

jest.mock("@/app/lib/actions", () => ({
  signupUser: jest.fn(),
}));

describe("SignUpForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => null,
    }));
    (useActionState as jest.Mock).mockReturnValue([null, jest.fn(), false]);
  });

  it("updates password state when typing", async () => {
    render(<SignUpForm />);
    const TEST_PASSWORD = "TestPassword123";
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(passwordInput, TEST_PASSWORD);
    expect(passwordInput).toHaveValue(TEST_PASSWORD);
  });

  it("uses custom callback URL from search params when available", () => {
    const TEST_CALLBACK_URL = "/dashboard";

    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => TEST_CALLBACK_URL,
    }));

    render(<SignUpForm />);
    const redirectInput = screen.getByDisplayValue(TEST_CALLBACK_URL);
    expect(redirectInput).toBeInTheDocument();
  });

  it("uses default callback URL when not provided in search params", () => {
    render(<SignUpForm />);
    const redirectInput = screen.getByDisplayValue("/");
    expect(redirectInput).toBeInTheDocument();
  });

  it("initializes with default state when state is null", () => {
    (useActionState as jest.Mock).mockReturnValue([null, jest.fn(), false]);

    render(<SignUpForm />);

    // Check that form fields have empty initial values
    expect(screen.getByLabelText(/full name/i)).toHaveValue("");
    expect(screen.getByLabelText(/email/i)).toHaveValue("");
    expect(screen.getByLabelText(/password/i)).toHaveValue("");
  });
});
