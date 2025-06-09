"use client";

import { useBoolean } from "@/app/lib/hooks";
import { createCardSchema } from "@/app/lib/schemas";
import { useBoardStore } from "@/app/lib/store";
import { ListWithCards } from "@/app/lib/types";
import { CardItem, ExpandableItemCreator, TitleField } from "@/app/ui/board";
import { Button, ConfirmDeleteModal, Flex, Tooltip } from "@/app/ui/components";
import { FaRegTrashAlt } from "react-icons/fa";
import styles from "./board-list-item.module.scss";

export function BoardListItem({ list }: { list: ListWithCards }) {
  const updateList = useBoardStore((state) => state.updateList);
  const deleteList = useBoardStore((state) => state.deleteList);
  const addCard = useBoardStore((state) => state.addCard);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBoolean();

  return (
    <section className={styles["list-item"]}>
      <Flex className={styles["list-item__header"]}>
        <TitleField
          title={list.title}
          onUpdate={(title) => updateList(list.id, { title })}
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
