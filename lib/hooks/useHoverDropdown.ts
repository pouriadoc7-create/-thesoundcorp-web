import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";

/**
 * Hover-intent dropdown with a close delay (so moving the cursor from the
 * trigger into the panel doesn't close it mid-transit), plus keyboard
 * support: focusing the trigger opens it, focus leaving the whole subtree
 * closes it, and Escape closes it immediately. Spread `containerProps` onto
 * the element that wraps both the trigger and the panel.
 */
export function useHoverDropdown(closeDelayMs = 150) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  const open = useCallback(() => {
    clearCloseTimeout();
    setIsOpen(true);
  }, [clearCloseTimeout]);

  const close = useCallback(() => {
    clearCloseTimeout();
    setIsOpen(false);
  }, [clearCloseTimeout]);

  const closeWithDelay = useCallback(() => {
    clearCloseTimeout();
    closeTimeout.current = setTimeout(() => setIsOpen(false), closeDelayMs);
  }, [clearCloseTimeout, closeDelayMs]);

  useEffect(() => clearCloseTimeout, [clearCloseTimeout]);

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        close();
      }
    },
    [close]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        close();
      }
    },
    [close]
  );

  const containerProps = {
    onMouseEnter: open,
    onMouseLeave: closeWithDelay,
    onFocus: open,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
  };

  return { isOpen, open, close, containerProps };
}
