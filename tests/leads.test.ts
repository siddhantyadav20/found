import { describe, expect, it } from "vitest";

import type { Flag } from "@/content/types";
import { add, newCase, openQuestion } from "@/lib/game/engine";
import { chosen } from "@/lib/game/endings";
import { helpFor, helpText, leadFor, sayLead, waitingOn } from "@/lib/game/lead";
import { play, raakh, type Policy } from "./support/play3";

/* ===========================================================================
   The help, followed (lib/game/lead.ts): a player who opens nothing the
   hints don't point at, and replies only when told someone is waiting, still
   gets to the end. If a rewrite leaves a question or a quiet stretch with
   nowhere to go, this fails with the last leads it followed.
   =========================================================================== */

const CONFESSOR: readonly Flag[] = ["did:raju-first-finding", "did:mummy-fine", "did:meera-why", "did:promise-p3", "did:raju-told-shot", "did:nitin-care", "did:kunal-frame", "did:anita-care", "did:rv-meera-name"];
const AUDITOR: readonly Flag[] = ["did:raju-first-denial", "did:mummy-stranger", "did:meera-stranger", "did:nitin-stranger", "did:promise-p1", "did:kunal-denial", "did:anita-denial", "did:guard-denial", "did:rv-meera-denial"];

describe("following nothing but the help", () => {
  for (const [name, policy] of [
    ["telling the truth", { say: CONFESSOR, photo: true, ending: "room6" }],
    ["taking his version", { say: AUDITOR, version: true, photo: true, ending: "train" }],
  ] as const) {
    it(`reaches an ending, ${name}`, () => {
      const trail: string[] = [];
      const s = play({ ...(policy as Policy), follow: true, trail });
      expect(chosen(raakh, s)?.id).toBe(policy.ending);
      expect(trail.length).toBeGreaterThan(10);
    });
  }
});

describe("what the help says", () => {
  const fresh = add(newCase("t", 0), "did:opened", "did:unlock", "saw:note");
  const q1 = raakh.questions.find((q) => q.id === "q1")!;

  it("starts with the written nudge, then the app, then the thing itself, and counts the hint as before", () => {
    expect(helpText(raakh, fresh, q1, 1)).toBe(q1.hints[0]);
    expect(helpText(raakh, fresh, q1, 2)).toBe("Look in Settings: something there shows who S is.");
    expect(helpText(raakh, fresh, q1, 3)).toBe("Open “Sameer Khurrana” in Settings.");
    const h = helpFor(raakh, fresh, q1);
    expect(h?.tier).toBe(1);
    expect(h?.state.flags).toContain("hint:q1:1");
  });

  it("points at the next thing still missing, not at what's already been found", () => {
    const s = add(fresh, "saw:apple-account");
    expect(leadFor(raakh, s, q1)?.what).toBe("what he does");
    expect(helpText(raakh, s, q1, 3)).toMatch(/^Open the mail “Invoice/);
  });

  it("never names the thing at tier 2: a detective's last hint is only where", () => {
    for (const q of raakh.questions) {
      const next = leadFor(raakh, fresh, q);
      if (next?.lead.kind === "open") expect(sayLead(raakh, next.lead, 2, next.what)).not.toContain(next.lead.where);
    }
  });

  it("says Nitin is waiting, when Episode 2's last minute is his reply (the 20-player playtest's wall)", () => {
    const s = play({ say: CONFESSOR, photo: true }, (st, sc) => sc.kind === "table" && !openQuestion(raakh, st) && waitingOn(raakh, st)?.kind === "reply" && st.flags.includes("ep:2"));
    const w = waitingOn(raakh, s);
    expect(w?.kind === "reply" && w.who).toBe("Nitin");
    expect(sayLead(raakh, w!, 3)).toBe("Nitin is waiting for your reply in WhatsApp.");
  });
});
