// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const cached = window.localStorage.getItem(key);
    return cached ? JSON.parse(cached) : initial;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
