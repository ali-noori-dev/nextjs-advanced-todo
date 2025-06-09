"use client";

import { useBoardStore } from "@/app/lib/store";
import { CircularSpinner, Tooltip } from "@/app/ui/components";
import { Card } from "@prisma/client";
import { useState } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import styles from "./card-completion-status.module.scss";

export function CardCompletionStatus({ card }: { card: Card }) {
  const [loading, setLoading] = useState(false);
  const updateCard = useBoardStore((state) => state.updateCard);

  const handleToggle = async () => {
    setLoading(true);
    await updateCard(card.id, { completed: !card.completed });
    setLoading(false);
  };

  if (loading) {
    return <CircularSpinner />;
  } else if (card.completed) {
    return (
      <Tooltip content="Mark incomplete">
        <FaCheckCircle
          className={styles["completed-icon"]}
          onClick={handleToggle}
        />
      </Tooltip>
    );
  } else {
    return (
      <Tooltip content="Mark complete" className="not-completed-tooltip">
        <FaRegCircle
          className={styles["not-completed-icon"]}
          onClick={handleToggle}
        />
      </Tooltip>
    );
  }
}
