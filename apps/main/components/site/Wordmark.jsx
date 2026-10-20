/**
 * The wordmark.
 *
 * Two bars, brass then teal: the company is two products, and those are the
 * colours that identify them everywhere else on the site. Set in the same face
 * as everything, so the logo is not a separate voice.
 *
 * The version this replaced set "Gradl" and "ly" in different colours, which
 * accents part of a word for no reason a reader can decode.
 */
export function Wordmark({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="15"
        height="17"
        viewBox="0 0 15 17"
        aria-hidden
        focusable="false"
        className="shrink-0"
      >
        <rect x="0" y="0" width="6" height="17" fill="var(--color-brass)" />
        <rect x="9" y="0" width="6" height="17" fill="var(--color-teal)" />
      </svg>
      <span className="text-[1.1875rem] font-semibold leading-none tracking-[-0.03em]">
        Gradlly
      </span>
    </span>
  );
}
