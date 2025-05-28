"use client";

import { useBoardStore } from "@/app/lib/store";
import type { Card } from "@prisma/client";
import styles from "./card-list.module.scss";

export function CardList({ cards }: { cards: Card[] }) {
  const toggleCardCompletion = useBoardStore(
    (state) => state.toggleCardCompletion
  );

  if (cards.length === 0) return null;

  return (
    <ul className={styles["card-list"]}>
      {cards.map((card) => (
        <li key={card.id} className={styles["card-list__item"]}>
          <input
            type="checkbox"
            checked={card.completed}
            onChange={() => toggleCardCompletion(card.id)}
          />

          <h4>{card.title}</h4>
        </li>
      ))}
    </ul>
  );
}
