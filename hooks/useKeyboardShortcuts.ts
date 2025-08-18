import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ key, ctrlKey, shiftKey, altKey, metaKey, action, preventDefault = true }) => {
        const isMatch = (
          event.key.toLowerCase() === key.toLowerCase() &&
          !!event.ctrlKey === !!ctrlKey &&
          !!event.shiftKey === !!shiftKey &&
          !!event.altKey === !!altKey &&
          !!event.metaKey === !!metaKey
        );

        if (isMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          action();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Common keyboard shortcuts for the application
export const useGlobalShortcuts = (searchRef?: React.RefObject<HTMLInputElement | null>) => {
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        searchRef?.current?.focus();
      },
    },
    {
      key: '/',
      action: () => {
        searchRef?.current?.focus();
      },
    },
    {
      key: 'Escape',
      action: () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      },
    },
  ]);
};