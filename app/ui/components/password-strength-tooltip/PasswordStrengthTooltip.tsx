"use client";

import { Flex } from "@/app/ui/components";
import { ReactNode, useState } from "react";
import styles from "./password-strength-tooltip.module.scss";

type Props = {
  password: string;
  children: ReactNode;
};

export function PasswordStrengthTooltip({ password, children }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasMinLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasMixed = hasLower && hasUpper;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const getStrength = () => {
    const score = [hasSymbol, hasMinLength, hasNumber, hasMixed].filter(
      Boolean
    ).length;

    if (!hasMinLength) return { label: "At least 8 characters", level: 0 };
    if (score === 1) return { label: "Weak Password", level: 1 };
    if (score === 2) return { label: "Average Password", level: 2 };
    if (score === 3) return { label: "Good Password", level: 3 };
    return { label: "Strong Password", level: 4 };
  };

  const { label, level } = getStrength();

  return (
    <Flex
      className={styles["password-tooltip"]}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      {children}

      {isFocused && password.length > 0 && (
        <div className={styles["password-tooltip__popup"]}>
          <strong className={styles["password-tooltip__popup-title"]}>
            {label}
          </strong>

          <div className={styles["password-tooltip__popup-bar"]}>
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`${styles["password-tooltip__popup-bar-dot"]} ${
                  i <= level
                    ? styles["password-tooltip__popup-bar-dot--filled"]
                    : ""
                }`}
              />
            ))}
          </div>

          <span>It's better to have:</span>

          <ul className={styles["password-tooltip__popup-list"]}>
            <li
              className={`${styles["password-tooltip__popup-list-item"]} ${
                hasMixed
                  ? styles["password-tooltip__popup-list-item--passed"]
                  : ""
              }`}
            >
              Upper & lower case letters
            </li>

            <li
              className={`${styles["password-tooltip__popup-list-item"]} ${
                hasSymbol
                  ? styles["password-tooltip__popup-list-item--passed"]
                  : ""
              }`}
            >
              A symbol (#$&)
            </li>

            <li
              className={`${styles["password-tooltip__popup-list-item"]} ${
                hasNumber
                  ? styles["password-tooltip__popup-list-item--passed"]
                  : ""
              }`}
            >
              A number
            </li>
          </ul>
        </div>
      )}
    </Flex>
  );
}
