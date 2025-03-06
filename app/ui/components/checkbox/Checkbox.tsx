"use client";

import { Center } from "@/app/ui/components";
import styles from "./checkbox.module.scss";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label
      className={`${styles["checkbox"]} ${
        disabled ? styles["checkbox--disabled"] : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles["checkbox__input"]}
      />
      <Center className={styles["checkbox__box"]}></Center>
      {label && <span className={styles["checkbox__label"]}>{label}</span>}
    </label>
  );
}
