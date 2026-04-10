import type { Metadata } from "next";

import { docsNavigation, docsPages } from "@/data/docs";

export const metadata: Metadata = {
  title: "Main Docs | Gradlly",
  description: "Engineering standards and usage guides for apps/main.",
};

export default function DocsPage(): React.ReactNode {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl gap-8 px-6 py-10 text-slate-900">
      <aside className="sticky top-6 hidden h-fit w-64 rounded-xl border border-slate-200 p-4 lg:block">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Documentation</h2>
        <nav className="space-y-2">
          {docsNavigation.map((item) => (
            <a key={item.id} href={item.href} className="block text-sm text-slate-700 hover:text-slate-900">
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Main App Engineering Documentation</h1>
          <p className="text-sm text-slate-600">
            Data-driven docs powered by <code>apps/main/data/docs.ts</code>.
          </p>
        </header>

        {docsPages.map((page) => (
          <section id={page.id} key={page.id} className="space-y-4 rounded-xl border border-slate-200 p-5">
            <h2 className="text-2xl font-semibold">{page.title}</h2>
            {page.summary ? <p className="text-sm text-slate-600">{page.summary}</p> : null}

            {page.sections.map((section) => (
              <article
                key={section.id}
                className="space-y-3 border-t border-slate-100 pt-4 first:border-0 first:pt-0"
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>

                {section.content?.map((line) => (
                  <p key={line} className="text-sm text-slate-700">
                    {line}
                  </p>
                ))}

                {section.rules?.length ? (
                  <div className="space-y-3">
                    {section.rules.map((rule) => (
                      <div key={rule.id} className="rounded-lg bg-slate-50 p-3">
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-sm text-slate-700">{rule.enforces}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {section.examples?.map((example) => (
                  <div key={example.id} className="rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                      {example.title}
                    </p>
                    <pre className="overflow-x-auto whitespace-pre-wrap">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                ))}
              </article>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
