import { useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setArcMenuOpen(next: boolean) {
  if (open === next) return;
  open = next;
  listeners.forEach((l) => l());
}

export function toggleArcMenu() {
  setArcMenuOpen(!open);
}

export function useArcMenuOpen() {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => open,
  );
}
