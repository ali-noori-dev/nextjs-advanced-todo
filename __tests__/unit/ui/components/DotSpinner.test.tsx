import { DotSpinner } from "@/app/ui/components/dot-spinner/DotSpinner";
import { render, screen } from "@testing-library/react";

describe("DotSpinner component", () => {
  it("renders with default props", () => {
    render(<DotSpinner />);
    const spinner = screen.getByRole("status");
    const dots = spinner.children;

    expect(spinner).toBeInTheDocument();
    expect(spinner.className).toMatch(/spinner--white/);
    Array.from(dots).forEach((dot) => {
      expect(dot).toHaveClass("spinner__dot--medium");
    });
  });

  it("applies custom size class", () => {
    render(<DotSpinner size="small" />);
    const dots = screen.getByRole("status").children;
    Array.from(dots).forEach((dot) => {
      expect(dot).toHaveClass("spinner__dot--small");
    });
  });

  it("applies custom color class", () => {
    render(<DotSpinner color="primary" />);
    expect(screen.getByRole("status")).toHaveClass("spinner--primary");
  });

  it("applies custom className", () => {
    render(<DotSpinner className="custom-class" />);
    expect(screen.getByRole("status")).toHaveClass("custom-class");
  });

  it("renders three dots", () => {
    render(<DotSpinner />);
    const dots = screen
      .getByRole("status")
      .getElementsByClassName("spinner__dot");
    expect(dots.length).toBe(3);
  });
});
