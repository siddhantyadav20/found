import { readFileSync, readdirSync } from "node:fs";

import { describe, expect, it } from "vitest";

import type { Flag } from "@/content/types";
import { add, claimsFor, clockNow, dueEvents, fileSentence, has, newCase, offline, type CaseState } from "@/lib/game/engine";
import { chosen, linesFor } from "@/lib/game/endings";
import { heldOn, impulseOf, leaning, vowsOf } from "@/lib/game/reading";
import { sceneOf, UNOPENED } from "@/lib/game/scene";
import { upgrade } from "@/lib/found/progress";
import { nightly } from "@/lib/found/time";
import { play, raakh, type Policy } from "./support/play3";

/* ===========================================================================
   Raakh v3 (RAAKH-V3.md §19): the branch routes, each played from a fresh
   save the way a person can (tests/support/play3.ts), and the automated
   content checks.
   =========================================================================== */

/** The one checking, saying no to everyone. */
const AUDITOR: readonly Flag[] = [
  "did:raju-first-denial",
  "did:mummy-stranger",
  "did:meera-stranger",
  "did:nitin-stranger",
  "did:promise-p1",
  "did:kunal-denial",
  "did:anita-denial",
  "did:guard-denial",
  "did:rv-meera-denial",
];
/** The one who wants it found. */
const CONFESSOR: readonly Flag[] = [
  "did:raju-first-finding",
  "did:mummy-fine",
  "did:meera-why",
  "did:promise-p3",
  "did:raju-told-shot",
  "did:nitin-care",
  "did:kunal-frame",
  "did:anita-care",
  "did:rv-meera-name",
];

/** Every line the ending's lock screen plays, for this save. */
const told = (s: CaseState): string[] => {
  const end = chosen(raakh, s);
  return end ? linesFor(s, end.lines).flatMap((l) => [`${l.who ?? ""}: ${l.text}`, ...(l.captions ?? []).map((c) => `${c.who ?? ""}: ${c.line}`)]) : [];
};
const notes = (s: CaseState): string[] => (chosen(raakh, s)?.notes ?? []).filter((l) => linesFor(s, [l]).length).map((l) => l.text);

describe("the branch routes (RAAKH-V3 §19)", () => {
  it("1. honest throughout: Room 6, with Meera and Raju", () => {
    const s = play({ say: CONFESSOR, photo: true, ending: "room6", before: ["meera", "raju"] });
    expect(chosen(raakh, s)?.id).toBe("room6");
    expect(told(s).join("\n")).toMatch(/Pahunch gaya/);
    expect(told(s).join("\n")).toMatch(/DCP raste mein hai/);
    expect(told(s).join("\n")).toMatch(/AIIMS Trauma Centre/);
    expect(told(s).join("\n")).toMatch(/Doosri goli maine chalayi thi/);
    expect(told(s).join("\n")).not.toMatch(/Aap hi dono ho/);
    expect(leaning(raakh, s)).toBe("confessor");
    expect(heldOn(raakh, s)).toEqual({ n: 0, of: 4 });
  });

  it("2. denials throughout: Room 6 alone, the SHO, and “Aap hi dono ho”", () => {
    const s = play({ say: AUDITOR, version: true, ending: "room6" });
    expect(chosen(raakh, s)?.id).toBe("room6");
    const lines = told(s).join("\n");
    expect(lines).toMatch(/Aap hi dono ho/);
    expect(lines).toMatch(/The SHO takes Sameer instead/);
    // His version still stands in his own statement.
    expect(lines).toMatch(/Us raat goli chali thi. Main wahan tha./);
    expect(leaning(raakh, s)).toBe("auditor");
    // Q7's version falls with Q8, whatever was filed: three of four hold.
    expect(heldOn(raakh, s)).toEqual({ n: 3, of: 4 });
  });

  it("3. Raju told “Kunal”: he withdraws, is told the truth before Room 6, and comes", () => {
    const s = play({ say: ["did:raju-told-kunal", ...CONFESSOR], photo: true, ending: "room6", before: ["raju-broken"] });
    expect(has(s, "did:raju-withdrew")).toBe(true);
    expect(has(s, "did:raju-repaired")).toBe(true);
    expect(told(s).join("\n")).toMatch(/Pahunch gaya/);
  });

  it("4. Raju told “Kunal”, never repaired: the 4:55, and his poster unchanged", () => {
    const s = play({ say: ["did:raju-told-kunal", ...CONFESSOR], photo: true, ending: "train" });
    expect(chosen(raakh, s)?.id).toBe("train");
    expect(has(s, "did:raju-withdrew")).toBe(true);
    const end = linesFor(s, chosen(raakh, s)!.lines);
    const poster = end.find((l) => l.poster)?.poster;
    expect(poster?.lines).toContain("Last seen: Banyan Farms, Chhattarpur");
    expect(poster?.found).toBeUndefined();
  });

  it("5. Nitin's promise, and a statement that names 1:52: “Tune pakki bola tha.”", () => {
    const s = play({ say: ["did:nitin-stranger", "did:promise-p1", ...CONFESSOR.filter((f) => f !== "did:nitin-care")], photo: true, ending: "room6" });
    expect(told(s).join("\n")).toMatch(/Tune pakki bola tha/);
    expect(vowsOf(raakh, s).find((v) => v.id === "P1")?.state).toBe("broken");
  });

  it("6. Kunal handed Nitin's name: the 3:05 threat, and Bhasin's men again in the ending", () => {
    const s = play({ say: ["did:nitin-exposed", ...CONFESSOR.filter((f) => f !== "did:kunal-frame")], photo: true, ending: "train" });
    expect(has(s, "fired:nitin-threat")).toBe(true);
    expect(told(s).join("\n")).toMatch(/Bhasin ke log phir aaye the/);
  });

  it("7. everything sent to M early, then the Trade: her 9:30 line", () => {
    const s = play({ say: CONFESSOR, send: true, photo: true, ending: "trade" });
    expect(chosen(raakh, s)?.id).toBe("trade");
    expect(has(s, "did:sent-m")).toBe(true);
    expect(told(s).join("\n")).toMatch(/Maine copy delete nahi ki/);
  });

  it("8. permanent deletes, then the 4:55: the promise to M broken", () => {
    const s = play({ say: CONFESSOR, photo: true, destroy: ["reel-take", "memo-458"], ending: "train" });
    expect(has(s, "did:deleted-perm")).toBe(true);
    expect(vowsOf(raakh, s).find((v) => v.id === "P3")?.state).toBe("broken");
    // Q4 stays provable without the reel take or the memo: the non-deletable bundle.
    expect(has(s, "claim:q4:truth")).toBe(true);
  });

  it("9. Q1's “me” hunch: “Meera. Main hoon.”, the early reveal, then the Trade", () => {
    const s = play({ say: ["did:early-reveal", ...CONFESSOR], hunch: ["q1"], photo: true, ending: "trade" });
    expect(has(s, "claim:q1:me")).toBe(true);
    expect(has(s, "did:early-reveal")).toBe(true);
    expect(chosen(raakh, s)?.id).toBe("trade");
  });

  it("10. face down at the camera: Return to Origin, face down", () => {
    const s = play({ say: CONFESSOR, facedown: true });
    expect(chosen(raakh, s)?.id).toBe("origin");
    expect(has(s, "did:rv-montage")).toBe(false);
    expect(notes(s)).toContain("You didn't look.");
  });

  it("11. “Sameer Khurrana” at the last question: Return to Origin, with and without her copy", () => {
    const kept = play({ say: CONFESSOR, send: true, ending: "origin" });
    const none = play({ say: CONFESSOR, ending: "origin" });
    expect(chosen(raakh, kept)?.id).toBe("origin");
    expect(told(kept).join("\n")).toMatch(/Maine copy rakh li hai/);
    expect(told(none).join("\n")).not.toMatch(/Maine copy rakh li hai/);
    expect(notes(none)).not.toContain("You didn't look.");
  });

  it("12. closed in Episode 2: Unopened, and opened again exactly as it was", () => {
    const closed = play({ say: CONFESSOR, close: "ask:q4" });
    expect(sceneOf(raakh, closed).kind).toBe("unopened");
    const reopened = { ...closed, flags: closed.flags.filter((f) => f !== UNOPENED) };
    expect(sceneOf(raakh, reopened).kind).not.toBe("unopened");
    const s = play({ say: CONFESSOR, photo: true, ending: "room6" }, undefined, reopened);
    expect(chosen(raakh, s)?.id).toBe("room6");
  });

  it("13. real time run out: Bhasin's car leaves, and the Trade with it", () => {
    const s = play({ say: CONFESSOR, runOut: true, photo: true }, (st, sc) => sc.kind === "table" && has(st, "fired:bhasin-left"));
    const qf = raakh.questions.find((q) => q.final)!;
    expect(claimsFor(qf, s, { who: "me", where: "at Gate 2, with the phone" })[0]?.refuse).toMatch(/car has gone/);
    expect(fileSentence(raakh, s, "qf", { who: "me", where: "at Gate 2, with the phone" }, ["camera-photo", "bhasin-terms"]).ok).toBe(false);
    // Every other door is still open.
    expect(fileSentence(raakh, s, "qf", { who: "me", where: "at Fatehpur Beri" }, ["camera-photo", "slip"]).ok).toBe(true);
  });

  it("14. airplane mode through Episode 2: what's sent waits, and nothing is lost", () => {
    const dark = play({ say: CONFESSOR, airplane: { on: "fired:title-2" } }, (st) => has(st, "fired:title-2") && Boolean(st.airplane));
    expect(offline(raakh, dark)).toBe(true);
    expect(dueEvents(raakh, dark).every((e) => e.local || e.device !== "owner")).toBe(true);
    const s = play({ say: CONFESSOR, photo: true, ending: "room6" }, undefined, { ...dark, airplane: false });
    for (const id of ["data-renewed", "bhasin-vn", "meera-rings", "raju-rings-2", "nitin-online", "nitin-copy"]) expect(has(s, `fired:${id}`), id).toBe(true);
  });

  it("15. every hint taken: the same night, the same end card", () => {
    const policy: Policy = { say: CONFESSOR, photo: true, ending: "room6", before: ["meera"] };
    const plain = play(policy);
    const hints = raakh.questions.flatMap((q) => [1, 2, 3].map((n): Flag => `hint:${q.id}:${n}`));
    const helped = play(policy, undefined, add(newCase("solver", 0), "did:opened", "did:unlock", "saw:note", ...hints));
    expect(chosen(raakh, helped)?.id).toBe(chosen(raakh, plain)?.id);
    expect(impulseOf(raakh, helped)).toEqual(impulseOf(raakh, plain));
    expect(vowsOf(raakh, helped)).toEqual(vowsOf(raakh, plain));
    expect(heldOn(raakh, helped)).toEqual(heldOn(raakh, plain));
    expect(told(helped)).toEqual(told(plain));
  });

  it("16. closed at Q6 and resumed: the same clock, order and state", () => {
    const policy: Policy = { say: CONFESSOR, photo: true, ending: "room6" };
    const mid = play(policy, (st, sc) => sc.kind === "table" && has(st, "fired:title-3") && !has(st, "ask:q6"));
    const resumed = upgrade(JSON.parse(JSON.stringify(mid)));
    expect(resumed).not.toBeNull();
    expect(clockNow(raakh, resumed!, 0)).toBe(clockNow(raakh, mid, 0));
    expect(resumed!.flags).toEqual(mid.flags);
    expect(play(policy, undefined, resumed!).flags).toEqual(play(policy).flags);
  });
});

describe("the content checks (RAAKH-V3 §19)", () => {
  const words = (q: (typeof raakh.questions)[number]) => q.kind === "file" ? q.claims : [];
  const evidence = new Set(raakh.evidence.map((e) => e.id));

  it("keeps the story's clock moving forward, and never behind what's arrived", () => {
    for (const policy of [{ say: CONFESSOR, photo: true, ending: "room6" as const }, { say: AUDITOR, version: true, ending: "train" as const }]) {
      let last = 0;
      let episode = 1;
      play(policy, (s) => {
        const ep = has(s, "ep:3") ? 3 : has(s, "ep:2") ? 2 : 1;
        const now = nightly(clockNow(raakh, s, 0));
        if (ep === episode) expect(now, s.flags.at(-1)).toBeGreaterThanOrEqual(last);
        episode = ep;
        last = now;
        return sceneOf(raakh, s).kind === "end-card";
      });
    }
  });

  it("writes every authored beat in order, inside the night", () => {
    const beats = raakh.beats!.map((b) => nightly(b.at));
    expect(beats).toEqual([...beats].sort((a, b) => a - b));
    for (const e of raakh.events) if (e.clock) expect(nightly(e.clock), e.id).toBeGreaterThanOrEqual(nightly("23:40"));
  });

  it("gives every date its right weekday (2026)", () => {
    const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = (d: number, m: number) => week[new Date(Date.UTC(2026, m - 1, d)).getUTCDay()];
    for (const c of raakh.clocks) {
      const [d, m] = c.date.split("/").map(Number);
      expect(day(d, m), c.date).toBe(c.day);
    }
    // "Sat 21 Nov", "Sunday 29 Nov", "Monday 30 November": wherever the content names a weekday beside a date.
    const months: Record<string, number> = { Nov: 11, November: 11, Dec: 12, December: 12, Oct: 10, October: 10 };
    const files = readdirSync("content/raakh").map((f) => readFileSync(`content/raakh/${f}`, "utf8")).join("\n");
    for (const m of files.matchAll(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*\.? (\d{1,2}) (Nov|November|Dec|December|Oct|October)\b/g)) {
      expect(day(Number(m[2]), months[m[3]]).startsWith(m[1]), m[0]).toBe(true);
    }
  });

  it("keeps a truth for every question that nothing on the phone can delete", () => {
    const deletable = new Set(raakh.evidence.filter((e) => e.deletable).map((e) => e.id));
    for (const q of raakh.questions.filter((x) => !x.final)) {
      const truths = words(q).filter((c) => !c.version && !c.hunch && !c.refuse && !c.free);
      expect(truths.length, q.id).toBeGreaterThan(0);
      const safe = truths.some((c) => [c.proof, ...(c.orProof ?? [])].some((r) => r.every((id) => !deletable.has(id))));
      expect(safe, q.id).toBe(true);
    }
  });

  it("names only evidence that exists", () => {
    const named: string[] = [];
    for (const q of raakh.questions) for (const c of words(q)) named.push(...c.proof, ...(c.orProof ?? []).flat(), ...(c.also ?? []), ...(c.liftedBy ?? []).flat());
    for (const q of raakh.questions) if (q.kind === "file") for (const ids of Object.values(q.say?.learn ?? {})) named.push(...ids.filter((x) => !x.includes(":")));
    const items = [
      ...raakh.threads.flatMap((t) => [t.contact?.evidence, ...t.messages.map((m) => m.evidence), ...(t.replies ?? []).flatMap((r) => r.options.flatMap((o) => (o.then ?? []).map((m) => m.evidence)))]),
      ...raakh.photos.flatMap((p) => [p.evidence, p.zoom?.evidence, ...(p.chat?.lines.map((l) => l.evidence) ?? [])]),
      ...raakh.notes.flatMap((n) => [n.evidence, ...(n.attachments ?? []).map((a) => a.evidence)]),
      ...raakh.memos.map((m) => m.evidence),
      ...raakh.mail.flatMap((m) => [m.evidence, m.attachment?.evidence]),
      ...raakh.payments.map((p) => p.evidence),
      ...raakh.calls.map((c) => c.evidence),
      ...raakh.searches.map((x) => x.evidence),
      ...raakh.settings.flatMap((g) => g.rows.map((r) => r.evidence)),
      ...raakh.profiles.flatMap((p) => [p.evidence, ...p.posts.map((x) => x.evidence)]),
    ].filter((x): x is string => Boolean(x));
    named.push(...items);
    // Flags that name evidence ("saw:x") anywhere in the chapter's data.
    const json = JSON.stringify(raakh);
    for (const m of json.matchAll(/"saw:([a-z0-9-]+)"/g)) named.push(m[1]);
    const missing = [...new Set(named)].filter((id) => !evidence.has(id));
    expect(missing).toEqual([]);
    // And every piece of evidence has somewhere it can be found.
    const found = new Set([...items, ...raakh.evidence.filter((e) => e.foundBy).map((e) => e.id)]);
    expect(raakh.evidence.map((e) => e.id).filter((id) => !found.has(id))).toEqual([]);
  });

  it("reaches every ending from a fresh save", () => {
    const ends = new Set<string>();
    for (const ending of ["room6", "trade", "train", "origin"] as const) ends.add(chosen(raakh, play({ say: CONFESSOR, photo: true, ending }))!.id);
    if (sceneOf(raakh, play({ close: "ask:q2" })).kind === "unopened") ends.add("unopened");
    expect([...ends].sort()).toEqual(raakh.endings.map((e) => e.id).sort());
  });

  it("tells every ending forward in time, a new day starting the count again", () => {
    const minutes = (at?: string, clock?: string): number | undefined => {
      const m = (clock ?? at ?? "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/);
      if (!m) return undefined;
      return ((Number(m[1]) % 12) + (m[3] === "PM" ? 12 : m[3] ? 0 : Math.floor(Number(m[1]) / 12) * 12)) * 60 + Number(m[2]);
    };
    for (const policy of [{ say: CONFESSOR, photo: true, before: ["meera", "raju"] }, { say: AUDITOR, version: true }]) {
      for (const ending of ["room6", "trade", "train", "origin"] as const) {
        const s = play({ ...policy, ending });
        let last = -1;
        for (const l of linesFor(s, chosen(raakh, s)!.lines)) {
          if (l.day || l.at?.endsWith("later")) last = -1;
          const t = minutes(l.at, l.clock);
          if (t === undefined) continue;
          // The small hours come after the evening before them.
          const n = t < 12 * 60 && last >= 12 * 60 && !l.day ? t + 24 * 60 : t;
          expect(n, `${ending}: ${l.at} ${l.text}`).toBeGreaterThanOrEqual(last);
          last = n;
        }
      }
    }
  });

  it("never prints a banned line in the chapter or its pages (RAAKH-V3 §15)", () => {
    const banned = [/stranger['’]s phone/i, /it isn['’]t your phone/i, /isn['’]t yours/i, /your address/i];
    const files = [
      ...readdirSync("content/raakh").map((f) => `content/raakh/${f}`),
      "content/cases.ts",
      "components/site/RaakhPage.tsx",
      "components/site/Landing.tsx",
      "app/page.tsx",
      "app/layout.tsx",
      "components/stage/Parcel.tsx",
      "components/stage/Note.tsx",
    ];
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      for (const b of banned) expect(text, `${f}: ${b}`).not.toMatch(b);
    }
  });

  it("lets which Sameer read the phone change lines, never which endings are open", () => {
    const qf = raakh.questions.find((q) => q.final)!;
    const atEnd = (say: readonly Flag[], version = false) => play({ say, version, photo: true }, (s, sc) => sc.kind === "table" && has(s, "fired:bhasin-terms"));
    const c = atEnd(CONFESSOR);
    const a = atEnd(AUDITOR, true);
    expect(leaning(raakh, c)).toBe("confessor");
    expect(leaning(raakh, a)).toBe("auditor");
    for (const claim of qf.kind === "file" ? qf.claims.filter((x) => x.ending) : []) {
      const open = (s: CaseState) => !claimsFor(qf, s, claim.words!)[0]?.refuse;
      expect(open(a), claim.id).toBe(open(c));
    }
  });
});
