"use client";

import { useBoardStore } from "@/app/lib/store";
import { TitleField } from "@/app/ui/board";
import { Modal } from "@/app/ui/components";
import { Card } from "@prisma/client";
import { useState } from "react";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  card: Card;
};

export function EditCardModal({
  isOpen,
  onClose,
  card,
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const updateCard = useBoardStore((state) => state.updateCard);

  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleConfirm = async () => {
    setLoading(true);
    // await onConfirm();
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <TitleField
        title={card.title}
        onUpdate={(title) => updateCard(card.id, { title })}
      />
    </Modal>
  );
}
