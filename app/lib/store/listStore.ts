"use client";

import {
  createCard,
  createList,
  deleteList as deleteListRequest,
} from "@/app/lib/api";
import type { CardInput, ListWithCards } from "@/app/lib/types";
import toast from "react-hot-toast";
import { create, StateCreator } from "zustand";

interface ListState {
  lists: ListWithCards[];
  isAddingList: boolean;
  isAddingCard: boolean;
  isDeletingList: boolean;
  setLists: (lists: ListWithCards[]) => void;
  addList: (title: string) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  addCard: (listId: string, card: CardInput) => Promise<void>;
}

type SetState = Parameters<StateCreator<ListState>>[0];

const handleAddList = async (title: string, set: SetState) => {
  set({ isAddingList: true });
  try {
    const newList = await createList(title);

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
    const newCard = await createCard(listId, card);

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

export const useListStore = create<ListState>((set) => ({
  lists: [],
  isAddingList: false,
  isAddingCard: false,
  isDeletingList: false,

  setLists: (lists) => set({ lists }),
  addList: (title) => handleAddList(title, set),
  addCard: (listId, card) => handleAddCard(listId, card, set),
  deleteList: (listId) => handleDeleteList(listId, set),
}));
