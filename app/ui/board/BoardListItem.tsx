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
  const isDeletingList = useBoardStore((state) => state.isDeletingList);
  const deleteList = useBoardStore((state) => state.deleteList);
  const addCard = useBoardStore((state) => state.addCard);
  const isAddingList = useBoardStore((state) => state.isAddingCard);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteList = async () => {
    await deleteList(list.id);
    closeDeleteModal();
  };

  return (
    <section className={styles["list-item"]}>
      <Flex className={styles["list-item__header"]}>
        <h2 className={styles["list-item__title"]}>{list.title}</h2>

        <Button
          color="gray"
          className={styles["list-item__delete-button"]}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <FaRegTrashAlt />
        </Button>
      </Flex>

      <CardList cards={list.cards} />

      <ExpandableItemCreator
        entityName="card"
        itemCount={list.cards.length}
        isLoading={isAddingList}
        onSubmit={(title) => addCard(list.id, { title })}
        schema={createCardSchema}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete this list?"
        message="This action will permanently remove the list and its cards. You can't undo this."
        onClose={closeDeleteModal}
        onConfirm={handleDeleteList}
        loading={isDeletingList}
      />
    </section>
  );
}
