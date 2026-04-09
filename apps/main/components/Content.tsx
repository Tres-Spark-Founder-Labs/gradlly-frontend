import type { DocSection } from '@/types/docs';

type ContentProps = {
  section: DocSection;
};

export function Content({ section }: ContentProps) {
  return (
    <section className="flex-1 p-6 md:p-10">
      <h1 className="mb-6 text-3xl font-semibold">{section.title}</h1>
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
