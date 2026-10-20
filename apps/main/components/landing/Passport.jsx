import { Section } from "./Section";

/** content-v1.md §6, verbatim. */
const POINTS = [
  "KSBs, off-the-job hours and the EPA result, each showing who confirmed it and when",
  "Created by AMS during delivery, so there's nothing extra for providers to do",
  "Shared by the apprentice with one link: full or partial, time-limited or revocable",
  "Kept after completion, and can be carried into Continuo when they move into work",
];

/**
 * The Passport is a brass plate, as the one thing in this section.
 *
 * It belongs to Gradlly AMS, so the spine stays brass and does not change
 * colour here: this is a continuation of the section above, not a third
 * product. White ink, because navy on brass is 2.98:1, which fails even the
 * large-text threshold and rounds to 3.0 where a careless check would pass it.
 */
export function Passport() {
  return (
    <Section id="passport" tone="brass" labelledBy="passport-heading">
      <div className="on-plate rounded-plate bg-brass p-7 md:p-12">
        <p className="text-meta font-medium text-white/75">
          Included with Gradlly AMS
        </p>

        <h2
          id="passport-heading"
          className="measure mt-3 font-display text-section text-white"
        >
          The Apprenticeship Passport. What the apprentice keeps.
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <p className="text-body text-white/90">
            Every apprentice leaves with a verified record of what they
            achieved. It&rsquo;s built automatically as they train, owned by
            them, and free for them.
          </p>
          <ul className="list-none space-y-4">
            {POINTS.map((point) => (
              <li
                key={point}
                className="border-t border-white/25 pt-3 text-small text-white/90"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
