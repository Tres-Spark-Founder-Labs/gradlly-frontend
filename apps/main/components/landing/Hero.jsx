import { ProductPair } from "./ProductPair";

/**
 * content-v1.md §2, verbatim.
 *
 * One hero body for every screen size, per Decision 4. The mockup carried a
 * shorter mobile variant; two versions of the same claim is two things to keep
 * true.
 *
 * The entrance is the page's one orchestrated moment. It is pure CSS: the
 * `enter` class and a delay custom property, no client component, no
 * JavaScript. Every element holds its final box from first paint and only
 * opacity and transform change, so this cannot move the layout.
 */
export function Hero() {
  return (
    <section className="relative px-5 pb-24 pt-16 md:px-10 md:pb-32 md:pt-24 lg:px-16">
      <div className="mx-auto max-w-[1140px]">
        <h1
          className="enter font-display text-display text-navy"
          style={{ "--enter-delay": "0ms" }}
        >
          From trained to trusted.
        </h1>

        <p
          className="enter measure-lead mt-5 font-display text-lead italic text-slate"
          style={{ "--enter-delay": "110ms" }}
        >
          Skills you can prove. Workers you can trust.
        </p>

        <div
          className="enter mt-10 flex flex-col gap-10 md:mt-12 md:flex-row md:items-end md:justify-between"
          style={{ "--enter-delay": "210ms" }}
        >
          <p className="measure text-body text-slate">
            Gradlly builds two products for the UK workforce.{" "}
            <strong className="font-semibold text-navy">Continuo</strong> gives
            every worker verified skills and checks, and keeps them verified at
            every job.{" "}
            <strong className="font-semibold text-navy">Gradlly AMS</strong>{" "}
            runs apprenticeships, with a verified Passport for every apprentice.
            Use either on its own, or both together.
          </p>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href="#book-a-demo"
              className="rounded-control bg-navy px-6 py-3.5 text-center text-small font-semibold text-paper transition-colors duration-[140ms] ease-out hover:bg-[#0d1a2c]"
            >
              Book a demo
            </a>
            <a
              href="#how-it-works"
              className="rounded-control border border-navy px-6 py-3.5 text-center text-small font-semibold text-navy transition-colors duration-[140ms] ease-out hover:bg-navy hover:text-paper"
            >
              See how it works
            </a>
          </div>
        </div>

        <ProductPair />
      </div>
    </section>
  );
}
