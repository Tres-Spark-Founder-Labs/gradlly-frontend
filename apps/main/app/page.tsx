'use client';

import { useMemo, useState } from 'react';

import { Content } from '@/components/Content';
import { Sidebar } from '@/components/Sidebar';
import { appLinks, docsPages } from '@/data/docs';

const allSections = docsPages.flatMap((page) => page.sections);

export default function MainDocsPage() {
  const [activeSectionId, setActiveSectionId] = useState(allSections[0]?.id ?? '');

  const activeSection = useMemo(
    () => allSections.find((section) => section.id === activeSectionId) ?? null,
    [activeSectionId],
  );

  if (activeSection === null) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-sm text-slate-600">No documentation sections found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen md:flex">
      <Sidebar
        activeSectionId={activeSection.id}
        appLinks={appLinks}
        onSelect={setActiveSectionId}
        sections={allSections}
      />
      <Content section={activeSection} />
    </main>
  );
}
