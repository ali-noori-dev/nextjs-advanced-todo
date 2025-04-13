import { AuthLayout, AuthLayoutProps } from "@/app/auth/components";
import { render, screen } from "@testing-library/react";

jest.mock("@/app/auth/components/AuthAnimation", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-auth-animation" />,
}));

describe("AuthLayout", () => {
  const defaultProps: AuthLayoutProps = {
    welcomeTitle: "Welcome",
    welcomeDescription: "Join us today",
    formTitle: "Sign In",
    formDescription: "Please fill in your credentials",
    footerText: "Don't have an account?",
    footerLinkText: "Sign Up",
    footerLinkHref: "/auth/signup",
    form: <form data-testid="auth-form" />,
  };

  const setup = () => {
    return render(<AuthLayout {...defaultProps} />);
  };

  describe("rendering", () => {
    beforeEach(() => {
      setup();
    });

    it("displays welcome section correctly", () => {
      expect(screen.getByText(defaultProps.welcomeTitle)).toBeInTheDocument();
      expect(
        screen.getByText(defaultProps.welcomeDescription)
      ).toBeInTheDocument();
    });

    it("displays form section correctly", () => {
      expect(screen.getByText(defaultProps.formTitle)).toBeInTheDocument();
      expect(
        screen.getByText(defaultProps.formDescription)
      ).toBeInTheDocument();
      expect(screen.getByTestId("auth-form")).toBeInTheDocument();
    });

    it("displays footer section correctly", () => {
      expect(screen.getByText(defaultProps.footerText)).toBeInTheDocument();
      const footerLink = screen.getByText(defaultProps.footerLinkText);
      expect(footerLink).toBeInTheDocument();
      expect(footerLink).toHaveAttribute("href", defaultProps.footerLinkHref);
    });
  });
});
