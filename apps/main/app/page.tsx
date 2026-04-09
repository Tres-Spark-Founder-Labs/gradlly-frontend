'use client';

import { useMemo, useState } from 'react';

import { Content } from '@/components/Content';
import { Sidebar } from '@/components/Sidebar';
import { docsSections } from '@/data/docs';

export default function MainDocsPage() {
  const [activeSectionId, setActiveSectionId] = useState(docsSections[0]?.id ?? '');

  const activeSection = useMemo(
    () => docsSections.find((section) => section.id === activeSectionId) ?? null,
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
        onSelect={setActiveSectionId}
        sections={docsSections}
      />
      <Content section={activeSection} />
    </main>
  );
}
