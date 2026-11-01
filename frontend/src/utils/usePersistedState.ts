import { useEffect, useState } from "react";

/** useState that survives page reloads (localStorage), failing silently if unavailable. */
export function usePersistedState<T extends string>(key: string, initial: T, allowed: readonly T[]) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key) as T | null;
      return stored && allowed.includes(stored) ? stored : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage unavailable (private mode, etc.) */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
