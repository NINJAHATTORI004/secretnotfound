'use client';

import { useState, useEffect, useCallback } from 'react';

// A helper function to safely read from localStorage
function readValue<T>(key: string, initialValue: T): T {
  // Prevent build errors and issues with server-side rendering
  if (typeof window === 'undefined') {
    return initialValue;
  }
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Pass a function to useState to ensure localStorage is only read once on the client.
  const [storedValue, setStoredValue] = useState<T>(() => readValue(key, initialValue));

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  // This effect ensures the component updates if the localStorage value is changed
  // by another tab or a different part of the app.
  useEffect(() => {
    setStoredValue(readValue(key, initialValue));
  }, [key, initialValue]);

  return [storedValue, setValue];
}
