"use client";

import { Component } from "react";

/**
 * Contains a render failure to one section of a page.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 *
 * `app/error.jsx` is the only boundary in this app, and it replaces the entire
 * route — sidebar, header, content — with a full-screen "Something went wrong".
 * As a last resort that is right. As the *only* granularity it is not: a throw
 * in one decorative banner cost employers the whole commitment board, and the
 * board was the thing they came for. The banner is an alert about a row that is
 * also listed in the table below it, so losing the banner loses nothing that
 * cannot be reached another way; losing the page loses everything.
 *
 * A boundary this narrow is worth having only where the wrapped thing is
 * genuinely non-essential. Wrapping the table in one would be worse than the
 * crash — an employer would see a page that looks fine and quietly omits their
 * statements. So this is applied deliberately, per section, not by default.
 *
 * ── WHY A CLASS ─────────────────────────────────────────────────────────────
 *
 * React has no hook equivalent of `componentDidCatch`. This is the one place
 * the codebase needs a class component.
 */
export class SectionBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    // Silence is what let the original defect reach a manual test pass without
    // anyone knowing which component threw. Logged rather than swallowed.
    console.error(
      `[SectionBoundary] ${this.props.name ?? "section"} failed to render`,
      error,
      info?.componentStack,
    );
  }

  render() {
    if (this.state.failed) {
      // `fallback` defaults to nothing: a section that cannot render is better
      // absent than represented by a box claiming to be it. Pass one where the
      // reader would otherwise wonder what is missing.
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
