import type { DocContentSection } from '@/types/docs';

type ContentProps = {
  section: DocContentSection;
};

export function Content({ section }: ContentProps) {
  return (
    <section className="flex-1 p-6 md:p-10">
      <h1 className="mb-6 text-3xl font-semibold">{section.title}</h1>

      {section.content !== undefined && section.content.length > 0 ? (
        <div className="mb-8 space-y-3">
          {section.content.map((line, index) => (
            <p
              key={`${section.id}-${index}`}
              className="text-sm leading-6 text-slate-700 md:text-base"
            >
              {line}
            </p>
          ))}
        </div>
      ) : null}

      {section.rules !== undefined && section.rules.length > 0 ? (
        <div className="space-y-4">
          {section.rules.map((rule) => (
            <article
              key={rule.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h2 className="text-base font-semibold text-slate-900">{rule.name}</h2>
              <p className="mt-2 text-sm text-slate-700">{rule.enforces}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-600">
                    Bad
                  </p>
                  <pre className="overflow-x-auto rounded-md bg-red-50 p-3 text-xs text-red-900">
                    <code>{rule.badExample}</code>
                  </pre>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Good
                  </p>
                  <pre className="overflow-x-auto rounded-md bg-emerald-50 p-3 text-xs text-emerald-900">
                    <code>{rule.goodExample}</code>
                  </pre>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
