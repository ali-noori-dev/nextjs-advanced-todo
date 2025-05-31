"use client";

import { VALIDATION_MESSAGES } from "@/app/lib/constants";
import { createListSchema } from "@/app/lib/schemas";
import {
  ExpandableItemCreator,
  ExpandableItemCreatorProps,
} from "@/app/ui/board/ExpandableItemCreator";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ExpandableItemCreator", () => {
  const defaultProps: ExpandableItemCreatorProps = {
    entityName: "item",
    itemCount: 0,
    onSubmit: jest.fn(() => Promise.resolve()),
    schema: createListSchema,
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

    expect(
      await screen.findByText(VALIDATION_MESSAGES.TITLE_REQUIRED)
    ).toBeInTheDocument();
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
    expect(
      await screen.findByText(VALIDATION_MESSAGES.TITLE_REQUIRED)
    ).toBeInTheDocument();

    fireEvent.change(getTextarea(), { target: { value: "Hello" } });
    expect(
      screen.queryByText(VALIDATION_MESSAGES.TITLE_REQUIRED)
    ).not.toBeInTheDocument();
  });

  it("calls onSubmit with trimmed input, clears state, and closes the form", async () => {
    const onSubmit = jest.fn(() => Promise.resolve());
    openForm({ ...defaultProps, onSubmit });

    fireEvent.change(getTextarea(), { target: { value: "   New Item   " } });
    fireEvent.click(getSubmitButton());

    await screen.findByRole("button", { name: /add a item/i });
    expect(onSubmit).toHaveBeenCalledWith("New Item");
  });
});
