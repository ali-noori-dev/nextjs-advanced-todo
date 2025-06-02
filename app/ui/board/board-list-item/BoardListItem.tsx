"use client";

import { useBoolean } from "@/app/lib/hooks";
import { createCardSchema } from "@/app/lib/schemas";
import { useBoardStore } from "@/app/lib/store";
import { ListWithCards } from "@/app/lib/types";
import { CardItem, ExpandableItemCreator } from "@/app/ui/board";
import {
  Button,
  ConfirmDeleteModal,
  Flex,
  TextareaField,
  Tooltip,
} from "@/app/ui/components";
import { FaRegTrashAlt } from "react-icons/fa";
import styles from "./board-list-item.module.scss";

export function BoardListItem({ list }: { list: ListWithCards }) {
  const updateList = useBoardStore((state) => state.updateList);
  const deleteList = useBoardStore((state) => state.deleteList);
  const addCard = useBoardStore((state) => state.addCard);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBoolean();

  const handleTitleUpdate = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value.trim();
    if (newTitle && newTitle !== list.title) {
      updateList(list.id, { title: newTitle });
    } else {
      // Reset to original title if empty
      e.target.value = list.title;
    }
  };

  return (
    <section className={styles["list-item"]}>
      <Flex className={styles["list-item__header"]}>
        <TextareaField
          defaultValue={list.title}
          className={styles["list-item__title"]}
          onFocus={(e) => e.target.select()}
          onBlur={handleTitleUpdate}
        />

        <Tooltip content="Delete list">
          <Button
            color="gray"
            className={styles["list-item__delete-button"]}
            onClick={openDeleteModal}
          >
            <FaRegTrashAlt />
          </Button>
        </Tooltip>
      </Flex>

      {list.cards.length > 0 && (
        <ul className={styles["list-item__cards"]}>
          {list.cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </ul>
      )}

      <ExpandableItemCreator
        entityName="card"
        itemCount={list.cards.length}
        onSubmit={(title) => addCard(list.id, { title })}
        schema={createCardSchema}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete this list?"
        message="This action will permanently remove the list and its cards. You can't undo this."
        onClose={closeDeleteModal}
        onConfirm={() => deleteList(list.id)}
      />
    </section>
  );
}
