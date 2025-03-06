"use client";

import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import styles from "./button.module.scss";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "small" | "medium" | "large";

type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export function Button({
  label,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  type = "button",
  ...restProps
}: ButtonProps) {
  const buttonClasses = clsx(styles.button, {
    [styles[`button--${variant}`]]: variant,
    [styles[`button--${size}`]]: size,
    [styles["button--full-width"]]: fullWidth,
    [styles["button--disabled"]]: disabled,
  });

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      {...restProps}
    >
      {label}
    </button>
  );
}
