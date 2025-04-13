import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
      prefix: "<rootDir>/",
    }),
    "\\.(scss|sass|css)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.ts",
    "^next/font/google$": "<rootDir>/__mocks__/nextFontGoogleMock.js",
    "next/image": "<rootDir>/__mocks__/image.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
