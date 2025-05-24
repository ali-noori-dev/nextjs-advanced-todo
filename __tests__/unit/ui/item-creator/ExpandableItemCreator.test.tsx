"use client";

import {
  ExpandableItemCreator,
  ExpandableItemCreatorProps,
} from "@/app/ui/item-creator";
import { fireEvent, render, screen } from "@testing-library/react";

const NAME_REQUIRED_MESSAGE = "Name is required";

describe("ExpandableItemCreator", () => {
  const defaultProps: ExpandableItemCreatorProps = {
    entityName: "item",
    itemCount: 0,
    isLoading: false,
    onSubmit: jest.fn(() => Promise.resolve()),
    validateForm: (value: string) =>
      value.trim() ? null : NAME_REQUIRED_MESSAGE,
  };

  const getTextarea = () => screen.getByPlaceholderText(/enter item name/i);

  const getAddButton = () =>
    screen.getByRole("button", { name: /add a item/i });

  const getSubmitButton = () =>
    screen.getByRole("button", { name: /add item/i });

  const openForm = (props?: ExpandableItemCreatorProps) => {
    render(<ExpandableItemCreator {...defaultProps} {...props} />);
    fireEvent.click(getAddButton());
  };

  it("renders add button with 'Add a item' when itemCount is 0", () => {
    render(<ExpandableItemCreator {...defaultProps} />);
    expect(getAddButton()).toBeInTheDocument();
  });

  it("renders add button with 'Add another item' when itemCount > 0", () => {
    render(<ExpandableItemCreator {...defaultProps} itemCount={1} />);
    expect(screen.getByText("Add another item")).toBeInTheDocument();
  });

  it("shows the form when AddButton is clicked", () => {
    openForm();
    expect(getTextarea()).toBeInTheDocument();
  });

  it("shows validation error when input is invalid", async () => {
    openForm();
    fireEvent.click(getSubmitButton());

    expect(await screen.findByText(NAME_REQUIRED_MESSAGE)).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("closes the form when cancel button is clicked", async () => {
    openForm();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(getAddButton()).toBeInTheDocument();
  });

  it("clears validation error while typing", async () => {
    openForm();

    fireEvent.click(getSubmitButton());
    expect(await screen.findByText(NAME_REQUIRED_MESSAGE)).toBeInTheDocument();

    fireEvent.change(getTextarea(), { target: { value: "Hello" } });
    expect(screen.queryByText(NAME_REQUIRED_MESSAGE)).not.toBeInTheDocument();
  });

  it("calls onSubmit with trimmed input, clears state, and closes the form", async () => {
    const onSubmit = jest.fn(() => Promise.resolve());
    openForm({ ...defaultProps, onSubmit, validateForm: () => null });

    fireEvent.change(getTextarea(), { target: { value: "   New Item   " } });
    fireEvent.click(getSubmitButton());

    await screen.findByRole("button", { name: /add a item/i });
    expect(onSubmit).toHaveBeenCalledWith("New Item");
  });
});
