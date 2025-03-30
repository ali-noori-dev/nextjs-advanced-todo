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

  const strengthCriteria = [
    {
      id: "mixed",
      label: "Upper & lower case letters",
      isPassed: hasMixed,
    },
    {
      id: "symbol",
      label: "A symbol (#$&)",
      isPassed: hasSymbol,
    },
    {
      id: "number",
      label: "A number",
      isPassed: hasNumber,
    },
  ];

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
                    ? styles[`password-tooltip__popup-bar-dot--filled-${level}`]
                    : ""
                }`}
              />
            ))}
          </div>

          <span>It's better to have:</span>

          <ul className={styles["password-tooltip__popup-list"]}>
            {strengthCriteria.map(({ id, label, isPassed }) => (
              <li
                key={id}
                className={`${styles["password-tooltip__popup-list-item"]} ${
                  isPassed
                    ? styles["password-tooltip__popup-list-item--passed"]
                    : ""
                }`}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Flex>
  );
}
