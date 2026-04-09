import type { DocSection } from '@/types/docs';

type ContentProps = {
  section: DocSection;
};

export function Content({ section }: ContentProps) {
  return (
    <section className="flex-1 p-6 md:p-10">
      <h1 className="mb-6 text-3xl font-semibold">{section.title}</h1>
      {section.links && section.links.length > 0 ? (
        <nav aria-label={`${section.title} links`} className="mb-6 flex flex-wrap gap-3">
          {section.links.map((link) => (
            <a
              key={link.label}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              href={link.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
      <div className="space-y-3">
        {section.content.map((line, index) => (
          <p
            key={`${section.id}-${index}`}
            className="text-sm leading-6 text-slate-700 md:text-base"
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
