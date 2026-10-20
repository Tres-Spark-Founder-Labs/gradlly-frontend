/**
 * The wordmark.
 *
 * The mark is two bars, teal and brass, which are the page's own two product
 * colours and the two ends of the spine. So the logo states the positioning
 * ("two products, each works on its own") in the same terms the rest of the
 * page uses, rather than being a separate piece of decoration.
 *
 * The name itself is set plainly. The version this replaced rendered
 * "Gradl" + "ly" with the last two letters in a different colour, which is
 * accenting part of a word for no reason the reader can decode.
 */
export function Wordmark({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="18"
        height="20"
        viewBox="0 0 18 20"
        aria-hidden
        focusable="false"
        className="shrink-0"
      >
        <rect x="0" y="2" width="7" height="16" fill="var(--color-brass)" />
        <rect x="9" y="2" width="7" height="16" fill="var(--color-teal)" />
      </svg>
      <span className="font-display text-[1.375rem] font-medium leading-none tracking-[-0.015em]">
        Gradlly
      </span>
    </span>
  );
}
