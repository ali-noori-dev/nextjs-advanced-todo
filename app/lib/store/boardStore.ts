"use client";

import {
  createCardRequest,
  createListRequest,
  deleteCardRequest,
  deleteListRequest,
  updateCardRequest,
  updateListRequest,
} from "@/app/lib/api";
import type { CardInput, ListWithCards } from "@/app/lib/types";
import { Card } from "@prisma/client";
import toast from "react-hot-toast";
import { create, StateCreator } from "zustand";

interface BoardState {
  lists: ListWithCards[];
  setLists: (lists: ListWithCards[]) => void;
  addList: (title: string) => Promise<void>;
  updateList: (listId: string, data: { title: string }) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  addCard: (listId: string, card: CardInput) => Promise<void>;
  deleteCard: (card: Card) => Promise<void>;
  updateCard: (Id: string, data: Partial<Card>) => Promise<void>;
}

type SetState = Parameters<StateCreator<BoardState>>[0];

const handleAddList = async (title: string, set: SetState) => {
  try {
    const newList = await createListRequest(title);

    set((state) => ({
      lists: [...state.lists, { ...newList, cards: [] }],
    }));
  } catch (error) {
    console.error("Failed to create list:", error);
    toast.error("Failed to create list");
  }
};

const handleDeleteList = async (listId: string, set: SetState) => {
  try {
    await deleteListRequest(listId);

    set((state) => ({
      lists: state.lists.filter((list) => list.id !== listId),
    }));
  } catch (error) {
    console.error("Failed to delete list:", error);
    toast.error("Failed to delete list");
  }
};

const handleAddCard = async (
  listId: string,
  card: CardInput,
  set: SetState
) => {
  try {
    const newCard = await createCardRequest(listId, card);

    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
      ),
    }));
  } catch (error) {
    console.error("Failed to add card:", error);
    toast.error("Failed to add card");
  }
};

const handleUpdateCard = async (
  id: string,
  data: Partial<Card>,
  set: SetState
) => {
  try {
    const updatedCard = await updateCardRequest(id, data);

    set((state) => ({
      lists: state.lists.map((list) => ({
        ...list,
        cards: list.cards.map((card) => (card.id === id ? updatedCard : card)),
      })),
    }));
  } catch (error) {
    console.error("Failed to toggle card completion:", error);
    toast.error("Failed to update card");
  }
};

const handleUpdateList = async (
  listId: string,
  data: { title: string },
  set: SetState
) => {
  try {
    const updatedList = await updateListRequest(listId, data);

    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId ? { ...list, ...updatedList } : list
      ),
    }));
  } catch (error) {
    console.error("Failed to update list:", error);
    toast.error("Failed to update list");
  }
};

const handleDeleteCard = async (card: Card, set: SetState) => {
  try {
    await deleteCardRequest(card.id);

    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === card.listId
          ? { ...list, cards: list.cards.filter((card) => card.id !== card.id) }
          : list
      ),
    }));
  } catch (error) {
    console.error("Failed to delete card:", error);
    toast.error("Failed to delete card");
  }
};

export const useBoardStore = create<BoardState>((set) => ({
  lists: [],
  setLists: (lists) => set({ lists }),
  addList: (title) => handleAddList(title, set),
  updateList: (listId, data) => handleUpdateList(listId, data, set),
  deleteList: (listId) => handleDeleteList(listId, set),
  addCard: (listId, card) => handleAddCard(listId, card, set),
  deleteCard: (card) => handleDeleteCard(card, set),
  updateCard: (id, data) => handleUpdateCard(id, data, set),
}));
