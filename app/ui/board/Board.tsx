"use client";

import { createListSchema } from "@/app/lib/schemas";
import { useBoardStore } from "@/app/lib/store";
import type { ListWithCards } from "@/app/lib/types";
import { BoardListItem, ExpandableItemCreator } from "@/app/ui/board";
import { useEffect } from "react";
import styles from "./board.module.scss";

export function Board({ initialLists }: { initialLists: ListWithCards[] }) {
  const lists = useBoardStore((state) => state.lists);
  const setLists = useBoardStore((state) => state.setLists);
  const addList = useBoardStore((state) => state.addList);

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
          onSubmit={addList}
          schema={createListSchema}
        />
      </div>
    </main>
  );
}
