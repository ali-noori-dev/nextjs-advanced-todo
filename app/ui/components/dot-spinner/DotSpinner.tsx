"use client";

import clsx from "clsx";
import styles from "./dot-spinner.module.scss";

type DotSpinnerSize = "small" | "medium" | "large";
type DotSpinnerColor = "primary" | "secondary" | "white";

interface DotSpinnerProps {
  size?: DotSpinnerSize;
  color?: DotSpinnerColor;
  className?: string;
}

export function DotSpinner({
  size = "medium",
  color = "white",
  className,
}: DotSpinnerProps) {
  // Create an array to render multiple dots
  const dots = Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className={clsx(styles["spinner__dot"], styles[`spinner__dot--${size}`])}
    />
  ));

  return (
    <div
      className={clsx(
        styles["spinner"],
        styles[`spinner--${color}`],
        className
      )}
      role="status"
    >
      {dots}
    </div>
  );
}
