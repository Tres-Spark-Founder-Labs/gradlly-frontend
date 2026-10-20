"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { PAGES } from "@/config/site.config";

import { Wordmark } from "./Wordmark";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A navy band across the top of every page.
 *
 * It is dark because the content below it is white: the shell and the content
 * are opposite, so the reader always knows which is which. The previous
 * attempt had a near-transparent bar over the same paper as the page, which
 * made the top of the site the weakest part of it.
 *
 * Navigation shows the page number beside the name. With seven pages that is
 * real information, and it tells someone arriving on page five from a search
 * result what they have not read.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    panel?.querySelector(FOCUSABLE)?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const items = [...panel.querySelectorAll(FOCUSABLE)];
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
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <header className="on-dark sticky top-0 z-50 bg-navy text-white">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 md:px-8 lg:px-12">
        <a href="/" className="text-white" aria-label="Gradlly, overview">
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex list-none items-center">
            {PAGES.map(({ number, href, navLabel }) => {
              const current = pathname === href;
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-baseline gap-1.5 px-3 py-2 text-small transition-colors duration-[120ms] ease-out hover:text-white ${
                      current ? "text-white" : "text-white/65"
                    }`}
                  >
                    <span
                      className={`text-ref ${current ? "text-white/70" : "text-white/40"}`}
                    >
                      {number}
                    </span>
                    <span className={current ? "font-medium" : ""}>
                      {navLabel}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <a
            href="/#sign-in"
            className="hidden text-small text-white/80 transition-colors duration-[120ms] ease-out hover:text-white sm:inline"
          >
            Sign in
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex h-9 items-center gap-2 border border-white/30 px-3 text-small text-white transition-colors duration-[140ms] ease-out hover:border-white/60 xl:hidden"
          >
            <span>{open ? "Close" : "Pages"}</span>
            <span className="text-ref text-white/50">{PAGES.length}</span>
          </button>
        </div>
      </div>

      {/*
        The menu is a list of the seven pages with their numbers, which is the
        same thing the desktop nav shows. `inert` when closed, not merely
        hidden: a hidden panel still answers to find-in-page and still holds tab
        stops in some engines.
      */}
      <div
        id="site-menu"
        ref={panelRef}
        inert={!open}
        className={`absolute inset-x-0 top-full border-t border-rule-dark bg-navy-deep xl:hidden ${
          open
            ? "visible opacity-100 duration-[180ms]"
            : "invisible -translate-y-1 opacity-0 duration-[140ms]"
        } transition-[opacity,transform,visibility] ease-out`}
      >
        <ul className="list-none px-5 py-2 md:px-8">
          {PAGES.map(({ number, href, label }) => {
            const current = pathname === href;
            return (
              <li
                key={href}
                className="border-b border-rule-dark last:border-b-0"
              >
                <a
                  href={href}
                  onClick={close}
                  aria-current={current ? "page" : undefined}
                  className="flex items-baseline gap-4 py-3.5"
                >
                  <span className="text-ref text-white/40">{number}</span>
                  <span
                    className={`text-subhead ${current ? "text-white" : "text-white/75"}`}
                  >
                    {label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
