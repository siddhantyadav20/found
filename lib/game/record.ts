import type { Act, Ending, FileClaim, Flag, Link, Story } from "@/content/types";
import { filedClaim, isTraced, type CaseState, type RecordChoice } from "./engine";
import { finish } from "./endings";

/* ===========================================================================
   The record: what the player puts their name to (CHAPTER1.md I).

   One row per link, in the chain's order. A traced link goes in, in the
   record's words, or is left out. An untraced one can be left out, go in as
   what Sameer says, or go in as fact; if the player filed his version of it,
   it's already in as fact, in their own words, until they say otherwise.
   That is how "claiming more than the evidence can support" happens: by a
   player who was sure.

   Then an act (send, post, or give the phone back), and the story's endings
   say which ending that was.
   =========================================================================== */

export type RecordRow = {
  readonly link: Link;
  readonly traced: boolean;
  /** The owner's version the player filed for this link, if it stands. */
  readonly filed?: FileClaim;
  readonly choice: RecordChoice;
  readonly options: readonly RecordChoice[];
  /** The line as it goes out, or null when it's left out. */
  readonly line: string | null;
};

/** The version on file for a link: a `file` question's standing claim that stands in for it. */
function versionFor(story: Story, s: CaseState, link: string): FileClaim | undefined {
  for (const q of story.questions) {
    const c = filedClaim(q, s);
    if (c?.version && c.link === link) return c;
  }
  return undefined;
}

export function recordRows(story: Story, s: CaseState): RecordRow[] {
  return story.chain.map((link) => {
    const traced = isTraced(s, link);
    const filed = traced ? undefined : versionFor(story, s, link.id);
    const options: RecordChoice[] = traced
      ? link.unnamed
        ? ["in", "anon", "out"]
        : ["in", "out"]
      : link.version
        ? ["out", "says", "fact"]
        : ["out"];
    const set = s.record?.[link.id];
    const choice: RecordChoice = set && options.includes(set) ? set : traced ? "in" : filed ? "fact" : "out";
    const line =
      choice === "in"
        ? link.truth
        : choice === "anon"
          ? (link.unnamed ?? link.truth)
          : choice === "says"
          ? `Sameer says: “${link.english ?? link.version}”`
          : choice === "fact"
            ? (filed?.text ?? link.english ?? link.version ?? null)
            : null;
    return { link, traced, filed, choice, options, line };
  });
}

/** Set one link's row. Anything the row can't be is ignored. */
export function setRow(story: Story, s: CaseState, link: string, choice: RecordChoice): CaseState {
  const row = recordRows(story, s).find((r) => r.link.id === link);
  if (!row || !row.options.includes(choice)) return s;
  return { ...s, record: { ...s.record, [link]: choice } };
}

/** Which ending an act leads to, with the record as it stands. */
export function endingFor(story: Story, s: CaseState, act: Act): Ending | undefined {
  const rows = recordRows(story, s);
  const row = (id: string) => rows.find((r) => r.link.id === id);
  return story.endings.find(({ when }) => {
    if (!when.acts.includes(act)) return false;
    if (when.untraced?.some((id) => row(id)?.traced)) return false;
    // In without a witness's name is still in.
    if (when.in?.some((id) => !(row(id)?.traced && (row(id)?.choice === "in" || row(id)?.choice === "anon")))) return false;
    if (when.noFacts && rows.some((r) => !r.traced && r.choice === "fact")) return false;
    return true;
  });
}

/**
 * What doing it sets: the ending, the act, and what the record held, so the
 * ending's lines can read it back (a traced link left out; a version stated
 * as fact).
 */
export function actFlags(story: Story, s: CaseState, act: Act): readonly Flag[] {
  const ending = endingFor(story, s, act);
  if (!ending) return [];
  const rows = act === "return" ? [] : recordRows(story, s);
  return [
    ...finish(ending.id),
    `did:${act === "send" ? "sent" : act === "post" ? "posted" : "returned"}`,
    ...rows.filter((r) => r.traced && r.choice === "out").map((r): Flag => `did:left-out-${r.link.id}`),
    ...rows.filter((r) => !r.traced && r.choice === "fact").map((r): Flag => `did:fact-${r.link.id}`),
    // A witness named, or kept out, wherever a row could have named him.
    ...(rows.some((r) => r.link.unnamed && r.choice === "in") ? (["did:named-witness"] as const) : []),
    ...(rows.some((r) => r.link.unnamed && r.choice === "anon") && !rows.some((r) => r.link.unnamed && r.choice === "in")
      ? (["did:kept-witness"] as const)
      : []),
  ];
}
