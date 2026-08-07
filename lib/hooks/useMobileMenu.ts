import { useCallback, useEffect, useRef, useState } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

/**
 * Click/tap-toggled disclosure (as opposed to useHoverDropdown's
 * hover-intent model) for the mobile nav panel. Handles the full a11y
 * contract: body scroll lock while open, outside click/tap closes, Escape
 * closes and returns focus to the trigger, and Tab is trapped inside the
 * panel while it's open.
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Lock background scroll while the panel is open.
  useEffect(() => {
    if (!isOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  // Outside click/tap and Escape.
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);

      // If the click landed on something that isn't itself focusable (most
      // commonly the dimmed backdrop), there's nothing else to naturally
      // receive focus, so return it to the trigger — same as Escape. If it
      // landed on a real link/button elsewhere on the page, leave the
      // browser's own click-to-focus behavior alone.
      const targetElement = target instanceof Element ? target : null;
      const clickedFocusable =
        targetElement?.matches(FOCUSABLE_SELECTOR) || targetElement?.closest(FOCUSABLE_SELECTOR);
      if (!clickedFocusable) {
        triggerRef.current?.focus();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  // Focus the first item on open, and trap Tab within the panel.
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const panel = panelRef.current;
    const getFocusable = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    getFocusable()[0]?.focus();

    function handleTab(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const items = getFocusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  return { isOpen, open, close, toggle, panelRef, triggerRef };
}
