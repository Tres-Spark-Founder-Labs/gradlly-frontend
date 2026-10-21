import Image from "next/image";

/**
 * A screenshot of the real product.
 *
 * ── WHAT THESE ARE ──────────────────────────────────────────────────────────
 *
 * The actual Gradlly portals, captured from the running application, not
 * mockups and not illustrations. Every frame is cropped to a region that shows
 * product structure and carries no personal identity: the demo environment's
 * apprentice and employer names, work email addresses and training provider
 * names are all outside the crop, and the one that survived a crop was painted
 * out. Nothing is blurred, because a blurred name on a marketing page
 * advertises that there was a name there.
 *
 * ── THE CAPTION IS NOT OPTIONAL ─────────────────────────────────────────────
 *
 * The interfaces still show figures, because a dashboard with no numbers in it
 * is not a dashboard. Those figures come from a demonstration environment, and
 * every frame says so underneath. That is the difference between a screenshot
 * and a claim, and it is the whole reason the invented figures were stripped
 * from this site earlier: not that numbers are forbidden, but that a number
 * presented as a customer's result when it is not one is a lie.
 */
export function Screenshot({
  name,
  alt,
  width,
  height,
  caption,
  priority = false,
  className = "",
}) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-card border border-hairline bg-linen">
        <Image
          src={`/product/${name}-1600.webp`}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority={priority}
          /* Not lazy above the fold and lazy everywhere else is the default;
             `priority` is passed only where a frame is in the first screen. */
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-caption text-ink-muted">
        {caption}{" "}
        <span className="text-ink-muted/80">
          Demonstration environment, not customer data.
        </span>
      </figcaption>
    </figure>
  );
}
