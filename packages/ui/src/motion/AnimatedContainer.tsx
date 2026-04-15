"use client";

import { cn } from "@gradlly/utils";

import type { PropsWithChildren } from "react";

type AnimationVariant =
  | "fade"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scale"
  | "stagger";

interface AnimatedContainerProps extends PropsWithChildren {
  variant?: AnimationVariant;
  duration?: number;
  delay?: number;
  easing?: string;
  className?: string;
}

const initialStyles: Record<AnimationVariant, string> = {
  fade: "opacity-0",
  slideUp: "opacity-0 translate-y-2",
  slideDown: "opacity-0 -translate-y-2",
  slideLeft: "opacity-0 translate-x-2",
  slideRight: "opacity-0 -translate-x-2",
  scale: "opacity-0 scale-95",
  stagger: "opacity-0 translate-y-1",
};

export function AnimatedContainer({
  children,
  variant = "fade",
  duration = 0.25,
  delay = 0,
  easing = "cubic-bezier(0.4, 0, 0.2, 1)",
  className,
}: AnimatedContainerProps) {
  return (
    <div
      className={cn(
        "animate-[dashboard-enter] [animation-fill-mode:forwards] transition-all will-change-transform",
        initialStyles[variant],
        className,
      )}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        animationTimingFunction: easing,
      }}
    >
      {children}
    </div>
  );
}
