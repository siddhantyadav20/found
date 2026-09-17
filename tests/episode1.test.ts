import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Flag } from "@/content/types";
import { answer, appLabel, caseFile, homeIcons, newCase, openApp, openQuestion, see, type CaseState } from "@/lib/game/engine";

/**
 * Episode 1, walked twice: once by a player who does everything the obvious
 * way, and once by one who takes the other route into every question.
 *
 * Both must reach the end of the episode, because every question in this
 * chapter has at least two ways in (PLAYER-JOURNEY law 3).
 */

const ep = STORIES["dont-cut-the-call"];

/** Open an app the way the phone does: everything in it that isn't hidden. */
const opens = (s: CaseState, apps: readonly Parameters<typeof openApp>[2][]) =>
  apps.reduce((acc, app) => openApp(ep, acc, app), s);

const answered = (s: CaseState, id: string, given: readonly string[] | string): CaseState => {
  const r = answer(ep, s, id, given);
  expect(r.ok, `${id}: ${r.reply}`).toBe(true);
  return r.state;
};

describe("the perfect player", () => {
  it("walks Episode 1 from the pouch to the charger", () => {
    let s = newCase("t", 0);

    // The pouch, the note, the phone turned over.
    s = { ...s, flags: [...s.flags, "did:opened", "did:unlock", "saw:note", "saw:call"] as Flag[] };

    // Q1: the news alert, and whose phone this is.
    s = { ...s, flags: [...s.flags, "fired:alert"] as Flag[] };
    s = opens(s, ["news", "settings"]);
    expect(openQuestion(ep, s)?.id).toBe("whose");
    s = answered(s, "whose", ["alert", "wallpaper"]);

    // Q2: she knew, fourteen minutes in.
    s = opens(s, ["notes"]);
    expect(openQuestion(ep, s)?.id).toBe("knew");
    s = answered(s, "knew", ["she-knew"]);

    // Q3: the FIR number is his mother's mobile number.
    s = opens(s, ["photos", "whatsapp"]);
    s = answered(s, "number", "Rukhsana");

    // Q4: the clock on his wall, and his face in his mother's photograph.
    s = see(ep, s, "clock");
    s = answered(s, "where", ["clock", "sahil-photo"]);

    expect(s.flags).toContain("did:placed-him");
    // The episode ends on a dead power bank and a charger, and on nothing else.
    expect(openQuestion(ep, s)).toBeUndefined();
    // Nothing was handed over: a clean run is reachable.
    expect(s.ledger).toEqual([]);
  });
});

describe("the other way in", () => {
  it("answers every question from its second route", () => {
    let s = newCase("t2", 0);
    s = { ...s, flags: [...s.flags, "did:opened", "did:unlock", "fired:alert"] as Flag[] };
    s = opens(s, ["news", "whatsapp", "photos", "safari"]);

    s = answered(s, "whose", ["alert", "watchman"]);
    s = answered(s, "knew", ["diary-1"]);
    s = answered(s, "number", "his mother");
    // The extinguisher's label is found by zooming, not by opening an app.
    s = see(ep, s, "burmese");
    s = answered(s, "where", ["burmese", "she-searched-mw"]);
    expect(s.flags).toContain("did:placed-him");
  });
});

describe("the shape of the episode", () => {
  it("keeps every piece of evidence in exactly one place", () => {
    const byId = new Map<string, number>();
    for (const e of ep.evidence) byId.set(e.id, (byId.get(e.id) ?? 0) + 1);
    for (const [id, n] of byId) expect(n, id).toBe(1);
  });

  it("files every piece of evidence in an app she actually has", () => {
    const apps = new Set(homeIcons(ep).map((i) => i.app));
    for (const e of ep.evidence) expect(apps.has(e.app), `${e.id} → ${e.app}`).toBe(true);
  });

  it("points every question at an app that holds its proof", () => {
    for (const q of ep.questions) {
      const ids = q.kind === "pick" ? [...q.proof, ...(q.orProof ?? []).flat()] : [];
      for (const id of ids) {
        const e = ep.evidence.find((x) => x.id === id);
        expect(e, `${q.id} wants ${id}`).toBeTruthy();
        // Manual evidence is found by doing, so it needn't be named in where-to-look.
        if (e && !e.manual) expect(q.whereToLook, `${q.id} → ${id}`).toContain(e.app);
      }
      expect(appLabel(ep, q.whereToLook[0])).toBeTruthy();
    }
  });

  it("gives the case file something to list as soon as anything is opened", () => {
    const s = openApp(ep, newCase("t3", 0), "news");
    expect(caseFile(ep, s).map((e) => e.id)).toContain("alert");
  });
});
