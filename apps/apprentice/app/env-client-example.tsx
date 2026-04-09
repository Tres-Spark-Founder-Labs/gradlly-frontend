'use client';

import { clientEnv } from '@env';

export function EnvClientExample() {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-muted">Client API Base URL</span>
      <span className="text-sm font-medium text-text-primary">
        {clientEnv.NEXT_PUBLIC_API_BASE_URL}
      </span>
    </div>
  );
}
