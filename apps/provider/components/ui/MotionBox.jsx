"use client";

import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/utils/helper";

// ─── Animation presets ────────────────────────────────────────────────────────

const PRESETS = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  },
  slideDown: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  /**
   * Element travels leftward into its resting position (enters from the right).
   * Exit mirrors the entrance — element departs to the right.
   */
  slideLeft: {
    initial: { opacity: 0, x: 8 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 8 },
  },
  /**
   * Element travels rightward into its resting position (enters from the left).
   * Exit mirrors the entrance — element departs to the left.
   */
  slideRight: {
    initial: { opacity: 0, x: -8 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -8 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  popUp: {
    initial: { opacity: 0, scale: 0.96, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.97, y: 6 },
  },
  /**
   * Element grows into view from a smaller size (starts small → full scale).
   * Exit contracts back to the smaller scale so the motion is symmetric.
   * Previously the exit was `scale: 1` — no motion. Fixed.
   */
  zoomIn: {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.85 },
  },
  /**
   * Element shrinks into view from a larger size (starts large → full scale).
   * Exit expands back slightly so the motion is symmetric.
   * Previously this was behaving identically to zoomIn on enter. Fixed.
   */
  zoomOut: {
    initial: { opacity: 0, scale: 1.15 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.15 },
  },
  /**
   * Stagger container preset — apply to a wrapping list element paired with
   * `staggerChildren` and `delayChildren` on the transition. Individual child
   * items should use any other preset (e.g. `slideUp`, `fade`).
   *
   * Usage:
   *   <MotionBox as="ul" variant="stagger">
   *     {items.map(item => (
   *       <MotionBox key={item.id} as="li" variant="slideUp">…</MotionBox>
   *     ))}
   *   </MotionBox>
   */
  stagger: {
    initial: { opacity: 1 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
    },
    exit: { opacity: 1 },
  },
};

// ─── Re-export for coordinated multi-element sequences ────────────────────────

export { AnimatePresence };

// ─── MotionBox ────────────────────────────────────────────────────────────────

/*
 * @param {boolean|undefined}  props.show          - self-contained visibility gate
 * @param {keyof PRESETS}      props.variant       - preset name (default "fade")
 * @param {number}             props.duration      - enter duration in seconds (default 0.22)
 * @param {number}             props.delay         - enter delay in seconds (default 0)
 * @param {number}             props.exitDuration  - exit duration; defaults to 75% of `duration`
 * @param {Array|string}       props.ease          - easing array or named curve (default spring-out)
 * @param {object}             props.initial       - custom initial state — overrides preset
 * @param {object}             props.animate       - custom animate state — overrides preset
 * @param {object}             props.exit          - custom exit state — overrides preset
 * @param {string}             props.as            - underlying HTML tag (default "div")
 * @param {string}             props.className
 * @param {object}             props.style
 * @param {string}             props.presenceMode  - AnimatePresence mode: sync | wait | popLayout
 * @param {React.ReactNode}    props.children
 */
export function MotionBox({
  ref,
  show,
  variant = "fade",
  duration = 0.22,
  delay = 0,
  exitDuration,
  ease = [0.16, 1, 0.3, 1],
  initial,
  animate,
  exit,
  as = "div",
  className,
  style,
  presenceMode = "sync",
  children,
  ...rest
}) {
  const preset = PRESETS[variant] ?? PRESETS.fade;
  const MotionEl = motion[as] ?? motion.div;

  const enterTransition = { duration, delay, ease };
  const exitTransition = { duration: exitDuration ?? duration * 0.75, ease };

  const motionProps = {
    ref,
    initial: initial ?? preset.initial,
    animate: animate ?? preset.animate,
    exit: { ...(exit ?? preset.exit), transition: exitTransition },
    transition: enterTransition,
    className: cn(className),
    style,
    ...rest,
  };

  if (show !== undefined) {
    return (
      <AnimatePresence mode={presenceMode}>
        {show && <MotionEl {...motionProps}>{children}</MotionEl>}
      </AnimatePresence>
    );
  }

  return <MotionEl {...motionProps}>{children}</MotionEl>;
}
