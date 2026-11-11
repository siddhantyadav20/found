import type { Flag, Question, Story } from "@/content/types";
import { nightly } from "@/lib/found/time";
import { factRoutes, leadClaim } from "./engine";

/* ===========================================================================
   The script, checked (2026-11-11).

   Everything a chapter's data can get wrong without a type error: an id that
   names nothing, a flag that's waited on and never set, two things sharing
   an id, a question its own answer has to unlock, a row that gives its answer
   away. Run over every chapter by tests/script.test.ts, so a rewrite, a cut
   scene or a renamed clue fails the tests with what broke and where, instead
   of stranding a player halfway through the night.

   What the code itself sets ("did:unlock", `did:answered-${id}`) can't be
   read off the story, so the caller passes it in: the literal flags, and the
   prefixes of the families the code builds.
   =========================================================================== */

export type Problem = { readonly where: string; readonly what: string };

/** What the game's own code sets, read off its source by the caller. */
export type CodeFlags = { readonly flags: ReadonlySet<string>; readonly prefixes: readonly string[] };

const FLAG = /^(ep|saw|did|ask|claim|link|hint|fired):/;

/** Keys whose flags are set by the thing that holds them, not waited on. */
const SETTERS = new Set(["sets", "go", "out", "stopSharing"]);

type Found = { flag: string; path: string; sets: boolean };

/** Every flag in the story's data, where it is, and whether it's being set there. */
function flagsIn(x: unknown, path: string, sets: boolean, out: Found[]): void {
  if (typeof x === "string") {
    if (FLAG.test(x)) out.push({ flag: x, path, sets });
    return;
  }
  if (Array.isArray(x)) {
    x.forEach((v, i) => flagsIn(v, `${path}[${i}]`, sets, out));
    return;
  }
  if (x && typeof x === "object") {
    for (const [k, v] of Object.entries(x)) flagsIn(v, path ? `${path}.${k}` : k, sets || SETTERS.has(k), out);
  }
}

/** Ids that must be unique, by what they are. */
function idsOf(story: Story): Record<string, string[]> {
  const messages = story.threads.flatMap((t) => [...t.messages, ...(t.replies ?? []).flatMap((r) => r.options.flatMap((o) => o.then ?? []))]);
  const photos = [...story.photos, ...story.notes.flatMap((n) => n.attachments ?? [])];
  return {
    evidence: story.evidence.map((e) => e.id),
    question: story.questions.map((q) => q.id),
    event: story.events.map((e) => e.id),
    // Threads aren't here: a later episode adds to a chat by giving it the same id again.
    message: messages.map((m) => m.id),
    photo: photos.map((p) => p.id),
    note: story.notes.map((n) => n.id),
    memo: story.memos.map((m) => m.id),
    mail: story.mail.map((m) => m.id),
    call: [...story.incoming, ...(story.reveal ? [story.reveal.call, story.reveal.yours.call] : [])].map((c) => c.id),
    moment: (story.moments ?? []).map((m) => m.id),
    dark: (story.dark ?? []).map((d) => d.id),
    ending: story.endings.map((e) => e.id),
    link: story.chain.map((l) => l.id),
    reply: story.threads.flatMap((t) => (t.replies ?? []).map((r) => r.id)),
  };
}

/** Every evidence id the story names as proof, or as where a word is learned. */
function evidenceNamed(story: Story): { id: string; where: string }[] {
  const out: { id: string; where: string }[] = [];
  for (const q of story.questions) {
    if (q.kind === "pick") for (const id of [...q.proof, ...(q.orProof ?? []).flat()]) out.push({ id, where: q.id });
    if (q.kind === "timeline") for (const r of q.rows) out.push({ id: r.evidence, where: `${q.id}.${r.id}` });
    if (q.kind === "claims") for (const c of q.claims) if (c.proof && !c.proof.includes(" ")) out.push({ id: c.proof, where: `${q.id}.${c.id}` });
    if (q.kind !== "file") continue;
    for (const c of q.claims) {
      const where = `${q.id}.${c.id}`;
      for (const id of [...c.proof, ...(c.orProof ?? []).flat(), ...(c.also ?? []), ...(c.liftedBy ?? []).flat(), ...(c.backed?.by ?? [])]) out.push({ id, where });
      for (const f of c.facts ?? []) for (const id of factRoutes(f).flat()) out.push({ id, where: `${where} “${f.what}”` });
    }
    for (const ids of Object.values(q.say?.learn ?? {})) for (const id of ids) if (!id.includes(":")) out.push({ id, where: `${q.id} learn` });
  }
  return out;
}

/** Every evidence id something on the phone carries: where it can be found. */
export function evidenceCarried(story: Story): Set<string> {
  const ids = [
    ...story.threads.flatMap((t) => [
      t.contact?.evidence,
      ...t.messages.map((m) => m.evidence),
      ...(t.replies ?? []).flatMap((r) => r.options.flatMap((o) => (o.then ?? []).map((m) => m.evidence))),
    ]),
    ...[...story.photos, ...story.notes.flatMap((n) => n.attachments ?? [])].flatMap((p) => [p.evidence, p.zoom?.evidence, p.original?.evidence, ...(p.chat?.lines.map((l) => l.evidence) ?? [])]),
    ...story.notes.map((n) => n.evidence),
    ...story.memos.map((m) => m.evidence),
    ...story.mail.flatMap((m) => [m.evidence, m.attachment?.evidence]),
    ...story.payments.map((p) => p.evidence),
    ...story.calls.map((c) => c.evidence),
    ...story.searches.map((x) => x.evidence),
    ...story.settings.flatMap((g) => g.rows.map((r) => r.evidence)),
    ...story.profiles.flatMap((p) => [p.evidence, ...p.posts.map((x) => x.evidence)]),
    ...story.evidence.filter((e) => e.foundBy?.length || e.from).map((e) => e.id),
  ];
  return new Set(ids.filter((x): x is string => Boolean(x)));
}

/** Is this flag ever set, by the story or by the game? */
function producedBy(story: Story, set: ReadonlySet<string>, code: CodeFlags): (f: string) => boolean {
  const ids = idsOf(story);
  const q = new Set(ids.question);
  const claims = new Set(story.questions.flatMap((x) => (x.kind === "file" ? x.claims.map((c) => `${x.id}:${c.id}`) : [])));
  const evidence = new Set(ids.evidence);
  const events = new Set(ids.event);
  const links = new Set(ids.link);
  return (f) => {
    if (set.has(f) || code.flags.has(f)) return true;
    if (code.prefixes.some((p) => f.startsWith(p))) return true;
    const [family, ...rest] = f.split(":");
    const id = rest.join(":");
    switch (family) {
      case "ep":
        return id === "2" || id === "3";
      case "saw":
        return evidence.has(id);
      case "ask":
        return q.has(id);
      case "claim":
        return claims.has(id);
      case "hint":
        return q.has(id.split(":")[0]);
      case "fired":
        return events.has(id);
      case "link":
        return links.has(id);
      default:
        return false;
    }
  };
}

/** The episode a flag can't hold before: `ep:2` is Episode 2. */
const episodeGate = (flags: readonly Flag[] = []): number => Math.max(1, ...flags.filter((f) => f.startsWith("ep:")).map((f) => Number(f.slice(3))));

function questionProblems(story: Story, q: Question): Problem[] {
  const out: Problem[] = [];
  const at = `question ${q.id}`;
  if (q.hints.some((h) => !h.trim())) out.push({ where: at, what: "a hint is empty" });
  if (q.kind !== "file") return out;
  const byId = new Map(story.evidence.map((e) => [e.id, e]));
  const claimIds = q.claims.map((c) => c.id);
  for (const id of claimIds.filter((c, i) => claimIds.indexOf(c) !== i)) out.push({ where: at, what: `two claims are called “${id}”` });

  /* A true line has to be fileable inside its own episode, and never behind
     its own answer: a route whose evidence waits for a later episode, or for
     this question to be answered, is a door that opens onto a wall. */
  const truths = q.claims.filter((c) => !c.version && !c.hunch && !c.refuse && !c.free);
  if (!q.final && !truths.length) out.push({ where: at, what: "there is no true line to file" });
  const blocked = (id: string): string | undefined => {
    const e = byId.get(id);
    if (!e) return undefined;
    if (e.requires?.some((f) => f === `ask:${q.id}` || f.startsWith(`claim:${q.id}:`))) return `${id} waits for this question's own answer`;
    if (!q.final && !q.optional && episodeGate(e.requires) > q.episode) return `${id} waits for Episode ${episodeGate(e.requires)}`;
    return undefined;
  };
  for (const c of truths) {
    const routes = c.facts?.length ? c.facts.map((f) => factRoutes(f)) : [[c.proof, ...(c.orProof ?? [])]];
    routes.forEach((r, i) => {
      if (!r.length || r.every((route) => !route.length)) {
        out.push({ where: `${at}.${c.id}`, what: `${c.facts ? `“${c.facts[i].what}”` : "it"} has no route` });
        return;
      }
      if (r.every((route) => route.some((id) => blocked(id)))) {
        const why = r.flatMap((route) => route.map(blocked)).find(Boolean);
        out.push({ where: `${at}.${c.id}`, what: `${c.facts ? `“${c.facts[i].what}”` : "it"} can't be shown in time: ${why}` });
      }
    });
  }

  /* A lines case file reads its rows off the true line's facts, and prints a
     waiting row's `what`: it has to say what the row is about, never what it
     is ("whether he's alive", not "that he's alive"). */
  if (story.filing === "lines" && !q.final) {
    const lead = leadClaim(q);
    if (!lead) out.push({ where: at, what: "a lines case file needs a true line to read its rows from" });
    else if (!lead.facts?.length) out.push({ where: `${at}.${lead.id}`, what: "a lines case file needs this line's facts: they are its rows" });
    for (const f of lead?.facts ?? []) {
      if (/^that\b/i.test(f.what)) out.push({ where: `${at}.${lead!.id}`, what: `the row “${f.what}” says its answer before it's shown: start it with whether/who/what/how` });
    }
  }
  if (story.filing === "lines" && q.final) {
    const endings = q.claims.filter((c) => c.ending && !c.refuse && !c.free && !c.facts?.length && !c.proof.length && !(c.orProof ?? []).length);
    for (const c of endings) out.push({ where: `${at}.${c.id}`, what: "an ending's line with nothing to show for it: give it facts, or mark it free" });
  }

  // Hunches a later answer says were called: "question:claim", and it has to exist.
  for (const c of q.claims) {
    for (const ref of c.pays ?? []) {
      const [qid, cid] = ref.split(":");
      const target = story.questions.find((x) => x.id === qid);
      if (!target || target.kind !== "file" || !target.claims.some((x) => x.id === cid)) out.push({ where: `${at}.${c.id}`, what: `pays “${ref}”, which names no claim` });
    }
    if (c.ending && !story.endings.some((e) => e.id === c.ending)) out.push({ where: `${at}.${c.id}`, what: `files the ending “${c.ending}”, which doesn't exist` });
  }
  return out;
}

/** Everything wrong with a chapter's data that the types can't catch. Empty is good. */
export function lintStory(story: Story, code: CodeFlags): Problem[] {
  const out: Problem[] = [];
  const ids = idsOf(story);

  // Two things with one id: `find` takes the first, and the second is never seen.
  for (const [kind, list] of Object.entries(ids)) {
    const seen = new Set<string>();
    for (const id of list) {
      if (seen.has(id)) out.push({ where: kind, what: `two ${kind}s are called “${id}”` });
      seen.add(id);
    }
  }

  // Evidence named anywhere exists, and everything in the register can be found somewhere.
  const evidence = new Set(ids.evidence);
  for (const n of evidenceNamed(story)) if (!evidence.has(n.id)) out.push({ where: n.where, what: `names evidence “${n.id}”, which doesn't exist` });
  const carried = evidenceCarried(story);
  for (const id of carried) if (!evidence.has(id)) out.push({ where: "the phone", what: `carries evidence “${id}”, which isn't in the register` });
  for (const e of story.evidence) if (!carried.has(e.id)) out.push({ where: `evidence ${e.id}`, what: "nothing on the phone carries it, so it can never be found" });

  // Every flag that's waited on is set by something: a typo here is a door that never opens.
  const found: Found[] = [];
  flagsIn(story, "", false, found);
  const set = new Set(found.filter((f) => f.sets).map((f) => f.flag));
  const made = producedBy(story, set, code);
  const missing = new Map<string, string>();
  for (const f of found) if (!f.sets && !made(f.flag) && !missing.has(f.flag)) missing.set(f.flag, f.path);
  for (const [flag, path] of missing) out.push({ where: path, what: `waits on “${flag}”, which nothing sets` });

  // What other parts of the story point at by id.
  const has = (kind: keyof typeof ids, id: string) => ids[kind].includes(id);
  const asked = (id: string, where: string) => {
    if (!has("question", id)) out.push({ where, what: `names question “${id}”, which doesn't exist` });
  };
  for (const [ep, o] of Object.entries(story.openers ?? {})) for (const id of o?.previously ?? []) asked(id, `openers.${ep}`);
  for (const [ep, r] of Object.entries(story.recaps ?? {})) for (const id of r?.filed ?? []) asked(id, `recaps.${ep}`);
  for (const [ep, shots] of Object.entries(story.previously ?? {})) for (const s of shots ?? []) if (s.kind === "filed") asked(s.question, `previously.${ep}`);
  for (const id of Object.keys(story.final?.before ?? {})) if (!has("ending", id)) out.push({ where: "final.before", what: `prepares ending “${id}”, which doesn't exist` });
  if (story.sendTo && !story.threads.some((t) => t.id === story.sendTo!.thread)) out.push({ where: "sendTo", what: `sends to thread “${story.sendTo.thread}”, which doesn't exist` });
  for (const d of story.dark ?? []) if (d.returnTo && !story.threads.some((t) => t.id === d.returnTo!.thread)) out.push({ where: `dark ${d.id}`, what: `returns to thread “${d.returnTo.thread}”, which doesn't exist` });
  const arrivals = new Set([...ids.event, ...ids.reply]);
  for (const t of story.threads) for (const m of t.messages) if (m.with && !arrivals.has(m.with)) out.push({ where: `thread ${t.id}.${m.id}`, what: `arrives with “${m.with}”, which is no event or reply` });

  // Questions.
  for (const q of story.questions) out.push(...questionProblems(story, q));
  if (story.caseFile !== false) {
    for (const q of story.questions) if (!q.whereToLook.length) out.push({ where: `question ${q.id}`, what: "says nowhere to look" });
  }

  // The clock: beats in the order they're written, so the night only moves forward.
  const beats = (story.beats ?? []).map((b) => nightly(b.at));
  beats.forEach((m, i) => {
    if (i && m < beats[i - 1]) out.push({ where: `beats[${i}]`, what: `${story.beats![i].at} comes before the beat written above it` });
  });
  return out;
}
