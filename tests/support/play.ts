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
  seen,
  settle,
  type CaseState,
} from "@/lib/game/engine";
import { PLUGGED_IN, sceneOf, titleShown, type Scene } from "@/lib/game/scene";

/**
 * A player, played the way a person can: open every app, open what's inside
 * them (the archived chats and the bin included), lean in on a photo, answer
 * what the case file asks, plug the phone in when it dies, and let the night
 * happen (CHAPTER1.md F). It never sets a flag the game itself wouldn't.
 */

export const ep = STORIES.shagun;
const apps = [...new Set(homeIcons(ep).map((i) => i.app))] as AppId[];

/** Everything a careful player opens: each app, and each chat, photo, note and letter in it. */
export function look(s: CaseState): CaseState {
  const opened = apps.reduce((acc, app) => openApp(ep, acc, app), s);
  return settle(ep, ep.evidence.reduce((acc, e) => see(ep, acc, e.id), opened));
}

const has = (s: CaseState) => (route: readonly string[]) => route.every((id) => seen(s, id));

/** Answer a question with the first route the player can table: the truth if it can be proved. */
export function solve(s: CaseState, q: Question): CaseState {
  const can = has(s);
  switch (q.kind) {
    case "pick": {
      const route = [q.proof, ...(q.orProof ?? [])].find(can);
      if (!route) throw new Error(`${q.id}: nothing to table`);
      return answer(ep, s, q.id, route).state;
    }
    case "file": {
      for (const c of [...q.claims].sort((a, b) => Number(Boolean(a.version)) - Number(Boolean(b.version)))) {
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
export function play(stop: (s: CaseState, scene: Scene) => boolean, say: readonly Flag[] = []): CaseState {
  let s = add(newCase("solver", 0), "did:opened", "did:unlock", "saw:note", "did:past-lock");
  for (let step = 0; step < 300; step++) {
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
    if (due) s = fire(ep, s, due.id);
    // What the player chose to say, once there's someone to say it to.
    s = add(s, ...say.filter((f) => !s.flags.includes(f) && canSay(s, f)));
    const q = openQuestion(ep, s);
    if (q) s = solve(look(s), q);
  }
  throw new Error(`stuck at ${sceneOf(ep, s).kind}, question ${openQuestion(ep, s)?.id}`);
}

/** Only say what's on offer: the option's exchange has to be open. */
function canSay(s: CaseState, f: Flag): boolean {
  const replies = [...ep.threads.flatMap((t) => t.replies ?? []), ...ep.incoming.flatMap((c) => (c.reply ? [c.reply] : []))];
  const r = replies.find((x) => x.options.some((o) => o.sets?.includes(f)));
  return Boolean(r && (r.requires ?? []).every((x) => s.flags.includes(x)) && !r.options.some((o) => o.sets?.some((g) => s.flags.includes(g))));
}
