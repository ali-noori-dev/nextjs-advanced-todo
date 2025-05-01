import { PASSWORD_MIN_LENGTH } from "./auth";

export const AUTH_MESSAGES = {
  VALIDATION: {
    EMAIL_REQUIRED: "Please enter your email address",
    EMAIL_INVALID: "Please enter a valid email address",
    PASSWORD_REQUIRED: "Please enter your password",
    PASSWORD_LENGTH: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    NAME_REQUIRED: "Please enter your full name",
  },
  ERRORS: {
    INCORRECT_CREDENTIALS: "Incorrect email or password",
    EMAIL_EXISTS: "This email is already registered",
    SERVER_ERROR: "Something went wrong. Please try again",
    OAUTH_LOGIN: (provider: string) =>
      `This account was created using ${provider}. Please log in with ${provider} instead.`,
    ACCOUNT_CREATE_FAILED: "Account could not be created. Please try again.",
  },
} as const;

export const VALIDATION_MESSAGES = {
  TITLE_REQUIRED: "Title is required",
  TITLE_MAX_LENGTH: "Title must be under 100 characters",
} as const;
