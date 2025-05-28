"use client";

import {
  createCardRequest,
  createListRequest,
  deleteListRequest,
  toggleCardCompletionRequest,
} from "@/app/lib/api";
import type { CardInput, ListWithCards } from "@/app/lib/types";
import toast from "react-hot-toast";
import { create, StateCreator } from "zustand";

interface BoardState {
  lists: ListWithCards[];
  isAddingList: boolean;
  isAddingCard: boolean;
  isDeletingList: boolean;
  setLists: (lists: ListWithCards[]) => void;
  addList: (title: string) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  addCard: (listId: string, card: CardInput) => Promise<void>;
  toggleCardCompletion: (cardId: string) => void;
}

type SetState = Parameters<StateCreator<BoardState>>[0];

const handleAddList = async (title: string, set: SetState) => {
  set({ isAddingList: true });
  try {
    const newList = await createListRequest(title);

    set((state) => ({
      lists: [...state.lists, { ...newList, cards: [] }],
      isAddingList: false,
    }));
  } catch (error) {
    console.error("Failed to create list:", error);
    toast.error("Failed to create list");
    set({ isAddingList: false });
  }
};

const handleDeleteList = async (listId: string, set: SetState) => {
  set({ isDeletingList: true });

  try {
    await deleteListRequest(listId);

    set((state) => ({
      lists: state.lists.filter((list) => list.id !== listId),
      isDeletingList: false,
    }));
  } catch (error) {
    console.error("Failed to delete list:", error);
    toast.error("Failed to delete list");
    set({ isDeletingList: false });
  }
};

const handleAddCard = async (
  listId: string,
  card: CardInput,
  set: SetState
) => {
  set({ isAddingCard: true });

  try {
    const newCard = await createCardRequest(listId, card);

    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
      ),
      isAddingCard: false,
    }));
  } catch (error) {
    console.error("Failed to add card:", error);
    toast.error("Failed to add card");
    set({ isAddingCard: false });
  }
};

const handleToggleCardCompletion = async (
  cardId: string,
  set: SetState,
  get: () => BoardState
) => {
  const { lists } = get();

  const currentCard = lists
    .flatMap((list) => list.cards)
    .find((card) => card.id === cardId);

  if (!currentCard) {
    toast.error("Card not found");
    return;
  }

  const newCompletedState = !currentCard.completed;

  try {
    const updatedCard = await toggleCardCompletionRequest(
      cardId,
      newCompletedState
    );

    set((state) => ({
      lists: state.lists.map((list) => ({
        ...list,
        cards: list.cards.map((card) =>
          card.id === cardId ? updatedCard : card
        ),
      })),
    }));
  } catch (error) {
    console.error("Failed to toggle card completion:", error);
    toast.error("Failed to update card");
  }
};

export const useBoardStore = create<BoardState>((set, get) => ({
  lists: [],
  isAddingList: false,
  isAddingCard: false,
  isDeletingList: false,

  setLists: (lists) => set({ lists }),
  addList: (title) => handleAddList(title, set),
  addCard: (listId, card) => handleAddCard(listId, card, set),
  deleteList: (listId) => handleDeleteList(listId, set),
  toggleCardCompletion: (cardId) =>
    handleToggleCardCompletion(cardId, set, get),
}));
