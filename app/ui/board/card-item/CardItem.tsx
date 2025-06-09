"use client";

import { useBoolean } from "@/app/lib/hooks";
import { useBoardStore } from "@/app/lib/store";
import { CardCompletionStatus, EditCardModal } from "@/app/ui/board";
import { Button, ConfirmDeleteModal, Tooltip } from "@/app/ui/components";
import type { Card } from "@prisma/client";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import styles from "./card-item.module.scss";

export function CardItem({ card }: { card: Card }) {
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBoolean();
  const [isEditModalOpen, openEditModal, closeEditModal] = useBoolean();
  const deleteCard = useBoardStore((state) => state.deleteCard);

  return (
    <>
      <li className={styles["card"]}>
        <div className={styles["card__status"]}>
          <CardCompletionStatus card={card} />
        </div>

        <div className={styles["card__actions"]}>
          <Tooltip content="Delete card">
            <Button
              color="gray"
              className={styles["card__action-button"]}
              onClick={openDeleteModal}
            >
              <FaRegTrashAlt />
            </Button>
          </Tooltip>

          <Tooltip content="Edit card">
            <Button
              color="gray"
              className={styles["card__action-button"]}
              onClick={openEditModal}
            >
              <FaRegEdit size={16} />
            </Button>
          </Tooltip>
        </div>

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
        onConfirm={() => deleteCard(card)}
      />

      <EditCardModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        card={card}
      />
    </>
  );
}
