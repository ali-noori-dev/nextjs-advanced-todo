"use client";

import { VFlex } from "@/app/ui/components";
import styles from "./input-field.module.scss";

interface InputFieldProps {
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

export function InputField({
  label,
  type = "text",
  value,
  onChange,
  // Ensures :placeholder-shown works properly for label floating
  placeholder = " ",
  fullWidth = false,
  required = false,
  disabled = false,
  error = false,
  helperText = "",
}: InputFieldProps) {
  return (
    <VFlex
      className={`${styles["input"]} ${
        fullWidth ? styles["input--full-width"] : ""
      } ${error ? styles["input--error"] : ""} ${
        disabled ? styles["input--disabled"] : ""
      }`}
    >
      <div
        className={`${styles["input__container"]} ${
          label ? styles["input__container--labeled"] : ""
        }`}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={styles["input__field"]}
        />

        {label && <label className={styles["input__label"]}>{label}</label>}
      </div>

      {helperText && <p className={styles["input__helper"]}>{helperText}</p>}
    </VFlex>
  );
}
