"use client";

import styles from "./input-field.module.scss";

interface InputFieldProps {
  label: string;
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
    <div
      className={`${styles["input-field"]} ${
        fullWidth ? styles["full-width"] : ""
      } ${error ? styles["error"] : ""} ${disabled ? styles["disabled"] : ""}`}
    >
      <div className={styles["input-container"]}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={styles["input"]}
        />

        <label className={`${styles["label"]}`}>{label}</label>
      </div>

      {helperText && <p className={styles["helper-text"]}>{helperText}</p>}
    </div>
  );
}
