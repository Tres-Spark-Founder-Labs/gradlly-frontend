import { Section, SectionHead } from "./Section";

/** content-v1.md §8, verbatim. The parenthesised product becomes the row's tag. */
const AUDIENCES = [
  {
    who: "Employers and agencies in regulated work",
    detail:
      "Hire and deploy on verified skills, onboard without repeating checks, and be audit-ready every day.",
    products: ["Continuo"],
  },
  {
    who: "Training providers",
    detail:
      "Run delivery and compliance in one place, and send learners out with proof employers trust.",
    products: ["Gradlly AMS"],
  },
  {
    who: "Levy-paying employers and SMEs",
    detail:
      "See every apprentice's progress, sign off reviews, and put unspent levy to work.",
    products: ["Gradlly AMS"],
  },
  {
    who: "Apprentices and workers",
    detail:
      "A free, verified record of your skills and checks that you own and share on your terms.",
    products: ["Passport", "Continuo"],
  },
];

const BAR = {
  Continuo: "bg-teal",
  "Gradlly AMS": "bg-brass",
  Passport: "bg-brass",
};

const INK = {
  Continuo: "text-teal",
  "Gradlly AMS": "text-brass-ink",
  Passport: "text-brass-ink",
};

/**
 * Four rows, not four cards.
 *
 * Each row carries a colour bar for the product it belongs to, which is the
 * colour rule doing real work rather than being applied for consistency: the
 * last row has two bars because the copy names two products, and that is the
 * fastest way to say "this one audience uses both".
 */
export function WhoItsFor() {
  return (
    <Section id="who-its-for" labelledBy="who-its-for-heading">
      <SectionHead id="who-its-for-heading">
        Built for each side of the journey.
      </SectionHead>

      <ul className="mt-12 list-none md:mt-16">
        {AUDIENCES.map(({ who, detail, products }) => (
          <li
            key={who}
            className="border-b border-rule py-6 first:border-t md:grid md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-10"
          >
            <div className="flex gap-3">
              <span className="flex shrink-0 gap-1" aria-hidden>
                {products.map((product) => (
                  <span
                    key={product}
                    className={`block w-1 rounded-full ${BAR[product]}`}
                  />
                ))}
              </span>
              <p className="text-small font-semibold text-navy">{who}</p>
            </div>

            <div className="mt-2 pl-7 md:mt-0 md:pl-0">
              <p className="text-small text-slate">{detail}</p>
              <p className="mt-1.5 text-meta font-medium">
                {products.map((product, index) => (
                  <span key={product} className={INK[product]}>
                    {index > 0 ? ", " : ""}
                    {product}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
