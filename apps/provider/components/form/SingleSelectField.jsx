"use client";

import { AlertCircle, Check, ChevronDown, Search, X } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/utils/helper";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Searchable single-select field. Matches InputField visually and integrates
 * with react-hook-form via register + setValue + value (watch) props.
 *
 * The dropdown is rendered via a portal at document.body so it is never
 * clipped by overflow:hidden/auto on any ancestor (e.g. modal scroll areas).
 */
export const SingleSelectField = memo(function SingleSelectField({
  name,
  label,
  options = [],
  register,
  setValue,
  value = "",
  error,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  searchable = true,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState({});

  const containerRef = useRef(null); // trigger wrapper — outside-click anchor
  const triggerRef = useRef(null); // button — source of getBoundingClientRect
  const dropdownRef = useRef(null); // portal root — outside-click anchor
  const searchRef = useRef(null);

  const { ref: registerRef } = register?.(name, {
    required: required ? `${label ?? "This field"} is required` : false,
  }) ?? { ref: null };

  // ── Positioning ───────────────────────────────────────────────────────────

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const estimated = 240; // search bar (48) + max list (192)
    const spaceBelow = viewportHeight - rect.bottom;
    const openUpward = spaceBelow < estimated && rect.top > spaceBelow;

    setDropdownStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
      ...(openUpward
        ? { bottom: viewportHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    });
  }, []);

  // Sync position before paint to prevent a 1-frame position flash.
  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, updatePosition]);

  // Reposition on scroll (capture = catches any nested scroller) or resize.
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("scroll", updatePosition, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", updatePosition, { passive: true });
    return () => {
      window.removeEventListener("scroll", updatePosition, { capture: true });
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  // ── Outside click ─────────────────────────────────────────────────────────

  // Must check both the trigger container AND the portal dropdown because the
  // portal is not a DOM descendant of containerRef.
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (
        !containerRef.current?.contains(e.target) &&
        !dropdownRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // ── Search focus ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen || !searchable) return;
    const rafId = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(rafId);
  }, [isOpen, searchable]);

  // ── Derived values ────────────────────────────────────────────────────────

  const selectedOption = options.find((o) => o.value === value);
  const filtered = query
    ? options.filter((o) => o.text.toLowerCase().includes(query.toLowerCase()))
    : options;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelect = (option) => {
    setValue?.(name, option.value, { shouldValidate: true });
    setIsOpen(false);
    setQuery("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setValue?.(name, "", { shouldValidate: true });
  };

  const toggleOpen = () => {
    if (!disabled) setIsOpen((v) => !v);
  };

  // ── Portal dropdown ───────────────────────────────────────────────────────

  const dropdown = (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
      role="listbox"
      aria-label={label}
    >
      {searchable && (
        <div className="border-b border-neutral-100 p-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className={cn(
                "w-full rounded-md border border-neutral-200 py-2 pl-8 pr-3 text-sm",
                "bg-white text-neutral-900 placeholder:text-neutral-400",
                "transition-colors focus:border-blue-400 focus:outline-none",
              )}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="overflow-y-auto" style={{ maxHeight: "12rem" }}>
        {filtered.length > 0 ? (
          filtered.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                className={cn(
                  "flex w-full items-center justify-between gap-2",
                  "px-3.5 py-2.5 text-left text-sm transition-colors duration-100",
                  isSelected
                    ? "bg-blue-50 text-blue-800"
                    : "text-neutral-700 hover:bg-neutral-50",
                )}
              >
                <span className="flex-1 truncate">{option.text}</span>
                {isSelected && (
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-blue-700"
                    aria-hidden
                  />
                )}
              </button>
            );
          })
        ) : (
          <div className="px-4 py-5 text-center text-sm text-neutral-400">
            {query ? "No results found" : "No options available"}
          </div>
        )}
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {/* Hidden input so RHF ref attaches for focus-on-error behaviour */}
      <input
        type="hidden"
        name={name}
        ref={registerRef}
        value={value}
        readOnly
      />

      {label && (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-danger-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {/* ── Trigger ─────────────────────────────────────────── */}
        <button
          ref={triggerRef}
          type="button"
          id={name}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
          onClick={toggleOpen}
          className={cn(
            "flex w-full items-center",
            "rounded-lg border pl-3.5 pr-10 py-2.5 text-sm text-left transition-colors duration-150",
            "bg-white focus:outline-none",
            error
              ? "border-danger-400 focus:border-danger-500"
              : isOpen
                ? "border-blue-400"
                : "border-neutral-200 hover:border-neutral-300 focus:border-blue-400",
            disabled &&
              "cursor-not-allowed bg-neutral-50 text-neutral-400 opacity-70",
          )}
        >
          <span
            className={cn(
              "flex-1 truncate text-sm",
              !selectedOption && "text-neutral-400",
            )}
          >
            {selectedOption?.text ?? placeholder}
          </span>
        </button>

        {/* ── Controls overlay ──────────────────────────────────
            pointer-events-none on the container lets clicks fall through
            to the trigger. pointer-events-auto on clear re-enables it for
            just that button (WCAG 2.1 SC 2.1.1).                         */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center gap-0.5 pr-2.5">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              className={cn(
                "pointer-events-auto rounded p-0.5",
                "text-neutral-400 transition-colors hover:text-neutral-600",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700",
              )}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-neutral-400 transition-transform duration-150",
              isOpen && "rotate-180",
            )}
            aria-hidden
          />
        </div>

        {/* ── Portal ───────────────────────────────────────────── */}
        {isOpen &&
          typeof document !== "undefined" &&
          createPortal(dropdown, document.body)}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1 flex items-start gap-1 text-xs font-normal text-danger-600"
        >
          <AlertCircle className="mt-px h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="leading-none">{error}</span>
        </p>
      )}
    </div>
  );
});

SingleSelectField.displayName = "SingleSelectField";
