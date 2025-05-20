"use client";

import { ERROR_MESSAGES } from "@/app/lib/constants";
import { useListStore } from "@/app/lib/store";
import { Button, Flex, TextareaField } from "@/app/ui/components";
import { useState } from "react";
import toast from "react-hot-toast";
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
  const addList = useListStore((state) => state.addList);
  const loading = useListStore((state) => state.loadingList);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await addList(title.trim());
      setTitle("");
      onClose();
    } catch (error) {
      console.error("Failed to add list:", error);
      toast.error(ERROR_MESSAGES.ADD_LIST_FAILED);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles["list-creator__form"]}>
      <TextareaField
        placeholder="Enter list name..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        rootClassName={styles["list-creator__input"]}
        disabled={loading}
        autoFocus
      />

      <Flex gap="0.5rem">
        <Button
          type="submit"
          disabled={loading || !title.trim()}
          className={styles["list-creator__submit-button"]}
          loading={loading}
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
