"use client";

import { VFlex } from "@/app/ui/components";
import clsx from "clsx";
import { ComponentPropsWithoutRef, useRef } from "react";
import styles from "./textarea-field.module.scss";

type TextareaFieldProps = {
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  rootClassName?: string;
  resize?: "none" | "vertical" | "horizontal" | "both";
} & ComponentPropsWithoutRef<"textarea">;

export function TextareaField({
  fullWidth = false,
  disabled = false,
  error = false,
  helperText = "",
  className = "",
  rootClassName,
  onChange,
  rows = 1,
  resize = "none",
  ...restProps
}: TextareaFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rootClasses = clsx(styles.textarea, rootClassName, {
    [styles["textarea--full-width"]]: fullWidth,
    [styles["textarea--error"]]: error,
    [styles["textarea--disabled"]]: disabled,
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
    <VFlex className={rootClasses}>
      <textarea
        ref={textareaRef}
        disabled={disabled}
        className={`${styles.textarea__field} ${className}`}
        onChange={handleResize}
        rows={rows}
        style={{ resize, overflow: "hidden" }}
        {...restProps}
      />

      {helperText && <p className={styles.textarea__helper}>{helperText}</p>}
    </VFlex>
  );
}
