"use client";

import { useState } from "react";

import type { AppId, Evidence, FileClaim, Question, Say, Story } from "@/content/types";
import {
  answer,
  answered,
  appLabel,
  blanksOf,
  calledIt,
  caseFile,
  episodeOf,
  proofChoices,
  proofToCome,
  readProof,
  readSentence,
  traced,
  whereMissing,
  FILED_AT,
  filedClaim,
  filedClaims,
  hint,
  isTraced,
  offeredClaims,
  needsRevisit,
  boardReady,
  ODD,
  openQuestion,
  PLACED,
  seen,
  sideQuestions,
  struckOut,
  whereToLook,
  whereWordsAre,
  wordsFor,
  type CaseState,
  type Given,
} from "@/lib/game/engine";
import { DETECTIVE } from "@/lib/game/scene";
import note from "@/components/owner/ios/Notes.module.css";
import styles from "./CaseFile.module.css";
import { wrong } from "./playthrough";
import { nightly, stamp } from "@/lib/found/time";
import { moment as momentTone } from "@/lib/found/tones";
import CloseCase from "./CloseCase";
import NightStrip from "./NightStrip";
import { holding } from "@/lib/game/hold";

/** When something was filed: read in the click that files it, never in a render. */
const filedNow = () => Date.now();

/** The proof a player has laid out, per question, for as long as the page is open. */
const onTable = new Map<string, string[]>();
/** The words a player has put in a question's sentence, likewise. */
const onLine = new Map<string, Record<string, string>>();

/* ===========================================================================
   The case file is the record: the player's own account of the night, one
   question at a time, with help that never costs anything.

   The only real complaint players ever made about Found was "I didn't know
   what to do", so where-to-look is free and unlimited, the three hints end in
   the answer, and nothing anywhere counts how often they were used
   (PLAYER-JOURNEY Stage 4). A player who chose Detective at the parcel gets
   no where-to-look, and the proof in the order they found it.

   What to do with what's on the table (File it, Hint, and what the case file
   says back) stays on screen at the bottom, however long the list of proof
   has grown, so the answer is never below the fold.

   Every answer goes into the record as a claim with its sources beside it
   (script §12: observation, then inference). Five kinds of question:

     pick      — put the proof on the table
     file      — say what you think happened, and put its proof on the table.
                 Most are asked as a sentence to finish (`say`): the words
                 are the player's, the proof is the phone's. A sentence can
                 be the owner's version, only what the phone shows, or a
                 hunch that runs ahead of it; a later answer that proves a
                 hunch says so, and when (script §12).
                 The owner's own version is a real answer: filed, sourced,
                 never called wrong. When a later find contradicts it, the
                 question comes back as Revisit, and the player strikes the old
                 line by hand before filing the new one (CHAPTER1.md G).
     type      — say the name out loud
     timeline  — put each event in its lane
     claims    — mark each statement proven, or not
   =========================================================================== */

export default function CaseFile({
  story,
  state,
  save,
}: {
  story: Story;
  state: CaseState;
  save: (next: CaseState) => void;
}) {
  const side = sideQuestions(story, state);
  const [aside, setAside] = useState<string | null>(null);
  const main = openQuestion(story, state);
  // A question taken up from the side, while it's still open; otherwise the one in front.
  const q = side.find((x) => x.id === aside) ?? main;
  const found = caseFile(story, state);

  // What was on the table survives a trip to another app and back (PLAYTEST.md #67).
  const [picked, setPickedHere] = useState<string[]>(() => (q ? (onTable.get(q.id) ?? []) : []));
  const setPicked = (next: string[] | ((p: string[]) => string[])) =>
    setPickedHere((p) => {
      const value = typeof next === "function" ? next(p) : next;
      if (q) onTable.set(q.id, value);
      return value;
    });
  const [claim, setClaim] = useState<string | null>(null);
  const [words, setWordsHere] = useState<Record<string, string>>(() => (q ? (onLine.get(q.id) ?? {}) : {}));
  const setWords = (next: Record<string, string>) => {
    if (q) onLine.set(q.id, next);
    setWordsHere(next);
  };
  const [struck, setStruck] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [said, setSaid] = useState<{
    text: string;
    ok: boolean;
    ask: string;
    filed: boolean;
    lit?: readonly { at: string; text: string }[];
    /** The reveal, large, before the rest. */
    moment?: string;
    /** "You called it at 11:49 PM." */
    called?: string;
    /** A version this answer crossed out of the record. */
    crossed?: readonly string[];
  } | null>(null);
  const [helped, setHelped] = useState<string | null>(null);
  // Proof a failed filing found on the table that shows nothing here: marked until it's taken off.
  const [stray, setStray] = useState<string[]>([]);
  /* The rows a checked board had in the wrong lane, and where: marked until
     the player moves them (With help only; a detective gets the count). */
  const [offRows, setOffRows] = useState<Record<string, string>>({});

  const reset = () => {
    setSaid(null);
    setPicked([]);
    setClaim(null);
    setWordsHere({});
    setTyped("");
    setHelped(null);
    setOffRows({});
    setStray([]);
    setAside(null);
  };

  /* An answered question stays on screen with its reply. The reply is the
     payoff for the whole search, and it used to be replaced in the same frame
     by the next question, which threw it away. */
  if (said?.ok)
    return (
      <div className={note.card} data-moment={said.moment ? "" : undefined}>
        {said.moment && <p className={styles.moment}>{said.moment}</p>}
        <div className={said.moment ? styles.afterMoment : undefined}>
        <p className={note.eyebrow}>{said.filed ? "Filed" : "Answered"}</p>
        <h3 className={note.question}>{said.ask}</h3>
        {said.called !== undefined && (
          <p className={styles.called}>{said.called ? `You called it at ${stamp(said.called)}.` : "You called it."}</p>
        )}
        <p className={note.solvedA}>{said.text}</p>
        {said.crossed?.map((line) => (
          <div key={line} className={styles.onFile}>
            <p className={styles.groupHead}>Struck from your record</p>
            <p className={styles.fileLine} data-struck>
              {line}
            </p>
          </div>
        ))}
        {/* What doesn't fit, lit and left unexplained. */}
        {said.lit?.length ? (
          <ul className={styles.list}>
            {said.lit.map((r) => (
              <li key={r.at} className={styles.lane} data-lit>
                <span className={styles.at}>{stamp(r.at)}</span>
                <span className={styles.laneText}>{r.text}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <button type="button" className={note.primary} onClick={reset}>
          Keep going
        </button>
        </div>
      </div>
    );

  const record = <Record story={story} state={state} />;
  const offered = side.filter((x) => x.id !== q?.id);
  const others = offered.length > 0 && (
    <div className={styles.side}>
      <p className={styles.groupHead}>Also open</p>
      {offered.map((x) => (
        <button
          key={x.id}
          type="button"
          className={styles.lane}
          onClick={() => {
            reset();
            setAside(x.id);
            setPickedHere(onTable.get(x.id) ?? []);
          }}
        >
          <span className={styles.laneText}>{x.ask}</span>
          <span className={styles.tag}>{needsRevisit(x, state) ? "Revisit" : "Open"}</span>
        </button>
      ))}
    </div>
  );

  if (!q)
    return (
      <div className={styles.file}>
        <div className={note.card}>
          <Progress story={story} state={state} />
          <NightStrip story={story} state={state} />
          <p className={styles.done}>
            {holding(story, state)
              ? story.hold?.note
              : story.close && episodeOf(state) === 3
                ? "Every question is filed. What happens to the record is up to you."
                : "Nothing else to answer yet. Keep looking through his phone: the night isn't over."}
          </p>
        </div>
        {others}
        {story.close && !holding(story, state) && <CloseCase story={story} state={state} open={episodeOf(state) === 3} />}
        {record}
        <Found found={found} story={story} />
      </div>
    );

  const detective = state.flags.includes(DETECTIVE);
  const revisit = needsRevisit(q, state);
  const onFile = revisit ? filedClaim(q, state) : undefined;
  // The old line has to be struck, by hand, before the board comes back.
  const striking = Boolean(onFile) && struck !== q.id;

  const give = (given: Given) => {
    const r = answer(story, state, q.id, given);
    const lit = q.kind === "timeline" ? q.rows.filter((row) => row.odd && seen(state, row.evidence)) : undefined;
    const c: FileClaim | undefined =
      q.kind === "file" && typeof given === "object" && !Array.isArray(given) ? q.claims.find((x) => x.id === (given as { claim: string }).claim) : undefined;
    // What this answer crossed out: a version on file elsewhere that it just proved wrong.
    const crossed = r.ok
      ? story.questions.filter((x) => !struckOut(x, state) && struckOut(x, r.state)).map((x) => filedClaim(x, r.state)?.text ?? "")
      : [];
    setSaid({
      text: r.reply,
      ok: r.ok,
      ask: q.ask,
      filed: q.kind === "file",
      lit,
      moment: r.ok ? c?.moment : undefined,
      called: r.ok && c ? calledIt(story, state, c) : undefined,
      crossed,
    });
    /* A failed filing says what's wrong with the table: what doesn't belong,
       or what's still missing and where it lives (2026-10-23). */
    if (!r.ok && c && !c.refuse && q.kind === "file" && q.say) {
      const p = readProof(story, state, c, (given as { proof: readonly string[] }).proof);
      setStray(p.stray);
      if (!detective) {
        const label = (id: string) => story.evidence.find((e) => e.id === id)?.label ?? id;
        const where = whereMissing(story, state, p.missing);
        const text = p.stray.length
          ? p.stray.length === 1
            ? `“${label(p.stray[0])}” doesn't show this. Take it off.`
            : `${p.stray.length} things on the table don't show this. They're marked: take them off.`
          : where.length
            ? `The sentence is right. ${p.missing.length === 1 ? "One more thing" : `${p.missing.length} more things`} would prove it: ${[...new Set(where.map((w) => appLabel(story, w.app)))].join(" and ")}.${where.some((w) => !w.found) ? " You haven't found it yet." : " You've found it: it's in the list."}`
            : r.reply;
        setSaid({ text, ok: false, ask: q.ask, filed: true });
      }
    } else setStray([]);
    // Which rows were off, for a player who asked for help: the count alone was a guessing game.
    if (q.kind === "timeline" && !r.ok && !detective && Array.isArray(given)) {
      const at = Object.fromEntries((given as string[]).filter((p) => p.includes("@")).map((p) => p.split("@") as [string, string]));
      setOffRows(Object.fromEntries(q.rows.filter((row) => at[row.id] && at[row.id] !== row.lane && at[row.id] !== row.orLane).map((row) => [row.id, at[row.id]])));
    } else setOffRows({});
    if (r.ok) {
      // A reveal lands with the room going quiet around it.
      if (c?.moment) momentTone();
      // When it was filed, so a hunch proved later can say when it was called.
      save(c ? { ...r.state, at: { ...r.state.at, [FILED_AT(q.id, c.id)]: filedNow() } } : r.state);
      onTable.delete(q.id);
      onLine.delete(q.id);
    } else wrong(q.id);
  };

  // Said as a sentence: the words decide the claim. Otherwise, with only one thing to say, it's the one being filed.
  const saying = q.kind === "file" && q.say ? q.say : undefined;
  const read = saying ? readSentence(q, words) : undefined;
  // A sentence the phone bears out, ready for its proof.
  const filable = read?.claim && !read.claim.refuse ? read.claim : undefined;
  const whole = saying ? blanksOf(saying.line).every((b) => words[b]) : false;
  const sayable = q.kind === "file" && !saying ? stillOffered(q, state) : [];
  const chosen = saying ? (filable?.id ?? null) : (claim ?? (sayable.length === 1 ? sayable[0].id : null));

  const ready =
    q.kind === "type"
      ? typed.trim().length > 0
      : saying
        ? Boolean(filable) && picked.length > 0
        : q.kind === "file"
          ? Boolean(chosen) && picked.length > 0
          : picked.length > 0;

  /* A word no answer uses, pointed at, with where the right one is shown: "DJ"
     isn't it, and his work is in Instagram or Mail. A detective is only told
     the sentence isn't what the phone shows. */
  const offWord = (): string | undefined => {
    if (!saying || detective || !read?.wrong.length) return undefined;
    const b = read.wrong[0];
    const apps = whereWordsAre(story, q, b);
    return `“${words[b]}” isn't what the phone shows.${apps.length ? ` The right word is on his phone: look in ${apps.map((a) => appLabel(story, a)).join(" or ")}.` : " Try another word."}`;
  };

  const fileSaid = () => {
    if (!filable) return;
    give({ claim: filable.id, proof: picked });
  };

  const whyNot =
    q.kind === "type"
      ? "Type it first."
      : q.kind === "timeline"
        ? "Put each row in a lane."
        : saying && !whole
          ? "Finish the sentence: tap each blank."
          : saying && !filable
            ? "Change the word marked in red."
          : q.kind === "file" && !saying && !chosen
            ? "Choose what you think happened."
            : picked.length === 0
              ? saying
                ? "Now show it: tap what proves it, below."
                : "Put the proof on the table to file it: tap what shows it, below."
              : "";

  // Until the first answer is filed, what the player is doing here, said plainly.
  const brief = story.brief && !story.questions.some((x) => answered(state, x.id)) ? story.brief : undefined;

  return (
    <div className={styles.file}>
      {brief && (
        <section className={styles.brief} aria-label={brief.title}>
          <p className={styles.briefHead}>{brief.title}</p>
          {brief.lines.map((l) => (
            <p key={l} className={styles.briefLine}>
              {l}
            </p>
          ))}
        </section>
      )}
      <div className={note.card}>
        <Progress story={story} state={state} now={q.id} />
        <NightStrip story={story} state={state} />
        <p className={note.eyebrow}>{revisit ? "Revisit" : q.optional ? "On the side" : "Open question"}</p>
        <h3 className={note.question}>{q.ask}</h3>
        {!detective && (
          <p className={note.ask}>
            Where to look: {whereToLook(story, q.id).map((a) => appLabel(story, a)).join(", ")}
          </p>
        )}

        {onFile && (
          <div className={styles.onFile}>
            <p className={styles.groupHead}>On file</p>
            <p className={styles.fileLine} data-struck={!striking || undefined}>
              {onFile.text}
            </p>
            {striking && (
              <button type="button" className={note.secondary} onClick={() => setStruck(q.id)}>
                Strike it
              </button>
            )}
          </div>
        )}

        {!striking && (
          <>
            <Board
              q={q}
              state={state}
              found={found}
              picked={picked}
              setPicked={setPicked}
              claim={chosen}
              setClaim={setClaim}
              words={words}
              setWords={setWords}
              typed={typed}
              setTyped={setTyped}
              labelOf={(app) => (app === "casefile" ? "From the parcel" : appLabel(story, app))}
              first={detective ? [] : whereToLook(story, q.id)}
              marking={Boolean(said && !said.ok && said.text.startsWith(PLACED)) || picked.some((p) => p.startsWith("odd:"))}
              offRows={offRows}
              story={story}
              read={read}
              why={read?.claim?.refuse ? read.why : (offWord() ?? read?.why)}
              stray={stray}
              detective={detective}
            />

            {/* Pinned to the bottom of the screen while the proof scrolls under it. */}
            <div className={styles.dock}>
              {helped && <p className={note.hint}>{helped}</p>}
              {/* Why File it is grey: said once, plainly, instead of a button that does nothing. */}
              {!ready && !said && whyNot && <p className={styles.whyNot}>{whyNot}</p>}
              {said && !said.ok && (
                <p className={styles.reply} data-placed={said.text.startsWith(PLACED) || undefined} role="status">
                  {said.text}
                </p>
              )}
              <div className={note.actions}>
                <button
                  type="button"
                  className={note.primary}
                  disabled={!ready}
                  onClick={() =>
                    saying ? fileSaid() : give(q.kind === "type" ? typed : q.kind === "file" ? { claim: chosen ?? "", proof: picked } : picked)
                  }
                >
                  {q.kind === "file" ? "File it" : "Answer"}
                </button>
                <button
                  type="button"
                  className={note.secondary}
                  onClick={() => {
                    // A word on the line that no answer uses: point at that first, and it costs no hint.
                    const off = offWord();
                    if (off && helped !== off) return setHelped(off);
                    const h = hint(story, state, q.id);
                    if (!h) return;
                    setHelped(h.text);
                    save(h.state);
                  }}
                >
                  Hint
                </button>
                {q.kind !== "timeline" && q.kind !== "type" && picked.length > 0 && (
                  <span className={styles.onTable}>{picked.length} on the table</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {others}
      {story.close && !holding(story, state) && <CloseCase story={story} state={state} />}
      {record}
    </div>
  );
}

/**
 * Where the player is in the chapter, at a glance: the episode, a dot per
 * question (filed, open, to come), and the links traced so far. The game's
 * score, kept in view (2026-10-23: "gamify the experience").
 */
function Progress({ story, state, now }: { story: Story; state: CaseState; now?: string }) {
  const ep = episodeOf(state);
  const qs = story.questions.filter((x) => x.episode === ep && !x.optional);
  const done = qs.filter((x) => answered(state, x.id)).length;
  return (
    <div className={styles.progress}>
      <span className={styles.progressEp}>
        Episode {ep} · {story.episodes[ep - 1]}
      </span>
      <span className={styles.progressDots} role="img" aria-label={`${done} of ${qs.length} questions filed`}>
        {qs.map((x) => (
          <i key={x.id} data-done={answered(state, x.id) || undefined} data-now={x.id === now || undefined} />
        ))}
      </span>
      <span className={styles.progressLinks}>
        {traced(story, state).length}/{story.chain.length} links
      </span>
    </div>
  );
}

/** The claims a player can file now: what they could prove, less any line already struck. */
function stillOffered(q: Question, s: CaseState) {
  const struck = new Set(filedClaims(q, s).map((c) => c.id));
  return offeredClaims(q, s).filter((c) => !struck.has(c.id));
}

/** Where a claim's sources come from: the first of its routes the player has all of. */
function sourcesOf(routes: readonly (readonly string[])[], s: CaseState): string[] {
  return [...(routes.find((r) => r.every((id) => seen(s, id))) ?? [])];
}

/** What stands behind a filed answer, as evidence ids. */
function sources(q: Question, s: CaseState): string[] {
  switch (q.kind) {
    case "pick":
      return sourcesOf([q.proof, ...(q.orProof ?? [])], s);
    case "file": {
      const c = filedClaim(q, s);
      return c ? sourcesOf([c.proof, ...(c.orProof ?? [])], s) : [];
    }
    case "timeline":
      return q.rows.filter((r) => seen(s, r.evidence)).map((r) => r.evidence);
    case "claims":
      return q.claims.map((c) => c.proof).filter((id) => seen(s, id));
    case "type":
      return [];
  }
}

/**
 * The record: every answer so far, in the order the chapter asks them, each
 * with what it stands on. A line that was struck stays, struck: the record
 * remembers what the player believed before.
 */
function Record({ story, state }: { story: Story; state: CaseState }) {
  const lines = story.questions.filter((q) => answered(state, q.id));
  if (!lines.length) return null;
  const label = (id: string) => story.evidence.find((e) => e.id === id)?.label ?? id;
  return (
    <section className={styles.record} aria-label="The record">
      <p className={styles.groupHead}>The record</p>
      <ol className={styles.lines}>
        {lines.map((q) => {
          const filed = filedClaims(q, state);
          const now = filed.at(-1);
          const from = [...new Set(sources(q, state))];
          // His version, crossed out by what was proved since; a hunch, borne out.
          const out = struckOut(q, state);
          const borne = now?.hunch ? story.chain.find((l) => l.id === now.hunch && isTraced(state, l)) : undefined;
          return (
            <li key={q.id} className={styles.entry}>
              {filed.slice(0, -1).map((c, i) => (
                <p key={`${c.id}-${i}`} className={styles.fileLine} data-struck>
                  {c.text}
                </p>
              ))}
              <p className={styles.fileLine} data-struck={out || undefined}>
                {now ? now.text : q.reply}
              </p>
              {out && <p className={styles.sources}>Struck by what you proved since.</p>}
              {borne && <p className={styles.sources}>Your hunch. Proved since.</p>}
              {from.length > 0 && <p className={styles.sources}>{from.map(label).join(" · ")}</p>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Everything found so far, grouped by where. */
function Found({ found, story }: { found: readonly Evidence[]; story: Story }) {
  if (!found.length) return null;
  return (
    <section aria-label="What you have found">
      <p className={styles.groupHead}>What you have found</p>
      <ul className={styles.list}>
        {found.map((e) => (
          <li key={e.id} className={styles.item}>
            <span>{e.label}</span>
            <span className={styles.where}>{appLabel(story, e.app)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProofTable({
  found: all,
  picked,
  toggle,
  labelOf,
  first,
}: {
  found: readonly { readonly id: string; readonly label: string; readonly app: AppId }[];
  picked: readonly string[];
  toggle: (id: string) => void;
  labelOf: (app: AppId) => string;
  /** Apps listed first, open; the rest fold under "Everything else" until asked for. */
  first: readonly AppId[];
}) {
  const [more, setMore] = useState(false);
  const [query, setQuery] = useState("");
  if (all.length === 0) return <p className={styles.empty}>Open something on the phone first.</p>;
  // A long table, searched by its words: "1:14", "Nitin", "screenshot".
  const wanted = query.trim().toLowerCase();
  const found = wanted ? all.filter((e) => e.label.toLowerCase().includes(wanted) || labelOf(e.app).toLowerCase().includes(wanted)) : all;
  const apps = [...new Set(found.map((e) => e.app))];
  // Where to look comes first; anything already on the table stays in view wherever it's from.
  const near = first.length ? apps.filter((a) => first.includes(a) || found.some((e) => e.app === a && picked.includes(e.id))) : apps;
  const rest = apps.filter((a) => !near.includes(a));
  const group = (app: AppId) => (
    <div key={app}>
      <p className={styles.groupHead}>{labelOf(app)}</p>
      <ul className={note.pickList}>
        {found
          .filter((e) => e.app === app)
          .map((e) => (
            <li key={e.id}>
              <button
                type="button"
                className={note.pickRow}
                data-on={picked.includes(e.id) || undefined}
                aria-pressed={picked.includes(e.id)}
                onClick={() => toggle(e.id)}
              >
                <span className={note.check} aria-hidden="true" />
                <span>{e.label}</span>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
  return (
    <div className={note.pick}>
      <p className={note.choose}>Put the proof on the table: tap everything that shows it.</p>
      {all.length > 8 && (
        <input
          id="proof-search"
          className={styles.search}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setMore(true);
          }}
          placeholder={`Search ${all.length} things you've found`}
          aria-label="Search what you've found"
        />
      )}
      {wanted && !found.length && <p className={styles.empty}>Nothing you&apos;ve found says “{query.trim()}”.</p>}
      {/* Grouped by where it was found, so thirty things stay findable. */}
      {[...near.toSorted((a, b) => Number(first.includes(b)) - Number(first.includes(a)))].map(group)}
      {rest.length > 0 &&
        (more ? (
          rest.map(group)
        ) : (
          <button type="button" className={styles.more} onClick={() => setMore(true)}>
            Everything else you&apos;ve found ({found.filter((e) => rest.includes(e.app)).length})
          </button>
        ))}
    </div>
  );
}

function Board({
  q,
  state,
  found,
  picked,
  setPicked,
  claim,
  setClaim,
  words,
  setWords,
  typed,
  setTyped,
  labelOf,
  first,
  marking,
  offRows,
  story,
  read,
  why,
  stray,
  detective,
}: {
  story: Story;
  /** What's wrong with the sentence, said with where the right word is. */
  why?: string;
  /** The sentence as it reads now: its claim, and the blanks keeping it from one. */
  read?: ReturnType<typeof readSentence>;
  /** Proof a failed filing marked as showing nothing here. */
  stray: readonly string[];
  detective: boolean;
  q: Question;
  state: CaseState;
  found: readonly { readonly id: string; readonly label: string; readonly app: AppId }[];
  /** What each app is called on the phone, for grouping what was found. */
  labelOf: (app: AppId) => string;
  /** The apps to list first: where to look, for a player who wants that help. */
  first: readonly AppId[];
  /** The board's second step: marking what can't all be true. */
  marking: boolean;
  /** Rows a check found in the wrong lane, with the lane they were in then. */
  offRows: Readonly<Record<string, string>>;
  picked: readonly string[];
  setPicked: (next: string[] | ((p: string[]) => string[])) => void;
  claim: string | null;
  setClaim: (id: string) => void;
  words: Record<string, string>;
  setWords: (next: Record<string, string>) => void;
  typed: string;
  setTyped: (v: string) => void;
}) {
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  if (q.kind === "type")
    return (
      <input
        className={note.input}
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder="Type it"
        aria-label={q.ask}
      />
    );

  /* Say what you think, then prove it. Only what the player could prove with
     what they've found is offered, in the chapter's own order and one style
     for all of it: nothing says which is the owner's. A line already struck
     isn't offered again. */
  /* Say it, then show it (2026-10-23). Step one is the sentence, read back
     the moment it's whole: right, or the wrong word in red with why. Step
     two opens only on a sentence the phone bears out: a short list of what
     bears on this question, not everything found. */
  if (q.kind === "file" && q.say) {
    const ok = read?.claim && !read.claim.refuse;
    const choices = proofChoices(story, state, q, detective ? 6 : 3);
    const shown = choices;
    const toCome = detective ? 0 : proofToCome(story, state, q);
    const need = ok ? Math.min(...[read!.claim!.proof, ...(read!.claim!.orProof ?? [])].map((r) => r.length)) : 0;
    return (
      <>
        <SayLine q={q} say={q.say} words={words} setWords={setWords} wrong={read?.wrong ?? []} />
        {read?.whole && (
          <p className={styles.verdict} data-ok={ok || undefined} role="status">
            {ok ? (read.claim!.version ? "That's how Sameer tells it. You can file it, if you can show it." : read.claim!.hunch ? "That's a hunch, and you can file it as one. Show what it rests on." : "That's what the phone shows. Now show it.") : why}
          </p>
        )}
        {ok && (
          <div className={styles.step} aria-label="Proof">
            <p className={styles.stepHead}>
              <span className={styles.stepNo}>2</span> Show it: tap {need === 1 ? "the thing on his phone that proves it" : `the ${need} things on his phone that prove it`}
            </p>
            {shown.length ? (
              <ul className={note.pickList}>
                {shown.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      className={note.pickRow}
                      data-on={picked.includes(e.id) || undefined}
                      data-stray={stray.includes(e.id) && picked.includes(e.id) ? "" : undefined}
                      aria-pressed={picked.includes(e.id)}
                      onClick={() => toggle(e.id)}
                    >
                      <span className={note.check} aria-hidden="true" />
                      <span className={styles.proofText}>
                        {e.label}
                        <span className={styles.proofApp}>{labelOf(e.app)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>Nothing you&apos;ve found shows this yet. Look in {first.map(labelOf).join(", ") || "his apps"}.</p>
            )}
            {toCome > 0 && (
              <p className={styles.toCome}>
                {toCome === 1 ? "One more thing" : `${toCome} more things`} on his phone {toCome === 1 ? "bears" : "bear"} on this, not found yet.
              </p>
            )}
          </div>
        )}
      </>
    );
  }

  if (q.kind === "file") {
    const offered = stillOffered(q, state);
    if (!offered.length) return <p className={styles.empty}>Nothing you&apos;ve found says yet. Keep looking.</p>;
    return (
      <>
        <p className={note.choose}>What do you think happened?</p>
        <ul className={styles.list}>
          {offered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={styles.lane}
                  data-on={claim === c.id || undefined}
                  aria-pressed={claim === c.id}
                  onClick={() => setClaim(c.id)}
                >
                  <span className={styles.laneText}>
                    {c.text}
                    {c.english && <span className={styles.english}>{c.english}</span>}
                  </span>
                </button>
              </li>
            ))}
        </ul>
        <ProofTable found={found} picked={picked} toggle={toggle} labelOf={labelOf} first={first} />
      </>
    );
  }

  /* Swimlanes. Each row sits on its own line across the lanes, and a tap on
     a lane puts it there: the column of dots under each name is that person's
     night (the 2026-10-01 review). Nothing is dragged, because dragging on a
     phone in one hand is a fight. Once the lanes are right the board asks
     what can't all be true, and the player marks those rows themselves. */
  if (q.kind === "timeline") {
    if (!boardReady(q, state)) return <p className={styles.empty}>Nothing you&apos;ve found shows it yet. Keep looking.</p>;
    const laneOf = (row: string) => picked.find((p) => p.startsWith(`${row}@`))?.split("@")[1];
    const place = (row: string, lane: string | undefined) =>
      setPicked((p) => [...p.filter((x) => !x.startsWith(`${row}@`)), ...(lane ? [`${row}@${lane}`] : [])]);
    const odd = (row: string) => picked.includes(ODD(row));
    const mark = (row: string) => setPicked((p) => (p.includes(ODD(row)) ? p.filter((x) => x !== ODD(row)) : [...p, ODD(row)]));
    const cols = { gridTemplateColumns: `repeat(${q.lanes.length}, minmax(0, 1fr))` } as React.CSSProperties;
    return (
      <>
        <p className={styles.where}>
          {marking
            ? (q.contradiction ?? "") + " Tap a row's words to mark it."
            : "Each lane is one person's night, or the car's. Tap the lane each moment tells you about: where they were, what was done to them, what they did."}
        </p>
        <div className={styles.swimHead} style={cols} aria-hidden="true">
          {q.lanes.map((l) => (
            <span key={l.id}>{l.label}</span>
          ))}
        </div>
        <ol className={styles.swim}>
          {q.rows
            .filter((r) => seen(state, r.evidence))
            .toSorted((a, b) => nightly(a.at) - nightly(b.at))
            .map((r) => {
              const lane = laneOf(r.id);
              return (
                <li key={r.id} className={styles.swimRow} data-odd={odd(r.id) || undefined} data-off={(lane && offRows[r.id] === lane) || undefined}>
                  <button
                    type="button"
                    className={styles.swimText}
                    disabled={!marking}
                    aria-pressed={marking ? odd(r.id) : undefined}
                    onClick={() => mark(r.id)}
                  >
                    <span className={styles.at}>{stamp(r.at)}</span>
                    <span className={styles.laneText}>
                      {r.text}
                      {lane && offRows[r.id] === lane && <span className={styles.offNote}>Not this lane</span>}
                    </span>
                  </button>
                  <span className={styles.swimTrack} style={cols} role="group" aria-label={`Lane for ${stamp(r.at)}`}>
                    {q.lanes.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        className={styles.cell}
                        aria-pressed={lane === l.id}
                        aria-label={l.label}
                        onClick={() => place(r.id, lane === l.id ? undefined : l.id)}
                      />
                    ))}
                  </span>
                </li>
              );
            })}
        </ol>
      </>
    );
  }

  if (q.kind === "claims")
    return (
      <ul className={styles.list}>
        {q.claims.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={styles.lane}
              data-on={picked.includes(c.id) || undefined}
              aria-pressed={picked.includes(c.id)}
              onClick={() => toggle(c.id)}
            >
              <span className={styles.laneText}>
                {c.text}
                {c.english && <span className={styles.english}>{c.english}</span>}
              </span>
              <span className={styles.tag}>
                {picked.includes(c.id) ? (q.labels?.[0] ?? "proven") : (q.labels?.[1] ?? "not proven")}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );

  return <ProofTable found={found} picked={picked} toggle={toggle} labelOf={labelOf} first={first} />;
}

/**
 * The sentence, with its blanks: tap one to choose its word, and the next
 * empty blank opens on its own. Nothing is typed, so nothing can be misspelt.
 * A blank offers only words the phone has taught the player (`Say.learn`):
 * names once they've been met, a twist once what shows it has been read.
 */
function SayLine({
  q,
  say,
  words,
  setWords,
  wrong = [],
}: {
  q: Question;
  say: Say;
  words: Record<string, string>;
  setWords: (next: Record<string, string>) => void;
  /** Blanks whose word isn't what the phone shows: marked red until changed. */
  wrong?: readonly string[];
}) {
  const names = blanksOf(say.line);
  const [open, setOpen] = useState<string | null>(() => names.find((n) => !words[n]) ?? null);
  const parts = say.line.split(/(\{\w+\})/);
  return (
    <div className={styles.saying}>
      <p className={styles.stepHead}>
        <span className={styles.stepNo}>1</span> Say what happened: tap each blank
      </p>
      <p className={styles.sentence}>
        {parts.map((part, i) => {
          const name = part.match(/^\{(\w+)\}$/)?.[1];
          if (!name) return <span key={i}>{part}</span>;
          return (
            <button
              key={i}
              type="button"
              className={styles.blank}
              data-open={open === name || undefined}
              data-filled={words[name] ? "" : undefined}
              data-wrong={wrong.includes(name) || undefined}
              aria-expanded={open === name}
              onClick={() => setOpen((o) => (o === name ? null : name))}
            >
              {words[name] ?? "…"}
            </button>
          );
        })}
      </p>
      {open && (
        <span className={styles.chips} role="group" aria-label="Choose a word">
          {wordsFor(q, open).map((w) => (
            <button
              key={w}
              type="button"
              className={styles.chip}
              aria-pressed={words[open] === w}
              onClick={() => {
                const next = { ...words, [open]: w };
                setWords(next);
                setOpen(names.find((n) => !next[n]) ?? null);
              }}
            >
              {w}
            </button>
          ))}
        </span>
      )}
    </div>
  );
}
