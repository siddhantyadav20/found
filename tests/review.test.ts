import { describe, expect, it } from "vitest";

import { conversation, openReply } from "@/lib/game/chat";
import { add, answer, blanksOf, dueEvents, newCase, proofChoices, readProof, readSentence, UNPROVED, whereMissing, whereWordsAre, wordsFor, wordsOff, type CaseState } from "@/lib/game/engine";
import type { Flag, Thread } from "@/content/types";
import { ep } from "./support/play";

/**
 * The review of 2026-10-01 (PLAYTEST-SHAGUN.md #58 on): the word lists grow
 * with what the player has read, Episode 1 stops giving Episode 2 away, the
 * night's turns wait for the player, M rings, and claiming to be M is tested.
 */

const start = (): CaseState => add(newCase("review", 0), "did:opened", "did:unlock", "saw:note", "did:past-lock");
const seeing = (...ids: string[]) => add(start(), ...ids.map((id) => `saw:${id}` as Flag));
const q = (id: string) => ep.questions.find((x) => x.id === id)!;

/** Every thread of that name, merged, as WhatsApp shows them. */
const thread = (name: string): Thread => {
  const all = ep.threads.filter((t) => t.name === name);
  return { ...all[0], messages: all.flatMap((t) => t.messages), replies: all.flatMap((t) => t.replies ?? []) };
};

/* Since 2026-10-23 every word is on offer from the start: players couldn't
   say what hadn't occurred to them. The phone still has to prove it. */
describe("the word lists", () => {
  it("offer every word of every blank, from the first minute", () => {
    for (const question of ep.questions) {
      if (question.kind !== "file" || !question.say) continue;
      for (const b of blanksOf(question.say.line)) expect(wordsFor(question, b), `${question.id} {${b}}`).toEqual(question.say.blanks[b]);
    }
  });

  it("can say every claim, and always offer a choice", () => {
    for (const question of ep.questions) {
      if (question.kind !== "file" || !question.say) continue;
      for (const b of blanksOf(question.say.line)) expect(wordsFor(question, b).length, `${question.id} {${b}}`).toBeGreaterThanOrEqual(2);
      for (const c of question.claims) for (const b of blanksOf(question.say.line)) expect(wordsFor(question, b), `${question.id}:${c.id}`).toContain(c.words?.[b]);
    }
  });
});

describe("a sentence, read back word by word (2026-10-23)", () => {
  const right = { name: "Sameer Khurrana", job: "wedding planner", city: "Mumbai" };

  it("files the claim its words say, and marks nothing", () => {
    expect(readSentence(q("q1"), right)).toMatchObject({ claim: { id: "him" }, wrong: [], whole: true });
  });

  it("marks the one wrong word, and says it isn't what the phone shows", () => {
    const r = readSentence(q("q1"), { ...right, job: "DJ" });
    expect(r.claim).toBeUndefined();
    expect(r.wrong).toEqual(["job"]);
    expect(r.why).toMatch(/“DJ” isn't what the phone shows/);
  });

  it("answers a near miss in its own words, and marks where it went wrong", () => {
    const r = readSentence(q("q5"), { what: "Kunal's reel", gun: "real revolver", who: "Dilip" });
    expect(r.claim?.refuse).toBeTruthy();
    expect(r.why).toBe(r.claim?.refuse);
    expect(r.wrong).toEqual(["what"]);
  });

  it("judges nothing until the sentence is whole", () => {
    expect(readSentence(q("q1"), { job: "DJ" })).toMatchObject({ wrong: [], whole: false });
  });
});

describe("the proof, a short list and plain feedback (2026-10-23)", () => {
  it("offers what bears on the question, not everything found", () => {
    const all = seeing(...ep.evidence.filter((e) => !e.requires?.length).map((e) => e.id));
    const offered = proofChoices(ep, all, q("q1")).map((e) => e.id);
    expect(offered).toEqual(expect.arrayContaining(["sk-films", "invoice", "offer"]));
    expect(offered.length).toBeLessThan(12);
  });

  it("says what's missing, and where it is", () => {
    const him = q("q1").kind === "file" ? (q("q1") as Extract<ReturnType<typeof q>, { kind: "file" }>).claims[0] : undefined;
    const r = readProof(ep, seeing("apple-account"), him!, ["apple-account"]);
    expect(r.ok).toBe(false);
    expect(r.stray).toEqual([]);
    expect(r.missing).toEqual(["sk-films"]);
    expect(whereMissing(ep, seeing("apple-account"), r.missing)).toEqual([{ app: "instagram", found: false }]);
  });

  it("marks what doesn't belong", () => {
    const him = (q("q1") as Extract<ReturnType<typeof q>, { kind: "file" }>).claims[0];
    expect(readProof(ep, seeing("sk-films", "poster"), him, ["sk-films", "poster"]).stray).toEqual(["poster"]);
  });
});

describe("Episode 1, no longer giving Episode 2 away", () => {
  it("keeps the hospital searches, and drops the one that said how long he lived", () => {
    expect(ep.searches.map((x) => x.text)).not.toContain("goli lagne ke baad kitne ghante");
    expect(ep.searches.map((x) => x.text)).toContain("private ambulance chhattarpur 24 hours");
  });

  it("writes the boy on the light as an initial, and the caterer doesn't say what he held", () => {
    const list = ep.notes.find((n) => n.id === "shot-list")!.body.join(" ");
    expect(list).toContain("D — light (N sick");
    const sethi = ep.threads.find((t) => t.id === "sethi")!.messages.map((m) => m.text).join(" ");
    expect(sethi).not.toMatch(/light/i);
  });

  it("gives a careful reader Kunal, with his father's gun on the back lawn: the wrong story, for the right reasons", () => {
    // His own post, archived on Sunday morning (2026-10-24): a cover-up would have had a public one deleted.
    const owner = ep.profiles.find((p) => p.posts.some((x) => x.evidence === "kunal-pose"))!;
    const post = owner.posts.find((p) => p.evidence === "kunal-pose")!;
    expect(owner.own).toBe(true);
    expect(post.archived).toBeTruthy();
    expect(post.title).toMatch(/Kunal/);
    expect(post.comments?.map((c) => c.text).join(" ")).toMatch(/Papa/);
    expect(post.requires).toBeUndefined();
  });

  it("puts on the poster only what a family would print, so where he was last seen is still a question", () => {
    const poster = ep.threads.find((t) => t.id === "raju")!.messages.find((m) => m.evidence === "poster")!.attachment!;
    expect(poster.kind).toBe("poster");
    expect(JSON.stringify(poster)).not.toMatch(/Chhattarpur|Catering|wedding/i);
  });

  it("doesn't show when the passcode went off, as iOS doesn't", () => {
    const rows = ep.settings.flatMap((g) => g.rows).find((r) => r.evidence === "passcode-off")!.detail!.rows;
    expect(rows.map((r) => r.label)).not.toContain("Turned off");
  });
});

describe("labels that describe and don't conclude", () => {
  it("say what's in the picture or the line, not what it means", () => {
    const label = (id: string) => ep.evidence.find((e) => e.id === id)!.label;
    expect(label("nitin-reply")).not.toMatch(/answering nothing/);
    expect(label("bts")).not.toMatch(/Dilip/);
    expect(label("frame")).not.toMatch(/second shot/);
  });

  it("put the kada in the fire clip itself, where the answer says it is", () => {
    const clip = ep.notes.flatMap((n) => n.attachments ?? []).find((a) => a.evidence === "fire-original")!;
    expect(clip.video?.captions.map((c) => c.line).join(" ")).toMatch(/kada/);
  });
});

describe("the night's turns wait for the player", () => {
  it("lets his phone die only once his first message has been read", () => {
    const ready = add(start(), "did:prepared", "fired:raju-rings", "fired:find-my", "fired:mummy-where", "fired:sameer-writes");
    expect(dueEvents(ep, ready).map((e) => e.id)).not.toContain("dying");
    expect(dueEvents(ep, add(ready, "saw:sameer-first")).map((e) => e.id)).toContain("dying");
    // Never read, it still dies, in time, once the phone has been put down.
    expect(ep.events.find((e) => e.id === "dying-late")?.quiet).toBe(true);
  });
});

describe("M, ringing his phone", () => {
  const after5 = add(start(), "ep:2", "fired:title-2", "ask:q5");

  it("rings once the reel is known, unless his phone is in airplane mode", () => {
    expect(dueEvents(ep, after5).map((e) => e.id)).toContain("meera-rings");
    expect(dueEvents(ep, add(after5, "did:airplane")).map((e) => e.id)).not.toContain("meera-rings");
  });

  it("unblocks him and writes in the chat he pinned for her, with nothing to introduce", () => {
    const s = add(after5, "fired:meera-rings", "did:meera-called", "did:knows-meera");
    const m = thread("M");
    expect(conversation(s, m, "30/11").map((x) => x.id)).toContain("me-0");
    expect(openReply(s, m)).toBeUndefined();
  });

  it("lets Nitin hear her name as a reason, however she was met", () => {
    const reason = ep.threads.flatMap((t) => t.replies ?? []).flatMap((r) => r.options).find((o) => o.id === "meera")!;
    expect(reason.requires).toEqual(["did:knows-meera"]);
  });
});

describe("claiming to be M", () => {
  const sameer = thread("+91 70••• •2290");
  const said = add(start(), "ep:2", "fired:sameer-writes", "fired:sameer-online", "did:sameer-as-m");

  it("is tested with what only M would know, which is in her old messages", () => {
    expect(openReply(said, sameer)?.id).toBe("sameer-test");
    const old = ep.threads.find((t) => t.id === "m")!.messages.filter((m) => m.from === "them").map((m) => m.text).join(" ");
    expect(old).toContain("Sammy");
  });

  it("shows the answer the player gave, right or wrong", () => {
    const wrong = add(said, "did:caught-as-m", "did:said-sameer");
    const text = conversation(wrong, sameer, "30/11").map((m) => m.text);
    expect(text).toContain("Sameer.");
    expect(text).not.toContain("SK.");
    expect(text).toContain("Tu M nahi hai.");
  });
});

describe("the stress test of 2026-10-02: a wrong word is said", () => {
  it("names the word no answer uses, and where the right one is shown", () => {
    const words = { name: "Sameer Khurrana", job: "DJ", city: "Mumbai" };
    expect(wordsOff(q("q1"), words)).toEqual(["job"]);
    expect(whereWordsAre(ep, q("q1"), "job")).toEqual(expect.arrayContaining(["instagram", "mail"]));
    expect(wordsOff(q("q1"), { ...words, job: "wedding planner" })).toEqual([]);
  });

  it("says when the sentence is right and only the proof is wrong", () => {
    const s = seeing("sk-films", "poster");
    expect(answer(ep, s, "q1", { claim: "him", proof: ["poster"] }).reply).toBe(UNPROVED);
    expect(answer(ep, s, "q1", { claim: "him", proof: ["sk-films", "poster"] }).reply).toMatch(/One thing on the table doesn't/);
  });
});
