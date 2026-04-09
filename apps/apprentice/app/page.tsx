import { serverEnv } from '@/config/env/server';

import { EnvClientExample } from './env-client-example';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface font-sans">
      <main className="flex w-full max-w-sm flex-col items-center gap-10 px-6 py-16 text-center">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
            Gradlly
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-text-primary">
            Apprentice Portal
          </h1>
          <p className="text-base text-text-secondary">
            OTJ tracking · KSB portfolio · EPA readiness
          </p>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="flex w-full flex-col gap-4">
          {[
            { label: 'Portal', value: 'P3 — Apprentice' },
            { label: 'Domain', value: serverEnv.NEXT_PUBLIC_APPRENTICE_URL },
            { label: 'Environment', value: serverEnv.NEXT_PUBLIC_APP_ENV },
            { label: 'Cookie Domain', value: serverEnv.COOKIE_DOMAIN },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-xs text-text-muted">{item.label}</span>
              <span className="text-sm font-medium text-text-primary">{item.value}</span>
            </div>
          ))}
          <EnvClientExample />
        </div>
      </main>
    </div>
  );
}
