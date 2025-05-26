"use client";

import { VFlex } from "@/app/ui/components";
import clsx from "clsx";
import { ComponentPropsWithoutRef, useRef } from "react";
import styles from "./textarea-field.module.scss";

type TextareaFieldProps = {
  error?: boolean;
  helperText?: string;
  resize?: "none" | "vertical" | "horizontal" | "both";
} & ComponentPropsWithoutRef<"textarea">;

export function TextareaField({
  disabled = false,
  error = false,
  helperText = "",
  className = "",
  onChange,
  rows = 1,
  resize = "none",
  ...restProps
}: TextareaFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fieldClasses = clsx(styles.textarea__field, className, {
    [styles["textarea__field--error"]]: error,
    [styles["textarea__field--disabled"]]: disabled,
  });

  const handleResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    onChange?.(event); // Forward onChange if provided
  };

  return (
    <VFlex className={styles.textarea}>
      <textarea
        ref={textareaRef}
        disabled={disabled}
        className={fieldClasses}
        onChange={handleResize}
        rows={rows}
        style={{ resize, overflow: "hidden" }}
        {...restProps}
      />

      {helperText && <p className={styles.textarea__helper}>{helperText}</p>}
    </VFlex>
  );
}
