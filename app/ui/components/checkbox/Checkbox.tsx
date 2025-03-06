"use client";

import { Center } from "@/app/ui/components";
import clsx from "clsx";
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

  const rootClasses = clsx(styles.checkbox, {
    [styles["checkbox--disabled"]]: disabled,
  });

  return (
    <label className={rootClasses}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.checkbox__input}
      />
      <Center className={styles.checkbox__box}></Center>
      {label && <span className={styles.checkbox__label}>{label}</span>}
    </label>
  );
}
