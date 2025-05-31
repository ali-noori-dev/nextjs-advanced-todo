import { useCallback, useState } from "react";

export function useBoolean(
  initial = false
): [boolean, VoidFunction, VoidFunction] {
  const [value, setValue] = useState(initial);
  const on = useCallback(() => setValue(true), []);
  const off = useCallback(() => setValue(false), []);
  return [value, on, off];
}
