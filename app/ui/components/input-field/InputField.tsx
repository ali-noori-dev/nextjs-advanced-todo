"use client";

import { VFlex } from "@/app/ui/components";
import clsx from "clsx";
import styles from "./input-field.module.scss";

interface InputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  type?: string;
  placeholder?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  autoComplete?: string;
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
  autoComplete,
}: InputFieldProps) {
  const rootClasses = clsx(styles.input, {
    [styles["input--full-width"]]: fullWidth,
    [styles["input--error"]]: error,
    [styles["input--disabled"]]: disabled,
  });

  const containerClasses = clsx(styles.input__container, {
    [styles["input__container--labeled"]]: label,
  });

  return (
    <VFlex className={rootClasses}>
      <div className={containerClasses}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={styles.input__field}
          autoComplete={autoComplete}
        />

        {label && <label className={styles.input__label}>{label}</label>}
      </div>

      {helperText && <p className={styles.input__helper}>{helperText}</p>}
    </VFlex>
  );
}
