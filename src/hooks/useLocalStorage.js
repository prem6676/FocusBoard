import { useEffect, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) {
        return typeof initialValue === 'function' ? initialValue() : initialValue;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.warn(`Unable to read "${key}" from localStorage:`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Unable to save "${key}" to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
