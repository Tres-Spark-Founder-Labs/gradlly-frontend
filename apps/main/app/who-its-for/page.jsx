import { Band, PageHeader } from "@/components/site/PageHeader";
import { pageByHref } from "@/config/site.config";
import { createPageSeo } from "@/utils/metadata";

const page = pageByHref("/who-its-for");

export const metadata = createPageSeo({
  title: "Who it's for",
  description:
    "Employers and agencies in regulated work, training providers, levy-paying employers and SMEs, and apprentices and workers.",
  path: "/who-its-for",
});

/** content-v1.md §8, verbatim. The parenthesised product becomes the tag. */
const AUDIENCES = [
  {
    number: "01",
    who: "Employers and agencies in regulated work",
    detail:
      "Hire and deploy on verified skills, onboard without repeating checks, and be audit-ready every day.",
    products: [{ name: "Continuo", href: "/continuo", mark: "teal" }],
  },
  {
    number: "02",
    who: "Training providers",
    detail:
      "Run delivery and compliance in one place, and send learners out with proof employers trust.",
    products: [{ name: "Gradlly AMS", href: "/gradlly-ams", mark: "brass" }],
  },
  {
    number: "03",
    who: "Levy-paying employers and SMEs",
    detail:
      "See every apprentice's progress, sign off reviews, and put unspent levy to work.",
    products: [{ name: "Gradlly AMS", href: "/gradlly-ams", mark: "brass" }],
  },
  {
    number: "04",
    who: "Apprentices and workers",
    detail:
      "A free, verified record of your skills and checks that you own and share on your terms.",
    products: [
      { name: "Passport", href: "/apprenticeship-passport", mark: "brass" },
      { name: "Continuo", href: "/continuo", mark: "teal" },
    ],
  },
];

const BAR = { teal: "bg-teal", brass: "bg-brass" };
const INK = { teal: "text-teal", brass: "text-brass-ink" };

/**
 * Four rows, not four cards.
 *
 * The last row carries two colour bars because the copy names two products,
 * which is the colour rule doing real work rather than being applied for
 * consistency: two bars is the fastest way to say "this audience uses both".
 */
export default function WhoItsForPage() {
  return (
    <>
      <PageHeader {...page}>
        <p className="measure text-body text-slate">
          Four audiences and two products. The colour against each row is the
          product it belongs to, which is the same colour that marks it
          everywhere else on this site.
        </p>
      </PageHeader>

      <Band id="audiences">
        <ul className="list-none">
          {AUDIENCES.map(({ number, who, detail, products }) => (
            <li
              key={who}
              className="grid gap-4 border-t border-rule py-8 last:border-b md:grid-cols-[auto_minmax(0,4fr)_minmax(0,6fr)] md:gap-10 md:py-10"
            >
              <p className="text-ref text-slate">{number}</p>

              <div className="flex gap-4">
                <span className="flex shrink-0 gap-1" aria-hidden>
                  {products.map(({ name, mark }) => (
                    <span key={name} className={`block w-1 ${BAR[mark]}`} />
                  ))}
                </span>
                <h2 className="wide-md text-subhead text-navy">{who}</h2>
              </div>

              <div>
                <p className="text-body text-slate">{detail}</p>
                <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  {products.map(({ name, href, mark }) => (
                    <a
                      key={name}
                      href={href}
                      className={`text-ref font-semibold ${INK[mark]} underline decoration-2 underline-offset-4 transition-colors duration-[120ms] ease-out hover:text-navy`}
                    >
                      {name}
                    </a>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="navy">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="text-lead text-white/80">
            Next: see it with your own programme.
          </p>
          <a
            href="/book-a-demo"
            className="bg-white px-6 py-3.5 text-small font-semibold text-navy transition-colors duration-[140ms] ease-out hover:bg-paper"
          >
            07 Book a demo
          </a>
        </div>
      </Band>
    </>
  );
}
