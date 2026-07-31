/**
 * Renders commitment statement content for reading (F1.3.2 AC1).
 *
 * `content` is a structured JSON document on the API, not prose, so it has to
 * be flattened into something a person can read before they agree to be bound
 * by it. Extracted from the modal so the formatting is testable without a DOM.
 */

/**
 * "otjDeliveryPlan" → "Otj delivery plan".
 *
 * Sentence case, not Title Case: these are headings inside a legal document,
 * and Title Case on machine-derived keys reads like a form label rather than
 * part of the text being agreed to.
 */
export function humaniseKey(key) {
  return String(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
}

function renderValue(value, depth = 0) {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) {
    return value.length === 0
      ? "—"
      : value.map((v) => `• ${renderValue(v, depth + 1)}`).join("\n");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([k, v]) => `${humaniseKey(k)}: ${renderValue(v, depth + 1)}`)
      .join("\n");
  }
  return String(value);
}

/**
 * Returns readable text, or an honest message when there is nothing to show.
 *
 * Never returns an empty string: a blank panel above a "sign" button reads as
 * a loading glitch, and the employer would have no way to tell whether they
 * were agreeing to something or to nothing.
 */
export function renderStatementText(content) {
  if (!content) {
    return "The statement text could not be loaded. Do not sign until it is available.";
  }
  if (typeof content === "string") {
    return content.trim() || "This statement has no content.";
  }

  const entries = Object.entries(content).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );
  if (entries.length === 0) return "This statement has no content.";

  return entries
    .map(([key, value]) => `${humaniseKey(key)}\n${renderValue(value)}`)
    .join("\n\n");
}
