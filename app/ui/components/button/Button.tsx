"use client";

import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import styles from "./button.module.scss";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "small" | "medium" | "large";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
} & ComponentPropsWithoutRef<"button">;

export function Button({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  type = "button",
  className,
  ...restProps
}: ButtonProps) {
  const buttonClasses = clsx(styles.button, {
    [styles[`button--${variant}`]]: variant,
    [styles[`button--${size}`]]: size,
    [styles["button--full-width"]]: fullWidth,
    [styles["button--disabled"]]: disabled,
    [className ?? ""]: className,
  });

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
}
