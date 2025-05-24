import { VALIDATION_MESSAGES } from "@/app/lib/constants";
import { createListSchema } from "@/app/lib/schemas";
import { useListStore } from "@/app/lib/store";
import { ListCreator } from "@/app/ui/lists";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("ListCreator", () => {
  const mockAddList = jest.fn();

  const baseStore = {
    lists: [],
    addList: mockAddList,
    isAddingList: false,
  };

  beforeEach(() => {
    (useListStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector(baseStore)
    );

    jest.clearAllMocks();
  });

  const openListForm = () => {
    render(<ListCreator />);
    fireEvent.click(screen.getByRole("button", { name: /add a list/i }));
  };

  const getTextarea = () => screen.getByPlaceholderText("Enter list name...");

  const getSubmitButton = () =>
    screen.getByRole("button", { name: /add list/i });

  it("renders the AddButton with 'Add a list' when no lists exist", () => {
    render(<ListCreator />);
    expect(screen.getByText("Add a list")).toBeInTheDocument();
  });

  it("renders the AddButton with 'Add another list' when lists exist", () => {
    (useListStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        ...baseStore,
        lists: [{ id: "1", title: "List 1" }],
      })
    );

    render(<ListCreator />);
    expect(screen.getByText("Add another list")).toBeInTheDocument();
  });

  it("shows the form when AddButton is clicked", () => {
    openListForm();
    expect(getTextarea()).toBeInTheDocument();
  });

  it("shows validation error when input is invalid", async () => {
    openListForm();

    fireEvent.click(getSubmitButton());

    expect(
      await screen.findByText(VALIDATION_MESSAGES.TITLE_REQUIRED)
    ).toBeInTheDocument();

    expect(mockAddList).not.toHaveBeenCalled();
  });

  it("falls back to 'Invalid input' when no message is present", () => {
    jest.spyOn(createListSchema, "safeParse").mockImplementationOnce(
      () =>
        ({
          success: false,
          error: { issues: [] }, // no message -> triggers fallback
        } as any)
    );

    openListForm();
    fireEvent.click(getSubmitButton());

    expect(screen.getByText("Invalid input")).toBeInTheDocument();
  });

  it("adds a list and closes the form", async () => {
    const addListMock = jest.fn(() => Promise.resolve());

    (useListStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        lists: [],
        addList: addListMock,
        isAddingList: false,
      })
    );

    openListForm();

    // Type a list name
    fireEvent.change(getTextarea(), {
      target: { value: "New List" },
    });

    // Submit the form
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(/add (a|another) list/i)).toBeInTheDocument();
    });

    expect(addListMock).toHaveBeenCalledWith("New List");
  });
});
