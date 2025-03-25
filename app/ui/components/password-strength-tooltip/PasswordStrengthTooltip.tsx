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

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const getStrength = () => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const isLong = password.length >= 12;

    const score = [hasUpper, hasLower, hasNumber, hasSymbol, isLong].filter(
      Boolean
    ).length;

    if (password.length === 0) return { label: "", level: 0 };
    if (score <= 2) return { label: "Weak Password", level: 1 };
    if (score === 3) return { label: "Average Password", level: 2 };
    if (score === 4) return { label: "Good Password", level: 3 };
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

      {isFocused && (
        <div className={styles["password-tooltip__popup"]}>
          <strong className={styles["password-tooltip__popup-title"]}>
            {label}
          </strong>

          <ul className={styles["password-tooltip__popup-list"]}>
            <li
              className={`${styles["password-tooltip__popup-list-item"]} ${
                password.length >= 6
                  ? styles["password-tooltip__popup-list-item--passed"]
                  : ""
              }`}
            >
              At least 6 characters
            </li>
            <li
              className={`${styles["password-tooltip__popup-list-item"]} ${
                /[A-Z]/.test(password) && /[a-z]/.test(password)
                  ? styles["password-tooltip__popup-list-item--passed"]
                  : ""
              }`}
            >
              Upper & lower case letters
            </li>
            <li
              className={`${styles["password-tooltip__popup-list-item"]} ${
                /[^A-Za-z0-9]/.test(password)
                  ? styles["password-tooltip__popup-list-item--passed"]
                  : ""
              }`}
            >
              A symbol (#$&)
            </li>
            <li
              className={`${styles["password-tooltip__popup-list-item"]} ${
                password.length >= 12
                  ? styles["password-tooltip__popup-list-item--passed"]
                  : ""
              }`}
            >
              A longer password
            </li>
          </ul>

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
        </div>
      )}
    </Flex>
  );
}
