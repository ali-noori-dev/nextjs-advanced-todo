require("@testing-library/jest-dom");

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

jest.mock("@/app/lib/store", () => ({
  useBoardStore: jest.fn(),
}));
