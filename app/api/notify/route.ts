import { NextResponse } from "next/server";

import { isCaseId } from "@/content/cases";
import { deliver, requester, throttled } from "@/lib/mail";
import { readContact } from "@/lib/waitlist";

/**
 * "Tell me when it arrives": a finisher leaves an email or a number for the
 * next case, and it reaches Siddhant the way the waitlist always did
 * (lib/mail.ts), to be written to once, by hand, when Case 2 is on the desk.
 * Nothing is stored here; with no RESEND_API_KEY it goes to the server log.
 *
 * Added with the review of 2026-10-01: the end card promised Chapter 2 and
 * gave nobody a way to hear about it.
 */
type Body = { contact?: unknown; case?: unknown } | null;

export async function POST(request: Request) {
  let body: Body = null;
  try {
    body = (await request.json()) as Body;
  } catch {
    // No body, or not JSON: nothing to keep.
  }
  const contact = typeof body?.contact === "string" ? readContact(body.contact) : null;
  if (!contact) return json({ ok: false, error: "That doesn't look like an email or a phone number." }, 400);
  if (throttled(`notify:${await requester()}`)) return json({ ok: false, error: "Too many tries. Give it a minute." }, 429);

  const from = isCaseId(body?.case) ? body.case : "unknown";
  try {
    await deliver(
      {
        from: "Found <onboarding@resend.dev>",
        subject: `Found · tell me when Case 2 arrives (${contact.kind})`,
        text: `Finished: ${from}\n${contact.kind === "email" ? "Email" : "Phone"}: ${contact.value}\n\nWrite once, when Case 2 is on the desk.`,
        replyTo: contact.kind === "email" ? contact.value : undefined,
      },
      `found notify · ${from} · ${contact.kind} ${contact.value}`,
    );
  } catch (error) {
    console.error("found notify failed", error);
    return json({ ok: false, error: "That didn't go through. Try again in a moment." }, 502);
  }
  return json({ ok: true });
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
