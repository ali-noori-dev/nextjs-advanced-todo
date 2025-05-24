"use client";

import { createListSchema } from "@/app/lib/schemas";
import { useListStore } from "@/app/lib/store";
import { Button, Flex, TextareaField } from "@/app/ui/components";
import { ChangeEvent, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { MdClear } from "react-icons/md";
import styles from "./list-creator.module.scss";

export function ListCreator() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const openForm = () => setIsFormVisible(true);
  const closeForm = () => setIsFormVisible(false);

  return (
    <div className={styles["list-creator"]}>
      {isFormVisible ? (
        <ListForm onClose={closeForm} />
      ) : (
        <AddButton onClick={openForm} />
      )}
    </div>
  );
}

function AddButton({ onClick }: { onClick: VoidFunction }) {
  const lists = useListStore((state) => state.lists);

  return (
    <Button
      color="gray"
      onClick={onClick}
      className={styles["list-creator__add-button"]}
    >
      <IoIosAdd className={styles["list-creator__add-icon"]} />
      {`Add ${lists.length ? "another" : "a"} list`}
    </Button>
  );
}

function ListForm({ onClose }: { onClose: VoidFunction }) {
  const [title, setTitle] = useState("");
  const [validationError, setValidationError] = useState("");
  const addList = useListStore((state) => state.addList);
  const isAddingList = useListStore((state) => state.isAddingList);

  function validateForm(e: React.FormEvent) {
    e.preventDefault();
    const result = createListSchema.safeParse({ title: title.trim() });

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Invalid input";
      setValidationError(errorMessage);
      return;
    } else handleSubmit();
  }

  async function handleSubmit() {
    await addList(title.trim());
    setTitle("");
    onClose();
  }

  const onTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    setValidationError(""); // Clear error while typing
  };

  return (
    <form onSubmit={validateForm} className={styles["list-creator__form"]}>
      <TextareaField
        placeholder="Enter list name..."
        value={title}
        onChange={onTitleChange}
        rootClassName={styles["list-creator__input"]}
        disabled={isAddingList}
        autoFocus
        error={!!validationError}
        helperText={validationError}
      />

      <Flex gap="0.5rem">
        <Button
          type="submit"
          className={styles["list-creator__submit-button"]}
          loading={isAddingList}
        >
          Add list
        </Button>

        <Button
          color="gray"
          onClick={onClose}
          className={styles["list-creator__cancel-button"]}
        >
          <MdClear />
        </Button>
      </Flex>
    </form>
  );
}
