"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Wordmark } from "./Wordmark";

/**
 * content-v1.md §1. Five items, in that order.
 *
 * "Book a demo" is a button there and is treated as one here. "Sign in" is
 * Decision 2's addition: a quiet text link before it, going to the sign-in
 * list in the footer rather than to a dropdown. There are four portals and
 * content-v1.md names none of them in the nav, so one link to one place that
 * lists all four beats a menu that has to trap focus.
 */
const LINKS = [
  { href: "#continuo", label: "Continuo" },
  { href: "#gradlly-ams", label: "Gradlly AMS" },
  { href: "#passport", label: "Apprenticeship Passport" },
  { href: "#how-it-works", label: "How it works" },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  /**
   * The bottom hairline appears only once the page has moved, so the nav sits
   * flush with the hero on arrival and separates itself when it starts
   * overlapping content.
   *
   * An IntersectionObserver on a sentinel rather than a scroll listener: this
   * fires twice in a session instead of on every frame of every scroll.
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
    // Focus goes back where it came from, or a keyboard user is left at the
    // top of the document with no idea where they were.
    toggleRef.current?.focus();
  }, []);

  // Focus trap, Escape, and the scroll lock. One effect, because all three
  // start and stop together.
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
        className={`sticky top-0 z-50 bg-paper/92 backdrop-blur-md transition-colors duration-200 ${
          scrolled ? "border-b border-rule" : "border-b border-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-18 max-w-[1140px] items-center justify-between px-5 md:px-10 lg:px-16"
        >
          <a
            href="#main-content"
            className="rounded-[2px] text-navy"
            aria-label="Gradlly, home"
          >
            <Wordmark />
          </a>

          <ul className="hidden list-none items-center gap-7 lg:flex">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-small font-medium text-slate underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors duration-[120ms] ease-out hover:text-navy hover:decoration-teal focus-visible:text-navy focus-visible:decoration-teal"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <a
              href="#sign-in"
              className="hidden text-small font-medium text-navy underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors duration-[120ms] ease-out hover:decoration-teal focus-visible:decoration-teal md:inline"
            >
              Sign in
            </a>
            <a
              href="#book-a-demo"
              className="hidden rounded-control bg-navy px-5 py-2.5 text-small font-semibold text-paper transition-colors duration-[140ms] ease-out hover:bg-[#0d1a2c] md:inline-block"
            >
              Book a demo
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => (open ? close() : setOpen(true))}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-10 w-10 items-center justify-center rounded-control text-navy lg:hidden"
            >
              <span className="sr-only">
                {open ? "Close menu" : "Open menu"}
              </span>
              <MenuGlyph open={open} />
            </button>
          </div>
        </nav>

        {/*
          A sheet below the bar rather than a full-screen takeover, so the
          wordmark and the close control stay exactly where the toggle was.
          `inert` when closed, not merely hidden: a hidden panel still answers
          to find-in-page and still holds tab stops in some engines.
        */}
        <div
          id="mobile-menu"
          ref={panelRef}
          inert={!open}
          className={`absolute inset-x-0 top-full origin-top border-b border-rule bg-paper lg:hidden ${
            open
              ? "visible opacity-100 duration-[180ms] ease-[cubic-bezier(.2,.7,.2,1)]"
              : "invisible -translate-y-2 opacity-0 duration-[140ms] ease-in"
          } transition-[opacity,transform,visibility]`}
        >
          <ul className="list-none px-5 md:px-10">
            {[...LINKS, { href: "#sign-in", label: "Sign in" }].map(
              ({ href, label }) => (
                <li key={href} className="border-b border-rule last:border-b-0">
                  <a
                    href={href}
                    onClick={close}
                    className="block py-4 font-display text-subhead text-navy"
                  >
                    {label}
                  </a>
                </li>
              ),
            )}
          </ul>
          <div className="px-5 pb-5 md:px-10">
            <a
              href="#book-a-demo"
              onClick={close}
              className="block rounded-control bg-navy px-5 py-3.5 text-center text-small font-semibold text-paper"
            >
              Book a demo
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

/** Three rules that become two on open. Drawn, not a font icon. */
function MenuGlyph({ open }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      aria-hidden
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        className="transition-transform duration-[180ms] ease-[cubic-bezier(.2,.7,.2,1)]"
      >
        <line
          x1="3"
          y1={open ? 11 : 6}
          x2="19"
          y2={open ? 11 : 6}
          style={{ transformOrigin: "center", rotate: open ? "45deg" : "0deg" }}
          className="transition-[rotate,y1,y2] duration-[180ms]"
        />
        <line x1="3" y1="11" x2="19" y2="11" opacity={open ? 0 : 1} />
        <line
          x1="3"
          y1={open ? 11 : 16}
          x2="19"
          y2={open ? 11 : 16}
          style={{
            transformOrigin: "center",
            rotate: open ? "-45deg" : "0deg",
          }}
          className="transition-[rotate,y1,y2] duration-[180ms]"
        />
      </g>
    </svg>
  );
}
