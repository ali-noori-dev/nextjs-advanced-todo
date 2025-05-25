"use client";

import { VALIDATION_MESSAGES } from "@/app/lib/constants";
import { useBoardStore } from "@/app/lib/store";
import { ListCreator } from "@/app/ui/item-creator";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("ListCreator", () => {
  const mockAddList = jest.fn();

  const setupStore = (customState = {}) => {
    (useBoardStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        lists: [],
        addList: mockAddList,
        isAddingList: false,
        ...customState,
      })
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const openForm = () => {
    render(<ListCreator />);
    fireEvent.click(screen.getByRole("button", { name: /add a list/i }));
  };

  const getTextarea = () => screen.getByPlaceholderText(/enter list name/i);

  const getSubmitButton = () =>
    screen.getByRole("button", { name: /add list/i });

  it("shows validation error if input is empty", async () => {
    setupStore();
    openForm();

    fireEvent.click(getSubmitButton());

    expect(
      await screen.findByText(VALIDATION_MESSAGES.TITLE_REQUIRED)
    ).toBeInTheDocument();

    expect(mockAddList).not.toHaveBeenCalled();
  });

  it("calls addList with valid input", async () => {
    setupStore();
    openForm();

    fireEvent.change(getTextarea(), { target: { value: "  My List  " } });
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockAddList).toHaveBeenCalledWith("My List");
    });
  });
});
