"use client";

import { DotSpinner } from "@/app/ui/components";
import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import styles from "./button.module.scss";

type ButtonVariant = "contained" | "outlined" | "ghost";
type ButtonColor = "primary" | "secondary" | "error" | "success" | "gray";
type ButtonSize = "small" | "medium" | "large";

type ButtonProps = {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
} & ComponentPropsWithoutRef<"button">;

export function Button({
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  type = "button",
  className,
  ...restProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonClasses = clsx(
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${color}`],
    styles[`button--${size}`],
    {
      [styles["button--full-width"]]: fullWidth,
      [styles["button--disabled"]]: isDisabled,
      [className ?? ""]: className,
    }
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      {...restProps}
    >
      {!loading && children}

      {loading && (
        <>
          <div style={{ visibility: "hidden" }}>{children}</div>

          <span className={styles["button__loading-indicator"]}>
            <DotSpinner size="small" />
          </span>
        </>
      )}
    </button>
  );
}
