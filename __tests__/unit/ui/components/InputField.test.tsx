import { InputField } from "@/app/ui/components/input-field/InputField";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("react-icons/fa", () => ({
  FaEye: () => <div data-testid="eye-icon" />,
  FaEyeSlash: () => <div data-testid="eye-slash-icon" />,
}));

describe("InputField component", () => {
  it("renders with default props", () => {
    render(<InputField />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("placeholder", " ");
  });

  it("renders with label", () => {
    render(<InputField label="Username" />);
    const input = screen.getByRole("textbox");
    const label = screen.getByText("Username");

    expect(input).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", input.id);
  });

  it("renders helper text when provided", () => {
    const helperText = "This is a hint";
    render(<InputField helperText={helperText} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<InputField disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("applies error styles when error prop is true", () => {
    render(<InputField error />);
    const container = screen.getByRole("textbox").parentElement?.parentElement;
    expect(container).toHaveClass("input--error");
  });

  it("applies full width class when fullWidth prop is true", () => {
    render(<InputField fullWidth />);
    const container = screen.getByRole("textbox").parentElement?.parentElement;
    expect(container).toHaveClass("input--full-width");
  });

  describe("password field behavior", () => {
    it("toggles password visibility", async () => {
      const user = userEvent.setup();
      render(<InputField type="password" label="Password" />);
      const input = screen.getByLabelText("Password");
      const toggleButton = screen.getByRole("button");

      expect(input).toHaveAttribute("type", "password");
      expect(screen.getByTestId("eye-icon")).toBeInTheDocument();

      await user.click(toggleButton);

      expect(input).toHaveAttribute("type", "text");
      expect(screen.getByTestId("eye-slash-icon")).toBeInTheDocument();
    });
  });
});
