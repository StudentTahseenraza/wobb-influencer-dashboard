// src/hooks/useKeyboardShortcut.ts
import { useEffect } from 'react';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  ctrlKey: boolean = false,
  shiftKey: boolean = false
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key && e.ctrlKey === ctrlKey && e.shiftKey === shiftKey) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, ctrlKey, shiftKey]);
}