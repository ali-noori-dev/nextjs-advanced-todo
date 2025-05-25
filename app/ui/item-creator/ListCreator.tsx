"use client";

import { createListSchema } from "@/app/lib/schemas";
import { useBoardStore } from "@/app/lib/store";
import { ExpandableItemCreator } from "./ExpandableItemCreator";
import styles from "./list-creator.module.scss";

export function ListCreator() {
  const addList = useBoardStore((state) => state.addList);
  const isAddingList = useBoardStore((state) => state.isAddingList);
  const lists = useBoardStore((state) => state.lists);

  return (
    <div className={styles["list-creator"]}>
      <ExpandableItemCreator
        entityName="list"
        itemCount={lists.length}
        isLoading={isAddingList}
        onSubmit={addList}
        schema={createListSchema}
      />
    </div>
  );
}
