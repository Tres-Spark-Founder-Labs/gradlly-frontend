import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INTERESTS = new Set(["continuo", "gradlly-ams", "both"]);

/**
 * Per-IP rate limit.
 *
 * In-process and therefore per-instance: a serverless deployment can hold
 * several of these at once, so the real ceiling is the limit times the number
 * of warm instances. That is deliberate rather than overlooked. The job here
 * is to stop a single client hammering the endpoint, and doing it properly
 * across instances means a shared store, which is a dependency this form does
 * not justify. If it ever needs to be exact, it moves to the API's Redis.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);

  // Bound the map so a long-lived instance cannot be made to grow without
  // limit by rotating source addresses.
  if (hits.size > 5000) hits.clear();

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/**
 * Validation, server side.
 *
 * The browser's own checks are a convenience for the person filling the form
 * in. They are not a control: anything can post to this route.
 */
function validate(body) {
  const errors = {};

  const name = String(body.name ?? "").trim();
  if (name.length < 2) errors.name = "Enter your name.";
  if (name.length > 120) errors.name = "That name is too long.";

  const email = String(body.email ?? "").trim();
  // Deliberately permissive. A stricter pattern rejects valid addresses, and
  // the only test that actually proves an address works is sending to it.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a work email address so we can reply.";
  }
  if (email.length > 254) errors.email = "That email address is too long.";

  const organisation = String(body.organisation ?? "").trim();
  if (organisation.length < 2) errors.organisation = "Enter your organisation.";
  if (organisation.length > 200) {
    errors.organisation = "That organisation name is too long.";
  }

  if (!INTERESTS.has(String(body.interest ?? ""))) {
    errors.interest = "Choose what you are interested in.";
  }

  return {
    errors,
    values: { name, email, organisation, interest: body.interest },
  };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Could not read that request." },
      { status: 400 },
    );
  }

  /**
   * Honeypot. A real person never sees this field, so anything in it came from
   * something filling every input on the page.
   *
   * Answered with 200 and the same body a success returns. A 400 tells a bot
   * which field caught it; a 200 tells it nothing, and it stops retrying.
   */
  if (String(body.role ?? "").trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        message:
          "That is a few requests in a short time. Try again in ten minutes, or email us directly.",
      },
      { status: 429 },
    );
  }

  const { errors, values } = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  await deliver(values);

  return NextResponse.json({ ok: true }, { status: 200 });
}

/**
 * Delivery, behind an adapter.
 *
 * There is no email path in this app, and the API's email module defaults to
 * its noop sender (graddly-api/src/email/email.module.ts). So the default here
 * is noop as well, and it stays noop until DEMO_REQUEST_TO_EMAIL is set rather
 * than pretending to send.
 *
 * What is logged is deliberately not the submission. An organisation name and
 * a work email in a plain log is a copy of the enquiry sitting in a log
 * aggregator, so this records that a request arrived and what it was about,
 * and nothing that identifies who sent it.
 */
async function deliver(values) {
  const destination = process.env.DEMO_REQUEST_TO_EMAIL;

  if (!destination) {
    console.error(
      `[demo-request] received, interest=${values.interest}, delivery=noop (DEMO_REQUEST_TO_EMAIL unset)`,
    );
    return;
  }

  console.error(
    `[demo-request] received, interest=${values.interest}, delivery=pending`,
  );
  // The transport goes here when the provider is configured. Left unbuilt
  // rather than stubbed with a fetch to a service nobody has chosen.
}
