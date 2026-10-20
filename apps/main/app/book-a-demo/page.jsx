import { DemoForm } from "@/components/site/DemoForm";
import { PageHeader } from "@/components/site/PageHeader";
import { Band } from "@/components/site/ui";
import { pageByHref } from "@/config/site.config";
import { createPageSeo } from "@/utils/metadata";

const page = pageByHref("/book-a-demo");

export const metadata = createPageSeo({
  title: "Book a demo",
  description:
    "Whether you hire into regulated roles or run apprenticeships, we'll walk you through the parts of Gradlly that matter to you.",
  path: "/book-a-demo",
});

export default function BookADemoPage() {
  return (
    <>
      <PageHeader {...page}>
        <p className="measure text-body text-graphite">
          Whether you hire into regulated roles or run apprenticeships,
          we&rsquo;ll walk you through the parts of Gradlly that matter to you.
        </p>
      </PageHeader>

      <Band id="request">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-20">
          <DemoForm />

          <div className="order-first lg:order-none">
            <div className="h-0.5 w-12 bg-navy" aria-hidden />
            <h2 className="font-semibold mt-5 max-w-[18ch] text-heading-lg text-navy">
              What a demo covers.
            </h2>
            <ul className="mt-8 list-none">
              {[
                [
                  "Continuo",
                  "How a skill is confirmed, what the worker's record looks like, and how an evidence pack comes out of it.",
                ],
                [
                  "Gradlly AMS",
                  "Enrolment through to gateway, with the ILR and funding side in the same place as delivery.",
                ],
                [
                  "The Passport",
                  "What an apprentice leaves with, and how it is shared.",
                ],
              ].map(([name, detail]) => (
                <li
                  key={name}
                  className="border-t border-mist py-5 last:border-b"
                >
                  <p className="font-semibold text-heading-sm text-navy">
                    {name}
                  </p>
                  <p className="mt-1.5 text-body-sm text-graphite">{detail}</p>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-body-sm text-graphite">
              Or email us at{" "}
              <span
                className="font-semibold text-navy"
                title="Placeholder. Recorded in docs/marketing/LAUNCH-CHECKLIST.md."
              >
                [CONTACT EMAIL]
              </span>
            </p>
          </div>
        </div>
      </Band>
    </>
  );
}
