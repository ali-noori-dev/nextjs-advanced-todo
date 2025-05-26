"use client";

import { createListSchema } from "@/app/lib/schemas";
import { useBoardStore } from "@/app/lib/store";
import type { ListWithCards } from "@/app/lib/types";
import { useEffect } from "react";
import styles from "./board.module.scss";
import { BoardListItem } from "./BoardListItem";
import { ExpandableItemCreator } from "./ExpandableItemCreator";

export function Board({ initialLists }: { initialLists: ListWithCards[] }) {
  const lists = useBoardStore((state) => state.lists);
  const setLists = useBoardStore((state) => state.setLists);
  const addList = useBoardStore((state) => state.addList);
  const isAddingList = useBoardStore((state) => state.isAddingList);

  useEffect(() => {
    setLists(initialLists);
  }, [initialLists]);

  return (
    <main className={styles.board}>
      {lists.map((list) => (
        <BoardListItem key={list.id} list={list} />
      ))}

      <div className={styles["board__list-creator"]}>
        <ExpandableItemCreator
          entityName="list"
          itemCount={lists.length}
          isLoading={isAddingList}
          onSubmit={addList}
          schema={createListSchema}
        />
      </div>
    </main>
  );
}
