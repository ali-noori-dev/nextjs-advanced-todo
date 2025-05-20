import { ERROR_MESSAGES } from "@/app/lib/constants";
import { useListStore } from "@/app/lib/store";
import { ListCreator } from "@/app/ui/lists";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";

describe("ListCreator", () => {
  const mockAddList = jest.fn();

  const baseStore = {
    lists: [],
    addList: mockAddList,
    loadingList: false,
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

  it("adds a list and closes the form", async () => {
    const addListMock = jest.fn(() => Promise.resolve());

    (useListStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        lists: [],
        addList: addListMock,
        loadingList: false,
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

  it("disables submit button when input is empty", () => {
    openListForm();
    expect(getSubmitButton()).toBeDisabled();
  });

  it("shows an error toast when addList throws", async () => {
    const addListMock = jest.fn(() =>
      Promise.reject(new Error("Server error"))
    );

    (useListStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        lists: [],
        addList: addListMock,
        loadingList: false,
      })
    );

    openListForm();

    fireEvent.change(getTextarea(), {
      target: { value: "Oops" },
    });

    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(addListMock).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(ERROR_MESSAGES.ADD_LIST_FAILED);
    });
  });
});
