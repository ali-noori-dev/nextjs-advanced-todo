"use client";

import { Button, Flex, TextareaField } from "@/app/ui/components";
import { ChangeEvent, FormEvent, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { ZodSchema } from "zod";
import styles from "./expandable-item-creator.module.scss";

export type ExpandableItemCreatorProps = {
  itemCount: number;
  entityName: string;
  onSubmit: (title: string) => Promise<void>;
  schema: ZodSchema;
};

type CreationFormProps = Omit<ExpandableItemCreatorProps, "itemCount"> & {
  onClose: VoidFunction;
};

export function ExpandableItemCreator(props: ExpandableItemCreatorProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { itemCount, entityName, ...restProps } = props;

  const openForm = () => setIsFormVisible(true);
  const closeForm = () => setIsFormVisible(false);

  return (
    <div className={styles["expandable-item-creator"]}>
      {isFormVisible ? (
        <CreationForm
          onClose={closeForm}
          entityName={entityName}
          {...restProps}
        />
      ) : (
        <AddButton
          onClick={openForm}
          label={`Add ${itemCount > 0 ? "another" : "a"} ${entityName}`}
        />
      )}
    </div>
  );
}

function AddButton({
  onClick,
  label,
}: {
  onClick: VoidFunction;
  label: string;
}) {
  return (
    <Button
      color="gray"
      onClick={onClick}
      className={`expandable-item-creator-add-button ${styles["expandable-item-creator__add-button"]}`}
    >
      <IoIosAdd className={styles["expandable-item-creator__add-icon"]} />
      {label}
    </Button>
  );
}

function CreationForm({
  onSubmit,
  onClose,
  entityName,
  schema,
}: CreationFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setError(""); // Clear error while typing
  };

  const handleValidateAndSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    const result = schema.safeParse({ title: trimmed });

    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    await onSubmit(trimmed);
    setLoading(false);
    setValue("");
    setError("");
    onClose();
  };

  return (
    <form
      onSubmit={handleValidateAndSubmit}
      className={`${styles["expandable-item-creator__form"]} expandable-item-creator-form`}
    >
      <TextareaField
        placeholder={`Enter ${entityName} name...`}
        value={value}
        onChange={handleChange}
        disabled={loading}
        autoFocus
        error={!!error}
        helperText={error}
      />

      <Flex gap="0.5rem">
        <Button type="submit" loading={loading} size="small">
          {`Add ${entityName}`}
        </Button>

        <Button
          color="gray"
          type="button"
          onClick={onClose}
          size="small"
          aria-label="Cancel"
          className={styles["expandable-item-creator__cancel-button"]}
        >
          <MdClear />
        </Button>
      </Flex>
    </form>
  );
}
