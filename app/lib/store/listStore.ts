"use client";

import { createCard, createList } from "@/app/lib/api";
import type { CardInput } from "@/app/lib/types";
import type { Card, List } from "@prisma/client";
import toast from "react-hot-toast";
import { create } from "zustand";

export type ListWithCards = List & { cards: Card[] };

interface ListState {
  lists: ListWithCards[];
  loadingList: boolean;
  loadingCard: boolean;
  setLists: (lists: ListWithCards[]) => void;
  addList: (title: string) => Promise<void>;
  addCard: (listId: string, card: CardInput) => Promise<void>;
}

export const useListStore = create<ListState>((set) => ({
  lists: [],
  loadingList: false,
  loadingCard: false,

  setLists: (lists) => set({ lists }),

  addList: async (title) => {
    set({ loadingList: true });
    try {
      const newList = await createList(title);

      set((state) => ({
        lists: [...state.lists, { ...newList, cards: [] }],
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to create list:", error);
      toast.error("Failed to create list");
      set({ loadingList: false });
    }
  },

  addCard: async (listId, card) => {
    set({ loadingCard: true });

    try {
      const newCard = await createCard(listId, card);

      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to add card:", error);
      toast.error("Failed to add card");
      set({ loadingCard: false });
    }
  },
}));
