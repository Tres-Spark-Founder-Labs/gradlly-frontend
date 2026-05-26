"use client";

import { ArrowLeft } from "lucide-react";

export function GoBackButton({ className }) {
  return (
    <button type="button" onClick={() => history.back()} className={className}>
      <ArrowLeft aria-hidden="true" className="size-3.5" strokeWidth={2} />
      Go back
    </button>
  );
}
