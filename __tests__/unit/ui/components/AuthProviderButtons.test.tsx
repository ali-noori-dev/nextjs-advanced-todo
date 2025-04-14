import { AuthProviderButtons } from "@/app/ui/components";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("AuthProviderButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls signIn with 'google' when Google button is clicked", async () => {
    const user = userEvent.setup();
    render(<AuthProviderButtons />);

    const googleButton = screen.getByRole("button", {
      name: /continue with google/i,
    });
    await user.click(googleButton);

    expect(signIn).toHaveBeenCalledWith("google", { callbackUrl: "/" });
  });

  it("calls signIn with 'github' when GitHub button is clicked", async () => {
    const user = userEvent.setup();
    render(<AuthProviderButtons />);

    const githubButton = screen.getByRole("button", {
      name: /continue with github/i,
    });
    await user.click(githubButton);

    expect(signIn).toHaveBeenCalledWith("github", { callbackUrl: "/" });
  });
});
