import { describe, expect, it } from "vitest";

import { CASES } from "@/content/cases";
import { story as ep } from "@/content/blue-room/story";
import type { Flag } from "@/content/found/types";
import { actionAvailable, clockNow, dayNow, dueEvents, fire, has, newCase, perform, stage, type CaseState } from "@/lib/found/engine";

/**
 * The Blue Room: Chapter One's rewrite (CHAPTER1.md), tested as it's built.
 * N1 is the opening minute, so that's what's walked here: the envelope, the
 * phone nobody locked, the two notifications, the call, and 4%.
 */

const start = (): CaseState => newCase(ep.character!, "test", 0);

/** Let every due event arrive, in order, as the phone would. */
const arrive = (s: CaseState): CaseState => {
  for (let i = 0; i < 20; i++) {
    const [next] = dueEvents(ep, s);
    if (!next) return s;
    s = fire(s, next.id);
  }
  return s;
};

describe("The Blue Room's shape", () => {
  it("is registered as its own case, next to Low Battery", () => {
    expect(CASES["blue-room"].title).toBe(ep.title);
    expect(CASES["blue-room"].episodes).toBe(3);
  });

  it("is about one person, not a dealt cast", () => {
    expect(ep.character).toEqual({ gender: "boy", name: "Raghav" });
    expect(ep.opensWith).toBe("swipe");
  });

  it("points only at things that exist", () => {
    const actions = new Set(ep.actions.map((a) => a.id));
    const threads = new Set(ep.threads.map((t) => t.id));
    for (const c of ep.calls ?? []) expect(actions.has(c.ends), c.id).toBe(true);
    for (const st of ep.stages) if (st.call) expect(ep.calls?.some((c) => c.id === st.call), st.id).toBe(true);
    for (const e of ep.events) if (e.thread) expect(threads.has(e.thread), e.id).toBe(true);
    const flags = new Set<Flag>([
      ...ep.actions.map((a) => a.sets),
      ...ep.events.map((e) => `fired:${e.id}` as Flag),
    ]);
    for (const st of ep.stages) for (const f of [...st.when, ...(st.unless ?? [])]) expect(flags.has(f), `${st.id} → ${f}`).toBe(true);
    for (const e of ep.events) for (const f of e.when) expect(flags.has(f), `${e.id} → ${f}`).toBe(true);
  });

  it("shows every piece of evidence in exactly one place", () => {
    const messages = [...ep.threads.flatMap((t) => t.messages), ...ep.events.flatMap((e) => e.messages)];
    const shown = [
      ep.envelope.evidence,
      ...messages.map((m) => m.evidence),
      ...ep.threads.map((t) => t.infoEvidence),
      ...(ep.contacts ?? []).map((c) => c.evidence),
      ...(ep.callLog ?? []).map((c) => c.evidence),
      ...(ep.settings ?? []).flatMap((sec) => sec.rows.map((r) => r.evidence)),
      ...ep.photos.flatMap((p) => [p.evidence, p.zoom?.evidence]),
      ...(ep.recordings ?? []).map((r) => r.evidence),
      ...(ep.files ?? []).flatMap((f) => {
        const c = f.content;
        return [
          f.evidence,
          ...(c.kind === "plan" ? c.floors.flatMap((fl) => fl.rooms.map((r) => r.evidence)) : []),
          ...(c.kind === "pdf" ? c.pages.flatMap((pg) => pg.lines.map((l) => l.evidence)) : []),
          ...(c.kind === "sheet" ? c.sheets.map((sh) => sh.evidence) : []),
        ];
      }),
    ].filter((id): id is string => Boolean(id));
    expect([...shown].sort()).toEqual(ep.evidence.map((e) => e.id).sort());
  });

  it("opens every file onto something real", () => {
    const photos = new Set(ep.photos.map((p) => p.id));
    const locks = new Set(ep.locks.map((l) => l.id));
    const files = new Set((ep.files ?? []).map((f) => f.id));
    for (const f of ep.files ?? []) {
      const c = f.content;
      if (c.kind === "archive") {
        expect(locks.has(c.lock), f.id).toBe(true);
        for (const id of c.photos) expect(photos.has(id), `${f.id} → ${id}`).toBe(true);
      }
      if (c.kind === "video") expect(ep.photos.find((p) => p.id === c.photo)?.video, f.id).toBeTruthy();
      if (c.kind === "sheet") for (const sh of c.sheets) for (const row of sh.rows) expect(row.length, `${f.id} ${sh.name}`).toBe(sh.columns.length);
    }
    for (const t of ep.threads)
      for (const m of t.messages) if (m.attachment?.kind === "document") expect(files.has(m.attachment.file), m.attachment.name).toBe(true);
    // Every lock's code is findable before the lock itself.
    for (const l of ep.locks) for (const c of l.clues) expect(ep.evidence.find((e) => e.id === c)?.requires ?? [], `${l.id} → ${c}`).not.toContain(`lock:${l.id}`);
  });

  it("puts the English under everything said in Hinglish, in videos and recordings too", () => {
    const lines = [
      ...ep.photos.flatMap((p) => p.video?.captions ?? []),
      ...(ep.recordings ?? []).flatMap((r) => r.transcript),
    ];
    const english = /^“(Because|Good|I don't|Fuck|Kamat|Mahesh)/;
    for (const l of lines) if (l.text.startsWith("“") && !english.test(l.text)) expect(l.en, l.text).toBeTruthy();
  });

  it("gives every chat attachment something real to open", () => {
    const photos = new Set(ep.photos.map((p) => p.id));
    const actions = new Set(ep.actions.map((a) => a.id));
    for (const t of ep.threads)
      for (const m of t.messages) {
        if (m.photo) expect(photos.has(m.photo), `${t.id} ${m.at}`).toBe(true);
        const a = m.attachment;
        if (a?.kind === "video") expect(photos.has(a.photo), `${t.id} ${m.at}`).toBe(true);
        if (a?.kind === "live-location") expect(actions.has(a.stops), `${t.id} ${m.at}`).toBe(true);
        if (a?.kind === "voice") for (const l of a.transcript) if (l.text.startsWith("“")) expect(l.en, l.text).toBeTruthy();
        expect(m.text.trim() || m.photo || m.attachment || m.deleted, `${t.id} ${m.at}`).toBeTruthy();
      }
  });

  it("files every call and contact under someone who exists", () => {
    const contacts = new Set((ep.contacts ?? []).map((c) => c.id));
    for (const c of ep.callLog ?? []) expect(contacts.has(c.who) || c.who.startsWith("+91"), c.id).toBe(true);
    // The first deduction: RAGHAV is this phone's own other number, and the SIM is gone.
    expect(ep.contacts?.find((c) => c.name === "RAGHAV")?.label).toMatch(/SIM 2/);
    expect(ep.settings?.flatMap((sec) => sec.rows).some((r) => r.evidence === "sim2-removed")).toBe(true);
  });

  it("only writes chats in the apps a phone in Mumbai has", () => {
    for (const t of ep.threads) expect(["whatsapp", "telegram"], t.id).toContain(t.app);
  });

  it("puts the English under every line said in Hinglish", () => {
    for (const c of ep.calls ?? []) for (const l of c.lines) if (l.text.startsWith("“")) expect(l.en, l.text).toBeTruthy();
  });
});

describe("the first minute", () => {
  it("opens at 4:17 on Saturday, at 5%, on a lock screen with no passcode", () => {
    const s = start();
    expect(stage(ep, s)).toMatchObject({ screen: "lock", battery: 5 });
    expect(clockNow(s, 0, ep.clocks)).toBe("04:17");
    expect(dayNow(s, ep.clocks)).toBe("Saturday");
    expect(actionAvailable(ep, s, "unlock")).toBe(true);
  });

  it("lands “don't call him”, then RAGHAV's missed call, then rings", () => {
    let s = start();
    expect(dueEvents(ep, s).map((e) => e.id)).toEqual(["e1-dont-call"]);
    s = fire(s, "e1-dont-call");
    expect(dueEvents(ep, s).map((e) => e.id)).toEqual(["e1-missed"]);
    s = fire(s, "e1-missed");
    s = fire(s, "e1-ring");
    expect(stage(ep, s)).toMatchObject({ screen: "call", call: "opening", battery: 5 });
  });

  it("goes back to the lock screen at 4% once the whisper hangs up, and opens with a swipe", () => {
    let s = arrive(start());
    s = perform(ep, s, "hangup-opening");
    expect(stage(ep, s)).toMatchObject({ screen: "lock", battery: 4 });
    s = perform(ep, s, "unlock");
    expect(stage(ep, s)).toMatchObject({ screen: "phone", battery: 4 });
    s = arrive(s);
    expect(has(s, "fired:e1-case-open")).toBe(true);
  });

  it("still rings for someone who swiped it open before the call came", () => {
    let s = perform(ep, start(), "unlock");
    expect(stage(ep, s).screen).toBe("phone");
    s = arrive(s);
    expect(stage(ep, s)).toMatchObject({ screen: "call", call: "opening" });
    // The case file waits for the call.
    expect(has(s, "fired:e1-case-open")).toBe(false);
    s = arrive(perform(ep, s, "hangup-opening"));
    expect(stage(ep, s)).toMatchObject({ screen: "phone", battery: 4 });
    expect(has(s, "fired:e1-case-open")).toBe(true);
  });
});
