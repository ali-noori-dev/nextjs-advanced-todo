"use client";

import { PASSWORD_MIN_LENGTH } from "@/app/lib/constants";
import { Flex } from "@/app/ui/components";
import { ReactNode, useState } from "react";
import styles from "./password-strength-tooltip.module.scss";

enum PasswordStrength {
  TooShort = 0,
  Weak = 1,
  Average = 2,
  Good = 3,
  Strong = 4,
}

type StrengthCriterion = {
  id: string;
  label: string;
  validator: (password: string) => boolean;
};

type StrengthResult = {
  label: string;
  level: PasswordStrength;
};

type Props = {
  password: string;
  children: ReactNode;
};

const strengthCriteria: StrengthCriterion[] = [
  {
    id: "mixed",
    label: "Upper & lower case letters",
    validator: (password: string) =>
      /[a-z]/.test(password) && /[A-Z]/.test(password),
  },
  {
    id: "symbol",
    label: "A symbol (#$&)",
    validator: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
  {
    id: "number",
    label: "A number",
    validator: (password: string) => /[0-9]/.test(password),
  },
];

const calculatePasswordStrength = (password: string): StrengthResult => {
  const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;

  if (!hasMinLength) {
    return {
      label: `At least ${PASSWORD_MIN_LENGTH} characters`,
      level: PasswordStrength.TooShort,
    };
  }

  const passedCriteria = strengthCriteria.filter((criterion) =>
    criterion.validator(password)
  ).length;

  const strengthMap: Record<number, StrengthResult> = {
    0: { label: "Weak Password", level: PasswordStrength.Weak },
    1: { label: "Average Password", level: PasswordStrength.Average },
    2: { label: "Good Password", level: PasswordStrength.Good },
    3: { label: "Strong Password", level: PasswordStrength.Strong },
  };

  return strengthMap[passedCriteria];
};

export function PasswordStrengthTooltip({ password, children }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const { label, level } = calculatePasswordStrength(password);
  const shouldShowTooltip = isFocused && password.length > 0;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <Flex
      className={styles["password-tooltip"]}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      {children}

      {shouldShowTooltip && (
        <div className={styles["password-tooltip__popup"]}>
          <strong className={styles["password-tooltip__popup-title"]}>
            {label}
          </strong>

          <div className={styles["password-tooltip__popup-bar"]}>
            {Array.from({ length: 4 }, (_, i) => i + 1).map((dotIndex) => (
              <span
                key={dotIndex}
                className={`${styles["password-tooltip__popup-bar-dot"]} ${
                  dotIndex <= level
                    ? styles[`password-tooltip__popup-bar-dot--filled-${level}`]
                    : ""
                }`}
              />
            ))}
          </div>

          <span>It's better to have:</span>

          <ul className={styles["password-tooltip__popup-list"]}>
            {strengthCriteria.map(({ id, label, validator }) => (
              <li
                key={id}
                className={`${styles["password-tooltip__popup-list-item"]} ${
                  validator(password)
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
