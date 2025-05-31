"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/app/ui/components";
import { useState } from "react";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: VoidFunction;
  onConfirm: () => Promise<void>;
};

export function ConfirmDeleteModal({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{message}</ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Button color="error" loading={loading} onClick={handleConfirm}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}
