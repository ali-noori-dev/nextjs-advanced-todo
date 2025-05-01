"use client";

import { useListStore } from "@/app/lib/store";
import type { ListWithCards } from "@/app/lib/types";
import { AddCardForm, CardList } from "@/app/ui/cards";
import { AddListForm } from "@/app/ui/lists";
import { useEffect } from "react";

export function Board({ initialLists }: { initialLists: ListWithCards[] }) {
  const { lists, setLists } = useListStore();

  useEffect(() => {
    setLists(initialLists);
  }, [initialLists, setLists]);

  return (
    <main>
      <AddListForm />

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
