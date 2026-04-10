import type { Metadata } from "next";

import { docsPages } from "@/data/docs";

export const metadata: Metadata = {
  title: "Main Docs | Gradlly",
  description: "Monorepo standards for linting, imports, boundaries, and structure.",
};

export default function DocsPage(): React.ReactNode {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl space-y-8 px-6 py-10 text-slate-900">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Main App Engineering Documentation</h1>
        <p className="text-sm text-slate-600">
          This page is data-driven from <code>apps/main/data/docs.ts</code>.
        </p>
      </header>

      {docsPages.map((page) => (
        <section key={page.id} className="space-y-4 rounded-xl border border-slate-200 p-5">
          <h2 className="text-2xl font-semibold">{page.title}</h2>

          {page.sections.map((section) => (
            <article key={section.id} className="space-y-3 border-t border-slate-100 pt-4 first:border-0 first:pt-0">
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
            </article>
          ))}
        </section>
      ))}
    </main>
  );
}
