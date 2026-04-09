import type { AppLink, DocContentSection } from '@/types/docs';

type SidebarProps = {
  activeSectionId: string;
  appLinks: AppLink[];
  onSelect: (sectionId: string) => void;
  sections: DocContentSection[];
};

export function Sidebar({ activeSectionId, appLinks, onSelect, sections }: SidebarProps) {
  return (
    <aside className="w-full border-b border-[var(--border)] p-4 md:w-72 md:border-b-0 md:border-r">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
        Docs
      </h2>
      <nav
        className="mb-6 flex flex-row gap-2 overflow-x-auto md:flex-col"
        aria-label="Doc sections"
      >
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

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
        Apps
      </h2>
      <nav
        className="flex flex-row gap-2 overflow-x-auto md:flex-col"
        aria-label="Application links"
      >
        {appLinks.map((link) => (
          <a
            key={link.id}
            className="rounded-md px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
            href={link.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
