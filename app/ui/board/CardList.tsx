"use client";

import type { Card } from "@prisma/client";
import styles from "./card-list.module.scss";

export function CardList({ cards }: { cards: Card[] }) {
  if (cards.length === 0) return null;

  return (
    <ul className={styles["card-list"]}>
      {cards.map((card) => (
        <li key={card.id} className={styles["card-list__item"]}>
          <h4>{card.title}</h4>
          {card.description && <p>{card.description}</p>}
        </li>
      ))}
    </ul>
  );
}
