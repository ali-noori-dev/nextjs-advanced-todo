import { createCardSchema } from "@/app/lib/schemas";
import { useBoardStore } from "@/app/lib/store";
import { ListWithCards } from "@/app/lib/types";
import { Button, ConfirmDeleteModal, Flex } from "@/app/ui/components";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import styles from "./board-list-item.module.scss";
import { CardList } from "./CardList";
import { ExpandableItemCreator } from "./ExpandableItemCreator";

export function BoardListItem({ list }: { list: ListWithCards }) {
  const deleteList = useBoardStore((state) => state.deleteList);
  const addCard = useBoardStore((state) => state.addCard);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);

  return (
    <section className={styles["list-item"]}>
      <Flex className={styles["list-item__header"]}>
        <h2 className={styles["list-item__title"]}>{list.title}</h2>

        <Button
          color="gray"
          className={styles["list-item__delete-button"]}
          onClick={openDeleteModal}
        >
          <FaRegTrashAlt />
        </Button>
      </Flex>

      <CardList cards={list.cards} />

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
