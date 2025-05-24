"use client";

import { Button, Flex, TextareaField } from "@/app/ui/components";
import { ChangeEvent, FormEvent, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { MdClear } from "react-icons/md";
import styles from "./expandable-item-creator.module.scss";

export type ExpandableItemCreatorProps = {
  itemCount: number;
  entityName: string;
  isLoading: boolean;
  onSubmit: (value: string) => Promise<void>;
  validateForm: (value: string) => string | null;
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
      className={styles["expandable-item-creator__add-button"]}
    >
      <IoIosAdd className={styles["expandable-item-creator__add-icon"]} />
      {label}
    </Button>
  );
}

function CreationForm({
  onSubmit,
  onClose,
  isLoading,
  entityName,
  validateForm,
}: CreationFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setError(""); // Clear error while typing
  };

  const handleValidateAndSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    const validationError = validateForm(trimmed);

    if (validationError) {
      setError(validationError);
      return;
    }

    await onSubmit(trimmed);
    setValue("");
    setError("");
    onClose();
  };

  return (
    <form
      onSubmit={handleValidateAndSubmit}
      className={styles["expandable-item-creator__form"]}
    >
      <TextareaField
        placeholder={`Enter ${entityName} name...`}
        value={value}
        onChange={handleChange}
        rootClassName={styles["expandable-item-creator__input"]}
        disabled={isLoading}
        autoFocus
        error={!!error}
        helperText={error}
      />

      <Flex gap="0.5rem">
        <Button type="submit" loading={isLoading}>
          {`Add ${entityName}`}
        </Button>

        <Button
          color="gray"
          type="button"
          onClick={onClose}
          aria-label="Cancel"
          className={styles["expandable-item-creator__cancel-button"]}
        >
          <MdClear />
        </Button>
      </Flex>
    </form>
  );
}
