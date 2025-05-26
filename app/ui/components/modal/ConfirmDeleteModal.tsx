"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/app/ui/components";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: VoidFunction;
  onConfirm: () => void;
  loading?: boolean;
};

export function ConfirmDeleteModal({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  loading = false,
}: ConfirmDeleteModalProps) {
  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{message}</ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>

        <Button color="error" loading={loading} onClick={onConfirm}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}
