import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize with the provided initialValue to avoid SSR hydration mismatches.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const item =
        typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (item != null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}
