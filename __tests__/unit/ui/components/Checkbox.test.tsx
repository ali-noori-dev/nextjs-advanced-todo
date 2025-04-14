import { Checkbox } from "@/app/ui/components/checkbox/Checkbox";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Checkbox component", () => {
  const defaultProps = {
    label: "Test Checkbox",
    checked: false,
    onChange: jest.fn(),
  };

  it("renders with label", () => {
    render(<Checkbox {...defaultProps} />);
    expect(screen.getByLabelText("Test Checkbox")).toBeInTheDocument();
  });

  it("reflects checked state", () => {
    render(<Checkbox {...defaultProps} checked={true} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("handles change events", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<Checkbox {...defaultProps} onChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("can be disabled", () => {
    render(<Checkbox {...defaultProps} disabled={true} />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("applies disabled class when disabled", () => {
    render(<Checkbox {...defaultProps} disabled={true} />);
    const label = screen.getByText("Test Checkbox").parentElement;
    expect(label).toHaveClass("checkbox--disabled");
  });
});
