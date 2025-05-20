import { useListStore } from "@/app/lib/store";
import type { ListWithCards } from "@/app/lib/types";
import { Board } from "@/app/ui/board";
import { render, screen } from "@testing-library/react";

describe("Board Component", () => {
  it("renders with initial lists", () => {
    const mockLists: ListWithCards[] = [
      {
        id: "1",
        title: "List 1",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        cards: [],
      },
    ];

    (useListStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        lists: mockLists,
        setLists: jest.fn(),
      })
    );

    render(<Board initialLists={mockLists} />);

    expect(screen.getByText("List 1")).toBeInTheDocument();
  });
});
