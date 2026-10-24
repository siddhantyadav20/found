import { describe, expect, it } from "vitest";

import { offeredOptions, openReply } from "@/lib/game/chat";
import { add, dueEvents, episodeOf, newCase, type CaseState } from "@/lib/game/engine";
import { linesFor } from "@/lib/game/endings";
import { AIRPLANE } from "@/lib/game/phone";
import { ringingNow } from "@/lib/game/scene";
import type { Flag, Thread } from "@/content/types";
import { ep, play } from "./support/play";

/**
 * The thriller pass (ROADMAP "The thriller pass", PLAYTEST-SHAGUN.md
 * #94–108): after a blind first play, Sameer can be asked why, Bhasin knows
 * where you live, Raju isn't hung up on, and your phone says who's waiting.
 */

const thread = (name: string): Thread => {
  const parts = ep.threads.filter((t) => t.name === name);
  return { ...parts[0], messages: parts.flatMap((t) => t.messages), replies: parts.flatMap((t) => t.replies ?? []) };
};
const sameerNew = () => ep.threads.find((t) => t.id === "sameer-new-3")!;

describe("Sameer, asked why (#100, T16)", () => {
  const opened = () => play((s, scene) => episodeOf(s) === 3 && scene.kind === "table");
  const sameer = () => thread(sameerNew().name);

  it("can't be asked before he has said the line", () => {
    const s = add(opened(), "fired:sameer-last");
    expect(openReply(s, sameer())?.id).toBe("sameer-last");
  });

  it("answers in canon's motive once he has: their video, a case of his own, Mumbai, a doctor he believed in", () => {
    const s = add(opened(), "fired:sameer-last", "did:confronted-sameer");
    const r = openReply(s, sameer());
    expect(r?.id).toBe("sameer-why");
    const why = offeredOptions(s, r!)[0];
    const said = (why.then ?? []).map((m) => m.english).join(" ");
    expect(said).toMatch(/video/);
    expect(said).toMatch(/Only mine/);
    expect(said).toMatch(/Mumbai/);
    expect(said).toMatch(/doctor/);
  });
});

describe("Bhasin knows where you live (#103, T10)", () => {
  it("says the parcel's sender address is yours, with the location, before the gate at 7", () => {
    const near = ep.threads.find((t) => t.id === "bhasin-3")!.messages.filter((m) => m.with === "bhasin-near").map((m) => m.id);
    expect(near).toEqual(["b-6", "b-6a", "b-7"]);
    const line = ep.threads.find((t) => t.id === "bhasin-3")!.messages.find((m) => m.id === "b-6a")!;
    expect(line.english).toMatch(/address on that parcel is yours/);
  });
});

describe("Raju, told on the call (#97, T17)", () => {
  it("closes the call himself, so the player isn't left to hang up on him", () => {
    const options = ep.incoming.find((c) => c.id === "raju-alive")!.reply!.options;
    const shot = options.find((o) => o.id === "shot")!;
    expect(shot.then?.at(-1)?.english).toMatch(/I'll call you again/);
  });
});

describe("fair play for “his own reel” (#96, T9)", () => {
  it("the offer asks for a showreel, and tabling it beside the reel isn't wrong", () => {
    const reel = ep.questions.find((q) => q.id === "q5")!;
    if (reel.kind !== "file") throw new Error("q5 is a file question");
    expect(reel.claims.find((c) => c.id === "reel")!.also).toContain("offer");
  });
});

describe("the cold open (T1)", () => {
  const cold = ep.coldOpen!;

  it("is the reel take's own minute, two shots, and nobody named", () => {
    expect(cold.where).toMatch(/12:31/);
    expect(cold.lines.filter((l) => l.flash)).toHaveLength(2);
    for (const l of cold.lines) expect(l.who ?? "", l.line).toMatch(/^(|A boy|A voice)$/);
  });

  it("never says the code that opens his locked chats", () => {
    const said = JSON.stringify(cold).toLowerCase();
    expect(said).not.toContain(ep.chatLock!.code);
  });
});

describe("the stakes from the first question (T3, #95)", () => {
  it("puts him on a train tomorrow, and the ticket teaches “Mumbai”", () => {
    const q1 = ep.questions.find((q) => q.id === "q1")!;
    if (q1.kind !== "file" || !q1.say) throw new Error("q1 is a sentence");
    expect(q1.say.line).toMatch(/train/);
    expect(q1.say.learn?.Mumbai).toContain("ticket");
    expect(ep.evidence.find((e) => e.id === "ticket")?.app).toBe("mail");
  });
});

describe("Nitin and Kunal write first in Episode 3 (#107)", () => {
  const ep3 = () => play((s, scene) => episodeOf(s) === 3 && scene.kind === "table");

  it("is due once the episode is open, unless the route is already taken or the phone is offline", () => {
    const s = ep3();
    const due = (x: CaseState) => dueEvents(ep, x).map((e) => e.id);
    expect(due(s)).toEqual(expect.arrayContaining(["nitin-reaches", "kunal-writes"]));
    expect(due(add(s, "did:nitin-asked"))).not.toContain("nitin-reaches");
    expect(due(add(s, AIRPLANE))).not.toContain("kunal-writes");
  });
});

describe("the knock (T12)", () => {
  const guard = () => ep.incoming.find((c) => c.id === "guard-calls")!;

  it("rings your phone, and his airplane mode doesn't silence it", () => {
    expect(guard().device).toBe("yours");
    const s = add(newCase("knock", 0), "did:opened", "did:unlock", "fired:bhasin-near", "fired:guard-rings", AIRPLANE);
    expect(ringingNow(ep, s)?.id).toBe("guard-calls");
    expect(ringingNow(ep, add(s, "did:done-guard-calls"))).toBeUndefined();
  });

  it("is kept at 7 AM: the man the guard turned away comes back", () => {
    const complete = ep.endings.find((e) => e.id === "complete")!;
    const morning = (flags: Flag[]) => linesFor(add(newCase("m", 0), ...flags), complete.lines).map((l) => l.text).join(" ");
    expect(morning(["fired:bhasin-near", "did:done-guard-calls"])).toMatch(/phir aaya tha/);
    expect(morning(["fired:bhasin-near"])).toMatch(/grey safari suit/);
  });
});

describe("the morning after (T18, T19, T22)", () => {
  const complete = ep.endings.find((e) => e.id === "complete")!;
  const said = (flags: Flag[]) => linesFor(add(newCase("m", 0), ...flags), complete.lines).map((l) => l.english ?? l.text);

  it("ends on Mummy writing to a son who's already on the train", () => {
    expect(said([]).at(-1)).toMatch(/gone to Mumbai\. Without telling me\?/);
  });

  it("costs Nitin his night if his name went in, and Meera her senior's blessing if it was sent", () => {
    expect(said(["did:named-witness"]).join(" ")).toMatch(/Bhasin's people came to my house/);
    expect(said(["did:sent"]).join(" ")).toMatch(/My senior told me not to/);
  });
});

describe("the trim (T8)", () => {
  it("is on the nine-second fire clip only", () => {
    expect(ep.photos.filter((p) => p.trimmed).map((p) => p.evidence)).toEqual(["fire-clip"]);
  });
});
