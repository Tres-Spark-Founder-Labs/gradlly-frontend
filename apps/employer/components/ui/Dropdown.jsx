"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/helper";

export function Dropdown({ trigger, children, align = "right", className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handlePointer(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={() => setOpen((v) => !v)} className="inline-flex">
        {typeof trigger === "function" ? trigger({ open }) : trigger}
      </div>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full z-50 mt-2 min-w-50 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1",
            "shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
            "animate-[slide-up_150ms_cubic-bezier(0.16,1,0.3,1)_forwards]",
            align === "right" && "right-0",
            align === "left" && "left-0",
            className,
          )}
        >
          {typeof children === "function"
            ? children({ close: () => setOpen(false) })
            : children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  onClick,
  href,
  icon: Icon,
  children,
  variant = "default",
  className,
}) {
  const base = cn(
    "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-100 focus-visible:outline-none focus-visible:bg-neutral-100",
    variant === "danger"
      ? "text-danger-600 hover:bg-danger-50"
      : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900",
    className,
  );

  if (href) {
    return (
      <Link href={href} role="menuitem" className={base} onClick={onClick}>
        {Icon && (
          <Icon
            aria-hidden="true"
            className="size-3.5 shrink-0 text-neutral-400"
          />
        )}
        {children}
      </Link>
    );
  }

  return (
    <button role="menuitem" onClick={onClick} className={base}>
      {Icon && (
        <Icon
          aria-hidden="true"
          className="size-3.5 shrink-0 text-neutral-400"
        />
      )}
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div role="separator" className="my-1 h-px bg-neutral-100" />;
}
