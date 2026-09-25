import { STORIES } from "@/content/stories";
import type { AppId, Flag, Question } from "@/content/types";
import {
  add,
  answer,
  dueEvents,
  fire,
  homeIcons,
  newCase,
  openApp,
  openQuestion,
  see,
  sideQuestions,
  seen,
  settle,
  type CaseState,
} from "@/lib/game/engine";
import { AIRPLANE, CHATS_UNLOCKED, installed, offload, unlocked } from "@/lib/game/phone";
import { PLUGGED_IN, sceneOf, titleShown, type Scene } from "@/lib/game/scene";

/**
 * A player, played the way a person can: open every app, open what's inside
 * them (the archived chats and the bin included), lean in on a photo, answer
 * what the case file asks, plug the phone in when it dies, and let the night
 * happen (CHAPTER1.md F). It never sets a flag the game itself wouldn't.
 */

export const ep = STORIES.shagun;
const apps = [...new Set(homeIcons(ep).map((i) => i.app))] as AppId[];

/**
 * Everything a careful player opens: each app, and each chat, photo, note and
 * letter in it. An offloaded app is downloaded again once it can be, and a
 * locked note opened once its password can be known; not before.
 */
export function look(s: CaseState): CaseState {
  const back = homeIcons(ep).filter((i) => offload(s, i) === "available").map((i) => installed(i.app));
  const keys = ep.notes.filter((n) => n.locked && n.knownAfter && n.knownAfter.every((f) => s.flags.includes(f))).map((n) => unlocked(n.id));
  // WhatsApp's locked chats, once the secret code can be known (Sameer gave it, or the memo was heard).
  const code = ep.chatLock?.knownWhen.some((route) => route.every((f) => s.flags.includes(f))) ? [CHATS_UNLOCKED] : [];
  const ready = add(s, ...back, ...keys, ...code);
  const opened = apps.reduce((acc, app) => openApp(ep, acc, app), ready);
  return settle(ep, ep.evidence.reduce((acc, e) => see(ep, acc, e.id), opened));
}

const has = (s: CaseState) => (route: readonly string[]) => route.every((id) => seen(s, id));

/**
 * How a solver plays: `truth` files the traced answer whenever it can be
 * proved; `version` is the reader Sameer was counting on, filing his version
 * whenever it's on offer. `side` also answers what the case file offers on
 * the side (the money, Revisits nobody has to do).
 */
export type Style = {
  readonly prefer?: "truth" | "version";
  readonly side?: boolean;
  /** Files a hunch where one is on offer, ahead of what the phone can show. */
  readonly hunch?: boolean;
};

/** Answer a question with the first route the player can table: the truth if it can be proved, unless they prefer his version. */
export function solve(s: CaseState, q: Question, style: Style = {}): CaseState {
  const can = has(s);
  switch (q.kind) {
    case "pick": {
      const route = [q.proof, ...(q.orProof ?? [])].find(can);
      if (!route) throw new Error(`${q.id}: nothing to table`);
      return answer(ep, s, q.id, route).state;
    }
    case "file": {
      const order = style.prefer === "version" ? -1 : 1;
      // Never the near miss a sentence can be; a hunch only for a player who plays hunches, and then first.
      const sayable = q.claims.filter((c) => !c.refuse && (!c.hunch || style.hunch));
      const rank = (c: (typeof sayable)[number]) => (c.hunch ? -10 : 0) + order * Number(Boolean(c.version));
      for (const c of [...sayable].sort((a, b) => rank(a) - rank(b))) {
        const route = [c.proof, ...(c.orProof ?? [])].find(can);
        if (route) {
          const r = answer(ep, s, q.id, { claim: c.id, proof: route });
          if (r.ok) return r.state;
        }
      }
      throw new Error(`${q.id}: no claim can be filed`);
    }
    case "timeline": {
      const placed = q.rows.filter((r) => seen(s, r.evidence)).map((r) => `${r.id}@${r.lane}`);
      const r = answer(ep, s, q.id, placed);
      if (!r.ok) throw new Error(`${q.id}: ${r.reply}`);
      return r.state;
    }
    default:
      throw new Error(`${q.id}: the solver can't answer a ${q.kind} question`);
  }
}

/** Play from the parcel until `stop` says so, choosing what the player says with `say`. */
export function play(
  stop: (s: CaseState, scene: Scene) => boolean,
  say: readonly Flag[] = [],
  from: CaseState = add(newCase("solver", 0), "did:opened", "did:unlock", "saw:note", "did:past-lock"),
  style: Style = {},
): CaseState {
  let s = from;
  for (let step = 0; step < 300; step++) {
    // What the player chose to say, as soon as there's someone to say it to.
    s = add(s, ...say.filter((f) => !s.flags.includes(f) && canSay(s, f)));
    const scene = sceneOf(ep, s);
    if (stop(s, scene)) return s;
    if (scene.kind === "charge") {
      s = add(s, ...PLUGGED_IN);
      continue;
    }
    if (scene.kind === "title") {
      s = add(s, titleShown(scene.episode));
      continue;
    }
    if (scene.kind === "ringing") {
      s = add(s, `did:declined-${scene.call.id}`);
      continue;
    }
    s = look(s);
    const due = dueEvents(ep, s)[0];
    if (due) {
      // An event can change the scene (a new episode, a call): look again before answering anything.
      s = fire(ep, s, due.id);
      continue;
    }
    const q = openQuestion(ep, s);
    if (q) {
      s = solve(look(s), q, style);
      continue;
    }
    // Nothing in front: take up what's offered on the side, if this player does.
    const aside = style.side ? sideQuestions(ep, look(s)).find((x) => canSolve(look(s), x, style)) : undefined;
    if (aside) s = solve(look(s), aside, style);
  }
  throw new Error(`stuck at ${sceneOf(ep, s).kind}, question ${openQuestion(ep, s)?.id}`);
}

/** Only say what's on offer: the option's exchange has to be open, and the phone online. */
function canSay(s: CaseState, f: Flag): boolean {
  if (s.flags.includes(AIRPLANE)) return false;
  const replies = [...ep.threads.flatMap((t) => t.replies ?? []), ...ep.incoming.flatMap((c) => (c.reply ? [c.reply] : []))];
  const holds = (flags: readonly Flag[] = []) => flags.every((x) => s.flags.includes(x));
  // Any exchange with an option that says it and can be said now.
  const r = replies.find((x) => holds(x.requires) && x.options.some((o) => o.sets?.includes(f) && holds(o.requires))) ?? replies.find((x) => x.options.some((o) => o.sets?.includes(f)));
  const o = r?.options.find((x) => x.sets?.includes(f) && holds(x.requires)) ?? r?.options.find((x) => x.sets?.includes(f));
  return Boolean(
    r &&
      holds(r.requires) &&
      holds(o?.requires) &&
      !(r.unless ?? []).some((x) => s.flags.includes(x)) &&
      !r.options.some((x) => x.sets?.some((g) => s.flags.includes(g))),
  );
}

/** Whether a side question can be answered with what's been found. */
function canSolve(s: CaseState, q: Question, style: Style): boolean {
  try {
    return solve(s, q, style) !== s;
  } catch {
    return false;
  }
}
