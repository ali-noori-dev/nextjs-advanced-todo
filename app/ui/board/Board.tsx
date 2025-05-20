"use client";

import { useListStore } from "@/app/lib/store";
import type { ListWithCards } from "@/app/lib/types";
import { AddCardForm, CardList } from "@/app/ui/cards";
import { ListCreator } from "@/app/ui/lists";
import { useEffect } from "react";
import styles from "./board.module.scss";

export function Board({ initialLists }: { initialLists: ListWithCards[] }) {
  const lists = useListStore((state) => state.lists);
  const setLists = useListStore((state) => state.setLists);

  useEffect(() => {
    setLists(initialLists);
  }, [initialLists, setLists]);

  return (
    <main className={styles.board}>
      <ListCreator />

      {lists.map((list) => (
        <section key={list.id}>
          <h2>{list.title}</h2>
          <AddCardForm listId={list.id} />
          <CardList cards={list.cards} />
        </section>
      ))}
    </main>
  );
}
