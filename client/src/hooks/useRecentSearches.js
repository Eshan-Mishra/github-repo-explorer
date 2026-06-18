import { useState, useCallback } from 'react';

const STORAGE_KEY = 'recent-searches';
const MAX_ITEMS = 5;

function read() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

// Keeps a short, de-duplicated list of recently searched usernames in
// localStorage so it survives page reloads.
export function useRecentSearches() {
  const [items, setItems] = useState(read);

  const add = useCallback((username) => {
    setItems((current) => {
      const next = [username, ...current.filter((name) => name !== username)].slice(
        0,
        MAX_ITEMS
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  }, []);

  return { items, add, clear };
}
