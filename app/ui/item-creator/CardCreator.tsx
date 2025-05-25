"use client";

import { createCardSchema } from "@/app/lib/schemas";
import { useBoardStore } from "@/app/lib/store";
import { ExpandableItemCreator } from "./ExpandableItemCreator";

export function CardCreator({ listId }: { listId: string }) {
  const addCard = useBoardStore((state) => state.addCard);
  const isAddingList = useBoardStore((state) => state.isAddingCard);
  const lists = useBoardStore((state) => state.lists);

  const currentList = lists.find((list) => list.id === listId);

  return (
    <ExpandableItemCreator
      entityName="card"
      itemCount={currentList?.cards.length || 0}
      isLoading={isAddingList}
      onSubmit={(title) => addCard(listId, { title })}
      schema={createCardSchema}
    />
  );
}
