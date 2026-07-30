import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Unmount between tests so DOM assertions can't leak across cases.
afterEach(() => {
  cleanup();
  // ExpiryAlert persists dismissal here (F1.1.2 AC5); reset so each test
  // starts from a clean session.
  try {
    window.sessionStorage.clear();
  } catch {
    // jsdom always provides sessionStorage, but never let cleanup throw.
  }
});
