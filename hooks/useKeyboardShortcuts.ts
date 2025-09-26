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

// Check if the event target is an input element
const isInputElement = (element: Element | null): boolean => {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    (element.getAttribute('contenteditable') === 'true')
  );
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if event.key is undefined (can happen during autocomplete)
      if (!event.key) return;
      
      // Don't trigger shortcuts when typing in input fields
      if (isInputElement(event.target as Element)) {
        return;
      }
      
      shortcuts.forEach(({ key, ctrlKey, shiftKey, altKey, metaKey, action, preventDefault = true }) => {
        // Skip if key is undefined
        if (!key) return;
        
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
