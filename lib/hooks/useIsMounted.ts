import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

/**
 * True only after the client has hydrated. For content that must not
 * render during SSR (e.g. a `createPortal` target that needs `document`),
 * without the extra-render / lint issues of the classic
 * `useState(false) + useEffect(() => setState(true))` pattern.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
