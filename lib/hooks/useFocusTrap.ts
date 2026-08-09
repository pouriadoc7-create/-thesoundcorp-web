import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab / Shift+Tab focus inside `containerRef` while `active` is true, so an
 * aria-modal dialog (Command Palette, gallery Lightbox) can't leak focus to the
 * page behind it. Scoped to focus containment only — the caller still owns
 * open/close, scroll-lock, initial focus, and focus restoration on close. If
 * focus somehow lands outside the container, the next Tab pulls it back in.
 */
export function useFocusTrap(active: boolean, containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !container) return;

      // Visible, focusable elements only (offsetParent is null for display:none).
      const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement;

      if (!container.contains(activeEl)) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && activeEl === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, containerRef]);
}
