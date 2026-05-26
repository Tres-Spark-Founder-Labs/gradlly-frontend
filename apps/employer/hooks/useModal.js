"use client";

import { useCallback, useState } from "react";

/**
 * Controls the open/close state of any modal.
 *
 * Usage:
 *   const { isOpen, open, close, toggle } = useModal();
 *
 *   <button onClick={open}>Open</button>
 *   <Modal open={isOpen} onClose={close}>...</Modal>
 *
 * Each call creates independent state — call it once per modal instance.
 */
export function useModal(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
}
