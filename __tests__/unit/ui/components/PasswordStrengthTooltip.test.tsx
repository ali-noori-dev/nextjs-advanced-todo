import { PASSWORD_MIN_LENGTH } from "@/app/lib/constants";
import { PasswordStrengthTooltip } from "@/app/ui/components/password-strength-tooltip/PasswordStrengthTooltip";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("PasswordStrengthTooltip", () => {
  it("renders children", () => {
    render(
      <PasswordStrengthTooltip password="">
        <input data-testid="child-input" />
      </PasswordStrengthTooltip>
    );
    expect(screen.getByTestId("child-input")).toBeInTheDocument();
  });

  describe("tooltip visibility", () => {
    const setupTooltipTest = (password: string) => {
      const user = userEvent.setup();
      render(
        <PasswordStrengthTooltip password={password}>
          <input data-testid="child-input" />
        </PasswordStrengthTooltip>
      );

      const input = screen.getByTestId("child-input");
      const tooltip = screen.getByText("It's better to have:");

      return { user, input, tooltip };
    };

    const expectTooltipHidden = (tooltip: HTMLElement) => {
      expect(tooltip.parentElement).not.toHaveClass(
        "password-tooltip__popup--visible"
      );
    };

    const expectTooltipVisible = (tooltip: HTMLElement) => {
      expect(tooltip.parentElement).toHaveClass(
        "password-tooltip__popup--visible"
      );
    };

    it("does not show tooltip on focus when password is empty", async () => {
      const { user, input, tooltip } = setupTooltipTest("");

      expectTooltipHidden(tooltip);
      await user.click(input);
      expectTooltipHidden(tooltip);
    });

    it("shows tooltip on focus and hides on blur", async () => {
      const { user, input, tooltip } = setupTooltipTest("test");

      expectTooltipHidden(tooltip);
      await user.click(input);
      expectTooltipVisible(tooltip);
      await user.tab();
      expectTooltipHidden(tooltip);
    });
  });

  describe("password strength calculation", () => {
    it("shows 'too short' message when password is below minimum length", () => {
      render(
        <PasswordStrengthTooltip password="short">
          <input />
        </PasswordStrengthTooltip>
      );

      expect(
        screen.getByText(`At least ${PASSWORD_MIN_LENGTH} characters`)
      ).toBeInTheDocument();
    });

    it("shows 'weak' when only minimum length is met", () => {
      render(
        <PasswordStrengthTooltip password="weakpassword">
          <input />
        </PasswordStrengthTooltip>
      );

      expect(screen.getByText("Weak Password")).toBeInTheDocument();
    });

    it("shows 'average' when minimum length and 1 criteria are met", () => {
      render(
        <PasswordStrengthTooltip password="AveragePassword">
          <input />
        </PasswordStrengthTooltip>
      );

      expect(screen.getByText("Average Password")).toBeInTheDocument();
    });

    it("shows 'good' when minimum length and 2 criteria are met", () => {
      render(
        <PasswordStrengthTooltip password="Password123">
          <input />
        </PasswordStrengthTooltip>
      );

      expect(screen.getByText("Good Password")).toBeInTheDocument();
    });

    it("shows 'strong' when all criteria are met", () => {
      render(
        <PasswordStrengthTooltip password="StrongPass123#">
          <input />
        </PasswordStrengthTooltip>
      );

      expect(screen.getByText("Strong Password")).toBeInTheDocument();
    });
  });

  describe("strength criteria indicators", () => {
    it("marks criteria as passed when met", async () => {
      const user = userEvent.setup();
      render(
        <PasswordStrengthTooltip password="TestPass123#">
          <input data-testid="child-input" />
        </PasswordStrengthTooltip>
      );

      await user.click(screen.getByTestId("child-input"));

      const mixedCase = screen.getByText("Upper & lower case letters");
      const symbol = screen.getByText("A symbol (#$&)");
      const number = screen.getByText("A number");

      expect(mixedCase).toHaveClass(
        "password-tooltip__popup-list-item--passed"
      );
      expect(symbol).toHaveClass("password-tooltip__popup-list-item--passed");
      expect(number).toHaveClass("password-tooltip__popup-list-item--passed");
    });

    it("shows correct number of filled strength dots", async () => {
      const user = userEvent.setup();
      render(
        <PasswordStrengthTooltip password="TestPass123#">
          <input data-testid="child-input" />
        </PasswordStrengthTooltip>
      );

      await user.click(screen.getByTestId("child-input"));

      const dots = screen
        .getAllByRole("generic")
        .filter((element) =>
          element.className.includes("password-tooltip__popup-bar-dot")
        );

      expect(dots).toHaveLength(4);
      expect(
        dots.filter((dot) =>
          dot.className.includes("password-tooltip__popup-bar-dot--filled")
        )
      ).toHaveLength(4);
    });
  });
});
