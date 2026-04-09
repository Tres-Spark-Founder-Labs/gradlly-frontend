import type { DocSection } from '@/types/docs';

type SidebarProps = {
  sections: DocSection[];
  activeSectionId: string;
  onSelect: (sectionId: string) => void;
};

export function Sidebar({ sections, activeSectionId, onSelect }: SidebarProps) {
  return (
    <aside className="w-full border-b border-[var(--border)] p-4 md:w-64 md:border-b-0 md:border-r">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
        Docs
      </h2>
      <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col">
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;

          return (
            <button
              key={section.id}
              className={`rounded-md px-3 py-2 text-left text-sm transition ${
                isActive
                  ? 'bg-slate-900 font-semibold text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              onClick={() => onSelect(section.id)}
              type="button"
            >
              {section.title}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
