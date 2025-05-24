"use client";

import { createListSchema } from "@/app/lib/schemas";
import { useListStore } from "@/app/lib/store";
import { ExpandableItemCreator } from "./ExpandableItemCreator";

export function ListCreator() {
  const addList = useListStore((state) => state.addList);
  const isAddingList = useListStore((state) => state.isAddingList);
  const lists = useListStore((state) => state.lists);

  const validateForm = (title: string) => {
    const result = createListSchema.safeParse({ title });

    return result.success
      ? null
      : result.error.issues[0]?.message || "Invalid input";
  };

  return (
    <ExpandableItemCreator
      entityName="list"
      itemCount={lists.length}
      isLoading={isAddingList}
      validateForm={validateForm}
      onSubmit={addList}
    />
  );
}
