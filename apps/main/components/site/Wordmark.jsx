/**
 * The wordmark.
 *
 * Two bars, terracotta then olive: Gradlly is two products and those are the
 * colours that identify them everywhere else on the site. Set in the display
 * serif, which is the one interface element allowed to use it, because a
 * wordmark is a drawn thing rather than a label.
 */
export function Wordmark({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width="14"
        height="18"
        viewBox="0 0 14 18"
        aria-hidden
        focusable="false"
        className="shrink-0"
      >
        <rect
          x="0"
          y="0"
          width="5"
          height="18"
          rx="2.5"
          fill="var(--color-terracotta)"
        />
        <rect
          x="8"
          y="0"
          width="5"
          height="18"
          rx="2.5"
          fill="var(--color-olive)"
        />
      </svg>
      <span className="display text-[1.375rem] leading-none tracking-[-0.03em]">
        Gradlly
      </span>
    </span>
  );
}
