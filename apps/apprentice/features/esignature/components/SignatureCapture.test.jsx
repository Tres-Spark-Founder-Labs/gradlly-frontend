import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SignatureCapture, renderTypedSignature } from "./SignatureCapture";

/**
 * F3.4.1 AC3 — "E-signature is captured via drawn signature on mobile or typed
 * name on desktop", and WCAG 2.1 AA 2.1.1 (Keyboard).
 *
 * The drawn pad is a pointer-only <canvas>. Offering it as the *only* control
 * on touch devices would leave a keyboard user unable to sign their own
 * apprenticeship agreement, so the device picks the default and both modes stay
 * reachable everywhere. These tests pin that, because it is the kind of
 * property a later "simplification" removes without noticing.
 */

function stubCanvas() {
  const ctx = {
    clearRect: vi.fn(),
    fillText: vi.fn(),
    fillStyle: "",
    font: "",
    textAlign: "",
    textBaseline: "",
  };
  const getContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(ctx);
  const toDataURL = vi
    .spyOn(HTMLCanvasElement.prototype, "toDataURL")
    .mockReturnValue("data:image/png;base64,STUB");
  return { ctx, getContext, toDataURL };
}

function setPointer(kind) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query.includes("coarse") && kind === "coarse",
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("F3.4.1 AC3 — signature capture", () => {
  it("AC3: offers both a typed and a drawn option", () => {
    setPointer("fine");
    render(<SignatureCapture onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: /type it/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /draw it/i })).toBeTruthy();
  });

  it("AC3: defaults to typing on a non-touch device", () => {
    setPointer("fine");
    render(<SignatureCapture onChange={vi.fn()} />);

    expect(screen.getByLabelText(/type your full name/i)).toBeTruthy();
  });

  it("AC3: defaults to drawing on a touch device", () => {
    setPointer("coarse");
    stubCanvas();
    render(<SignatureCapture onChange={vi.fn()} />);

    // The drawn pad is showing, and the keyboard escape hatch is offered with it.
    expect(
      screen.getByRole("button", { name: /type it instead/i }),
    ).toBeTruthy();
  });

  it("WCAG 2.1.1: a keyboard path exists even when the device prefers drawing", () => {
    setPointer("coarse");
    stubCanvas();
    render(<SignatureCapture onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /type it instead/i }));

    const input = screen.getByLabelText(/type your full name/i);
    expect(input.tagName).toBe("INPUT");
    expect(input.disabled).toBe(false);
  });

  it("AC3: a typed name produces an image, because the API takes a key not text", () => {
    setPointer("fine");
    const { ctx } = stubCanvas();
    const onChange = vi.fn();

    render(<SignatureCapture onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/type your full name/i), {
      target: { value: "Alex Morgan" },
    });

    expect(ctx.fillText).toHaveBeenCalledWith(
      "Alex Morgan",
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
    );
    expect(onChange).toHaveBeenLastCalledWith("data:image/png;base64,STUB");
  });

  it("AC3: switching mode clears the previous signature", () => {
    setPointer("fine");
    stubCanvas();
    const onChange = vi.fn();

    render(<SignatureCapture onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/type your full name/i), {
      target: { value: "Alex Morgan" },
    });
    onChange.mockClear();

    fireEvent.click(screen.getByRole("button", { name: /^draw it$/i }));

    // Null, not a stale image: the apprentice must not sign with a signature
    // they can no longer see or edit in the mode now on screen.
    expect(onChange).toHaveBeenCalledWith(null);
  });
});

describe("renderTypedSignature", () => {
  it("returns null for an empty name rather than a blank image", () => {
    expect(renderTypedSignature("")).toBeNull();
    expect(renderTypedSignature("   ")).toBeNull();
    expect(renderTypedSignature(null)).toBeNull();
  });

  it("returns null when no 2d context is available", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    // A blank PNG would be worse than nothing: it would upload cleanly and
    // appear on the signed document as an empty signature box.
    expect(renderTypedSignature("Alex Morgan")).toBeNull();
  });

  it("returns a PNG data URL for a real name", () => {
    stubCanvas();
    expect(renderTypedSignature("Alex Morgan")).toBe(
      "data:image/png;base64,STUB",
    );
  });
});
