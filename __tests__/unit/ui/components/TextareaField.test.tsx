import { TextareaField } from "@/app/ui/components";
import { fireEvent, render, screen } from "@testing-library/react";

describe("TextareaField", () => {
  it("renders the textarea", () => {
    const placeholder = "Write something...";
    render(<TextareaField placeholder={placeholder} />);
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it("displays helper text", () => {
    const helperText = "This is a hint";
    render(<TextareaField helperText={helperText} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  it("calls onChange and resizes height on input", () => {
    const handleChange = jest.fn();
    render(<TextareaField onChange={handleChange} />);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Hello" } });

    expect(handleChange).toHaveBeenCalled();
    expect(textarea.style.height).not.toBe(""); // height should be set
  });

  it("applies full width and error styles", () => {
    render(<TextareaField fullWidth error />);
    const wrapper = screen.getByRole("textbox").parentElement;
    expect(wrapper?.className).toMatch(/textarea--full-width/);
    expect(wrapper?.className).toMatch(/textarea--error/);
  });

  it("is disabled when prop is set", () => {
    render(<TextareaField disabled />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea).toBeDisabled();
  });

  // This test ensures the component safely handles the case when the optional onChange prop is not provided,
  // covering the onChange?.(event) line to achieve full branch coverage.
  it("does not throw when onChange is not provided", () => {
    render(<TextareaField />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Test" } });
  });
});
