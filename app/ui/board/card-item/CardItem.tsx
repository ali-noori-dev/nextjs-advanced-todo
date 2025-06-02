"use client";

import { useBoolean } from "@/app/lib/hooks";
import { useBoardStore } from "@/app/lib/store";
import {
  Button,
  CircularSpinner,
  ConfirmDeleteModal,
  Tooltip,
} from "@/app/ui/components";
import type { Card } from "@prisma/client";
import { useState } from "react";
import { FaCheckCircle, FaRegCircle, FaRegTrashAlt } from "react-icons/fa";
import styles from "./card-item.module.scss";

export function CardItem({ card, listId }: { card: Card; listId: string }) {
  const [togglingCardId, setTogglingCardId] = useState<string | null>(null);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBoolean();
  const deleteCard = useBoardStore((state) => state.deleteCard);

  const toggleCardCompletion = useBoardStore(
    (state) => state.toggleCardCompletion
  );

  const handleToggle = async () => {
    setTogglingCardId(card.id);
    await toggleCardCompletion(card);
    setTogglingCardId(null);
  };

  const CompletionStatus = () => {
    if (togglingCardId === card.id) {
      return <CircularSpinner />;
    } else if (card.completed) {
      return (
        <Tooltip content="Mark incomplete">
          <FaCheckCircle
            className={styles["card__check-icon"]}
            onClick={handleToggle}
          />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip content="Mark complete">
          <FaRegCircle
            className={styles["card__circle-icon"]}
            onClick={handleToggle}
          />
        </Tooltip>
      );
    }
  };

  return (
    <>
      <li className={styles["card"]}>
        <div className={styles["card__status"]}>
          <CompletionStatus />
        </div>

        <Tooltip
          content="Delete card"
          className={styles["card__delete-tooltip"]}
        >
          <Button
            color="gray"
            className={styles["card__delete-button"]}
            onClick={openDeleteModal}
          >
            <FaRegTrashAlt />
          </Button>
        </Tooltip>

        <h4
          className={card.completed ? "" : styles["card__not-completed-title"]}
        >
          {card.title}
        </h4>
      </li>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete this card?"
        message="This action will permanently remove the card. You can't undo this."
        onClose={closeDeleteModal}
        onConfirm={() => deleteCard(card.id, listId)}
      />
    </>
  );
}
