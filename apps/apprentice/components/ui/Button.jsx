"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { forwardRef } from "react";

import { cn } from "@/utils/helper";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
//
//   Green    #1e6b3a  dark green (solid bg / outline text+border)
//            #175430  hover dark
//            #eaf5ee  neutral bg (very light green tint)
//            #d9eede  neutral hover
//
//   Yellow   #b07e00  dark yellow/amber (readable solid)
//            #906800  hover dark
//            #c9960a  outline border
//            #8a6300  outline text
//            #fdf5d6  neutral bg
//            #f7edbe  neutral hover
//
//   Black    #2a2a2a  lighter-black (not pure black)
//            #1a1a1a  hover dark
//            #f2f2f2  neutral bg
//            #e8e8e8  neutral hover
// ─────────────────────────────────────────────────────────────────────────────

const VARIANTS = {
  // ── Green ──────────────────────────────────────────────────────────────────
  green: {
    solid:
      "bg-[#1e6b3a] text-white border-[#1e6b3a] " +
      "hover:bg-[#175430] hover:border-[#175430] active:bg-[#124428] " +
      "focus-visible:ring-[#1e6b3a]",

    outline:
      "bg-transparent text-[#1e6b3a] border-[#1e6b3a] " +
      "hover:bg-[#f0faf3] active:bg-[#e1f5e8] " +
      "focus-visible:ring-[#1e6b3a]",

    neutral:
      "bg-[#eaf5ee] text-[#1e6b3a] border-transparent " +
      "hover:bg-[#d9eede] active:bg-[#c8e6cf] " +
      "focus-visible:ring-[#1e6b3a]",
  },

  // ── Yellow ─────────────────────────────────────────────────────────────────
  yellow: {
    solid:
      "bg-[#b07e00] text-white border-[#b07e00] " +
      "hover:bg-[#906800] hover:border-[#906800] active:bg-[#725200] " +
      "focus-visible:ring-[#b07e00]",

    outline:
      "bg-transparent text-[#8a6300] border-[#c9960a] " +
      "hover:bg-[#fdf8e6] active:bg-[#faf0c8] " +
      "focus-visible:ring-[#b07e00]",

    neutral:
      "bg-[#fdf5d6] text-[#7a5800] border-transparent " +
      "hover:bg-[#f7edbe] active:bg-[#f0e3a4] " +
      "focus-visible:ring-[#b07e00]",
  },

  // ── Black ──────────────────────────────────────────────────────────────────
  black: {
    solid:
      "bg-[#2a2a2a] text-white border-[#2a2a2a] " +
      "hover:bg-[#1a1a1a] hover:border-[#1a1a1a] active:bg-[#000] " +
      "focus-visible:ring-[#2a2a2a]",

    outline:
      "bg-transparent text-[#2a2a2a] border-[#2a2a2a] " +
      "hover:bg-[#f5f5f5] active:bg-[#ebebeb] " +
      "focus-visible:ring-[#2a2a2a]",

    neutral:
      "bg-[#f2f2f2] text-[#2a2a2a] border-transparent " +
      "hover:bg-[#e8e8e8] active:bg-[#dcdcdc] " +
      "focus-visible:ring-[#2a2a2a]",
  },
};

const SIZE = {
  xs: "h-8   px-3   text-xs  gap-1",
  sm: "h-9   px-3.5 text-sm  gap-1.5",
  md: "h-11  px-5   text-sm  gap-2",
  lg: "h-12  px-6   text-base gap-2",
  xl: "h-14  px-7   text-base gap-2.5",
  // zero-padding — for inline underline links that inherit surrounding font size
  none: "h-auto px-0 py-0 text-[length:inherit] gap-1",
};

const ICON_SIZE = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-4",
  lg: "size-[18px]",
  xl: "size-5",
  none: "size-[1em]",
};

// icon-only square overrides
const ICON_ONLY_SIZE = {
  xs: "w-8   px-0",
  sm: "w-9   px-0",
  md: "w-11  px-0",
  lg: "w-12  px-0",
  xl: "w-14  px-0",
};

const BASE =
  "inline-flex items-center justify-center font-medium leading-none tracking-tight " +
  "rounded-lg border transition-all duration-150 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-40 " +
  "select-none active:scale-[0.97]";

function buildClasses({
  color,
  variant,
  size,
  iconOnly,
  fullWidth,
  className,
}) {
  const variantClass = VARIANTS[color]?.[variant] ?? VARIANTS.green.solid;
  const sizeClass = SIZE[size] ?? SIZE.md;
  const iconClass = iconOnly ? (ICON_ONLY_SIZE[size] ?? ICON_ONLY_SIZE.md) : "";
  const widthClass = fullWidth ? "w-full" : "";
  return cn(BASE, variantClass, sizeClass, iconClass, widthClass, className);
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon slot
// ─────────────────────────────────────────────────────────────────────────────

function IconSlot({ children, size = "md" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        ICON_SIZE[size] ?? ICON_SIZE.md,
      )}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner content — shared between <button> and <a>
// ─────────────────────────────────────────────────────────────────────────────

function ButtonInner({ children, startIcon, endIcon, loading, size }) {
  const spinnerSize = ICON_SIZE[size] ?? ICON_SIZE.md;

  if (loading) {
    return (
      <>
        <Loader2
          aria-hidden
          className={cn(spinnerSize, "shrink-0 animate-spin")}
          strokeWidth={2}
        />
        {children !== null && <span className="truncate">{children}</span>}
      </>
    );
  }

  return (
    <>
      {startIcon && <IconSlot size={size}>{startIcon}</IconSlot>}
      {children !== null && <span className="truncate">{children}</span>}
      {endIcon && <IconSlot size={size}>{endIcon}</IconSlot>}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Polymorphic button component — renders a <button>, Next.js <Link>,
 * or plain <a> depending on the `href` prop.
 *
 * @param {object}  props
 * @param {'green'|'yellow'|'black'}          [props.color='green']
 * @param {'solid'|'outline'|'neutral'}      [props.variant='solid']
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'none'}      [props.size='md']  'none' = zero-padding inline link
 * @param {boolean}         [props.fullWidth=false]
 * @param {boolean}         [props.iconOnly=false]
 * @param {React.ReactNode} [props.startIcon]
 * @param {React.ReactNode} [props.endIcon]
 * @param {boolean}         [props.loading=false]
 * @param {string}          [props.href]           Renders <Link> or <a>
 * @param {string}          [props.target]
 * @param {string}          [props.rel]
 * @param {'button'|'submit'|'reset'} [props.type='button']
 * @param {boolean}         [props.disabled=false]
 * @param {string}          [props.className]
 * @param {Function}        [props.onClick]
 * @param {React.ReactNode} props.children
 */
const Button = forwardRef(function Button(
  {
    children,
    color = "green",
    variant = "solid",
    size = "md",
    fullWidth = false,
    iconOnly = false,
    startIcon,
    endIcon,
    loading = false,
    href,
    target,
    rel,
    type = "button",
    disabled = false,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const classes = buildClasses({
    color,
    variant,
    size,
    iconOnly,
    fullWidth,
    className,
  });
  const innerProps = { children, startIcon, endIcon, loading, size };
  const isDisabled = disabled || loading;

  // ── Link ──────────────────────────────────────────────────────────────────
  if (href) {
    const isExternal = /^(https?:)?\/\//.test(href);
    const computedRel =
      rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

    const linkProps = {
      ref,
      href,
      target,
      rel: computedRel,
      className: classes,
      onClick,
      ...rest,
    };

    return isExternal ? (
      <a {...linkProps}>
        <ButtonInner {...innerProps} />
      </a>
    ) : (
      <Link {...linkProps}>
        <ButtonInner {...innerProps} />
      </Link>
    );
  }

  // ── Button ────────────────────────────────────────────────────────────────
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={classes}
      onClick={isDisabled ? undefined : onClick}
      {...rest}
    >
      <ButtonInner {...innerProps} />
    </button>
  );
});

Button.displayName = "Button";
export default Button;
