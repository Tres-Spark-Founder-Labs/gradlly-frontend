"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { NAV, SECTIONS } from "@/config/nav";

import { Wordmark } from "./Wordmark";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Primary navigation.
 *
 * Paper, with a hairline that appears only once the page has scrolled past the
 * header. A dark bar at the top would compete with the page's own claim, and a
 * translucent one over the same surface as the content makes the top of the
 * site its weakest part.
 *
 * The current page carries a 2px teal underline, which is the one place teal
 * appears that is not a button: an active indicator is an action's result.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  /**
   * An observer on a sentinel rather than a scroll listener: this fires twice
   * in a session instead of on every frame of every scroll.
   */
  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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
    <>
      <div id="nav-sentinel" aria-hidden className="absolute top-0 h-12 w-px" />

      <header
        className={`sticky top-0 z-50 bg-paper/95 backdrop-blur-sm transition-colors duration-200 ${
          scrolled ? "border-b border-mist" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-17 max-w-[1320px] items-center justify-between gap-6 px-5 md:px-8 lg:px-12">
          <a href="/" className="text-navy" aria-label="Gradlly, overview">
            <Wordmark />
          </a>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex list-none items-center gap-1">
              {NAV.map(({ href, label, external }) => {
                const current = external && pathname === "/gradlly-ams";
                return (
                  <li key={href}>
                    <a
                      href={href}
                      aria-current={current ? "page" : undefined}
                      className={`relative block px-3 py-5 text-body-sm transition-colors duration-[140ms] ease-out hover:text-navy ${
                        current
                          ? "font-semibold text-navy"
                          : "font-medium text-graphite"
                      }`}
                    >
                      {label}
                      {current ? (
                        <span
                          className="absolute inset-x-3 bottom-3 block h-0.5 bg-teal"
                          aria-hidden
                        />
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="/#sign-in"
              className="hidden text-body-sm font-medium text-navy transition-colors duration-[140ms] ease-out hover:text-teal sm:inline"
            >
              Sign in
            </a>
            <a
              href="/book-a-demo"
              className="hidden rounded-md bg-teal px-5 py-2.5 text-body-sm font-semibold text-paper transition-colors duration-[140ms] ease-out hover:bg-[#0c4a4d] sm:inline-block"
            >
              Book a demo
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => (open ? close() : setOpen(true))}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-10 items-center gap-2 rounded-md border border-mist px-3.5 text-body-sm font-medium text-navy transition-colors duration-[140ms] ease-out hover:border-navy xl:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {/*
          `inert` when closed, not merely hidden: a hidden panel still answers to
          find-in-page and still holds tab stops in some engines.
        */}
        <div
          id="site-menu"
          ref={panelRef}
          inert={!open}
          className={`absolute inset-x-0 top-full border-y border-mist bg-paper xl:hidden ${
            open
              ? "visible opacity-100 duration-[180ms]"
              : "invisible -translate-y-1 opacity-0 duration-[140ms]"
          } transition-[opacity,transform,visibility] ease-out`}
        >
          <ul className="list-none px-5 md:px-8">
            {[...SECTIONS, { href: "/gradlly-ams", label: "Gradlly AMS" }].map(
              ({ href, label }) => (
                <li key={href} className="border-b border-mist last:border-b-0">
                  <a
                    href={href}
                    onClick={close}
                    className="block py-4 text-heading-sm font-medium text-navy"
                  >
                    {label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      </header>
    </>
  );
}
