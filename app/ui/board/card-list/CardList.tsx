"use client";

import { useBoardStore } from "@/app/lib/store";
import { CircularSpinner, Tooltip } from "@/app/ui/components";
import type { Card } from "@prisma/client";
import { useState } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import styles from "./card-list.module.scss";

export function CardList({ cards }: { cards: Card[] }) {
  const [togglingCardId, setTogglingCardId] = useState<string | null>(null);

  const toggleCardCompletion = useBoardStore(
    (state) => state.toggleCardCompletion
  );

  const handleToggle = async (card: Card) => {
    setTogglingCardId(card.id);
    await toggleCardCompletion(card);
    setTogglingCardId(null);
  };

  const CompletionStatus = ({ card }: { card: Card }) => {
    if (togglingCardId === card.id) {
      return <CircularSpinner />;
    } else if (card.completed) {
      return (
        <Tooltip content="Mark incomplete">
          <FaCheckCircle
            className={styles["card-list__check-icon"]}
            onClick={() => handleToggle(card)}
          />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip content="Mark complete">
          <FaRegCircle
            className={styles["card-list__circle-icon"]}
            onClick={() => handleToggle(card)}
          />
        </Tooltip>
      );
    }
  };

  if (cards.length === 0) return null;

  return (
    <ul className={styles["card-list"]}>
      {cards.map((card) => (
        <li key={card.id} className={styles["card-list__item"]}>
          <div className={styles["card-list__status"]}>
            <CompletionStatus card={card} />
          </div>

          <h4
            className={
              card.completed ? "" : styles["card-list__not-completed-title"]
            }
          >
            {card.title}
          </h4>
        </li>
      ))}
    </ul>
  );
}
