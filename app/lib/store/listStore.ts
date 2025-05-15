"use client";

import { createCard, createList } from "@/app/lib/api";
import type { CardInput, ListWithCards } from "@/app/lib/types";
import toast from "react-hot-toast";
import { create, StateCreator } from "zustand";

interface ListState {
  lists: ListWithCards[];
  loadingList: boolean;
  loadingCard: boolean;
  setLists: (lists: ListWithCards[]) => void;
  addList: (title: string) => Promise<void>;
  addCard: (listId: string, card: CardInput) => Promise<void>;
}

type SetState = Parameters<StateCreator<ListState>>[0];

const handleAddList = async (title: string, set: SetState) => {
  set({ loadingList: true });
  try {
    const newList = await createList(title);

    set((state) => ({
      lists: [...state.lists, { ...newList, cards: [] }],
      loadingList: false,
    }));
  } catch (error) {
    console.error("Failed to create list:", error);
    toast.error("Failed to create list");
    set({ loadingList: false });
  }
};

const handleAddCard = async (
  listId: string,
  card: CardInput,
  set: SetState
) => {
  set({ loadingCard: true });

  try {
    const newCard = await createCard(listId, card);

    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
      ),
      loadingCard: false,
    }));
  } catch (error) {
    console.error("Failed to add card:", error);
    toast.error("Failed to add card");
    set({ loadingCard: false });
  }
};

export const useListStore = create<ListState>((set) => ({
  lists: [],
  loadingList: false,
  loadingCard: false,

  setLists: (lists) => set({ lists }),
  addList: (title) => handleAddList(title, set),
  addCard: (listId, card) => handleAddCard(listId, card, set),
}));
