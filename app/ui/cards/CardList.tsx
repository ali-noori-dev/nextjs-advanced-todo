"use client";

import type { Card } from "@prisma/client";
import styles from "./card-list.module.scss";

type CardListProps = {
  cards: Card[];
};

export function CardList({ cards }: CardListProps) {
  if (cards.length === 0) return <p className={styles.empty}>No cards yet.</p>;

  return (
    <ul className={styles.cardList}>
      {cards.map((card) => (
        <li key={card.id} className={styles.cardItem}>
          <h4>{card.title}</h4>
          {card.description && <p>{card.description}</p>}
        </li>
      ))}
    </ul>
  );
}
