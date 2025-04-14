import { Button } from "@/app/ui/components/button/Button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/app/ui/components", () => ({
  DotSpinner: () => <div data-testid="dot-spinner" />,
}));

describe("Button component", () => {
  it("renders children", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click Me");
  });

  it("applies disabled when `disabled` prop is true", () => {
    render(<Button disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables and shows DotSpinner when `loading` is true", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(screen.getByTestId("dot-spinner")).toBeInTheDocument();
    expect(button).not.toHaveTextContent("Loading"); // Spinner replaces content
  });

  it("applies fullWidth class", () => {
    render(<Button fullWidth />);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/button--full-width/);
  });

  it("uses 'primary' as default variant", () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/button--primary/);
  });

  it("uses 'medium' as default size", () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/button--medium/);
  });

  it("uses 'button' as default type", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("allows overriding type prop", () => {
    render(<Button type="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} />);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
