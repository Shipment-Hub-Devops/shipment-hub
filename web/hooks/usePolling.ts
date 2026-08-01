'use client';

import { useEffect, useRef } from 'react';

// Invokes `callback` on the given interval while `enabled` is true.
export function usePolling(
  callback: () => void,
  intervalMs: number,
  enabled = true
): void {
  const saved = useRef(callback);
  saved.current = callback;

  useEffect(() => {
    if (!enabled) return undefined;
    const id = setInterval(() => saved.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);
}
