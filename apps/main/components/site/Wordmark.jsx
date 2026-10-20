/**
 * The wordmark.
 *
 * Two bars, teal and brass, because the company is two products and the
 * colours are what say which is which everywhere else on the site. Set in the
 * same grotesque as everything, at the width axis, so the logo is not a
 * separate voice.
 *
 * The version this replaced set "Gradl" and "ly" in different colours, which
 * accents part of a word for no reason a reader can decode.
 */
export function Wordmark({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="16"
        height="18"
        viewBox="0 0 16 18"
        aria-hidden
        focusable="false"
        className="shrink-0"
      >
        <rect x="0" y="0" width="6" height="18" fill="var(--color-brass)" />
        <rect x="8" y="0" width="6" height="18" fill="var(--color-teal)" />
      </svg>
      <span className="wide-md text-[1.25rem] leading-none tracking-[-0.03em]">
        Gradlly
      </span>
    </span>
  );
}
