"use client";

import { VFlex } from "@/app/ui/components";
import clsx from "clsx";
import { ComponentPropsWithoutRef, useId, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./input-field.module.scss";

type InputFieldProps = {
  label?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
} & ComponentPropsWithoutRef<"input">;

export function InputField({
  label,
  type = "text",
  // Ensures :placeholder-shown works properly for label floating
  placeholder = " ",
  fullWidth = false,
  disabled = false,
  error = false,
  helperText = "",
  id,
  ...restProps
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const generatedId = useId();
  const inputId = id || generatedId;

  const rootClasses = clsx(styles.input, {
    [styles["input--full-width"]]: fullWidth,
    [styles["input--error"]]: error,
    [styles["input--disabled"]]: disabled,
  });

  const containerClasses = clsx(styles.input__container, {
    [styles["input__container--labeled"]]: label,
    [styles["input__container--password"]]: isPasswordField,
  });

  return (
    <VFlex className={rootClasses}>
      <div className={containerClasses}>
        <input
          id={inputId}
          type={isPasswordField && showPassword ? "text" : type}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input__field}
          {...restProps}
        />

        {label && (
          <label htmlFor={inputId} className={styles.input__label}>
            {label}
          </label>
        )}

        {isPasswordField && (
          <button
            type="button"
            className={styles["input__toggle-password"]}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>

      {helperText && <p className={styles.input__helper}>{helperText}</p>}
    </VFlex>
  );
}
