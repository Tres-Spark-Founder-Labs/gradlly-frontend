import { useCallback, useState } from "react";

/**
 * App hook — manages UI modal state only.
 * This is NOT a TanStack Query hook.
 * App hooks live in hooks/ (app root level) to clearly separate them
 * from feature query hooks in features/[feature]/queries/.
 */
interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const open = useCallback((): void => {
    setIsOpen(true);
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback((): void => {
    setIsOpen((previous) => !previous);
  }, []);

  return { isOpen, open, close, toggle };
}
