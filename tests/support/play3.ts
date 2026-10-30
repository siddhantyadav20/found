import { STORIES } from "@/content/stories";
import type { AppId, Flag, IncomingCall, Reply, ReplyOption, Story } from "@/content/types";
import { conversation, offeredOptions, openReply, threadsIn } from "@/lib/game/chat";
import {
  add,
  all,
  answer,
  claimsFor,
  dueEvents,
  fileSentence,
  fire,
  has,
  homeIcons,
  keepClock,
  newCase,
  offline,
  openApp,
  openQuestion,
  recover,
  remove,
  see,
  seen,
  settle,
  sideQuestions,
  type CaseState,
} from "@/lib/game/engine";
import { finish } from "@/lib/game/endings";
import { CHATS_UNLOCKED, installed, library, loaded, memos, offload, restored, unlocked, isCode } from "@/lib/game/phone";
import {
  darkDone,
  DEATH_SEEN,
  FACE_DOWN,
  openerShown,
  PLUGGED_IN,
  recapShown,
  REVEAL_DONE,
  sceneOf,
  teaserShown,
  titleShown,
  UNOPENED,
  type Scene,
} from "@/lib/game/scene";
import { ENDING_SEEN } from "@/lib/game/endings";

/* ===========================================================================
   A player of Raakh v3, played the way a person can (RAAKH-V3 §19): open
   what the phone shows them and nothing it doesn't (iCloud waits for the
   data, Voice Memos for its download, the locked chats for their code, the
   locked note for its download and its password), answer what the case file
   asks, say what the policy says when there's someone to say it to, and let
   the night happen. It never sets a flag the game itself wouldn't.
   =========================================================================== */

export const raakh = STORIES.raakh;

/** How this player plays a route. */
export type Policy = {
  /** Flags to choose, wherever an option sets one of them; otherwise the first option on offer. */
  readonly say?: readonly Flag[];
  /** Calls let ring out, by call id. */
  readonly decline?: readonly string[];
  /** File Sameer's version wherever it's on offer, rather than the truth. */
  readonly version?: boolean;
  /** File these questions' hunch claims where they're on offer (q1's "me"). */
  readonly hunch?: readonly string[];
  /** The last question: which ending's claim to file. */
  readonly ending?: "room6" | "trade" | "train" | "origin";
  /** Before the ending: the steps to take, by id (and choose their first choice). */
  readonly before?: readonly string[];
  /** At the reveal: put the phone face down, or take the photo. */
  readonly facedown?: boolean;
  readonly photo?: boolean;
  /** Items to delete for good (by item id) once they've been seen, and when. */
  readonly destroy?: readonly string[];
  /** Send everything found to M once she's asked. */
  readonly send?: boolean;
  /** Airplane mode on from this flag, and back off at that one. */
  readonly airplane?: { readonly on: Flag; readonly off?: Flag };
  /** Put the phone away (Unopened) once this flag holds. */
  readonly close?: Flag;
  /** Real time ran out (did:bhasin-left) once the terms have come. */
  readonly runOut?: boolean;
};

const apps = [...new Set(homeIcons(raakh).map((i) => i.app))] as AppId[];

/** Everything the phone shows now, as a person can reach it: the evidence ids. */
export function visible(story: Story, s: CaseState): string[] {
  const out: string[] = [];
  const push = (...ids: (string | undefined)[]) => ids.forEach((id) => id && out.push(id));
  // Photos: the library and the bin, what's down from iCloud (and the badge, leaning in).
  const lib = library(story, s);
  for (const p of [...lib.recents, ...lib.bin, ...(lib.hidden ?? [])]) {
    if (!loaded(s, p)) continue;
    push(p.evidence, p.zoom?.evidence, ...(p.chat?.lines.map((l) => l.evidence) ?? []));
  }
  // Voice Memos, once it's downloaded again.
  if (!homeIcons(story).some((i) => i.app === "voicememos") || has(s, installed("voicememos"))) {
    const m = memos(story, s);
    for (const x of [...m.recordings, ...m.bin]) push(x.evidence);
  }
  // Notes: open ones, and a locked one once it's down and its password can be known.
  for (const n of story.notes.filter((x) => all(s, x.requires))) {
    if (n.locked) {
      if (!all(s, n.downloadsAfter) || !has(s, unlocked(n.id))) continue;
      push(n.evidence, ...(n.attachments ?? []).filter((a) => !s.deleted?.[a.id]).map((a) => a.evidence));
    } else push(n.evidence);
  }
  // Chats: everything shown, the locked ones once the code has opened them.
  for (const app of ["whatsapp", "messages", "instagram"] as const) {
    for (const t of threadsIn(story, s, app)) {
      if (t.locked && !has(s, CHATS_UNLOCKED)) continue;
      push(t.contact?.evidence);
      for (const m of conversation(s, t, "29/11")) if (s.deleted?.[m.id] !== "perm") push(m.evidence);
    }
  }
  for (const m of story.mail) push(m.evidence, m.attachment?.evidence);
  for (const p of story.payments) push(p.evidence);
  for (const c of story.calls) push(c.evidence);
  // Safari's history, once the data's back.
  if (all(s, story.safariWaits?.until) && !offline(story, s)) for (const q of story.searches) push(q.evidence);
  for (const g of story.settings) for (const r of g.rows) push(r.evidence);
  for (const p of story.profiles) push(p.evidence, ...p.posts.map((x) => x.evidence));
  return out;
}

/** Look at everything on the phone that can be looked at, doing what a person would to reach it. */
export function look(s: CaseState, story: Story = raakh): CaseState {
  let x = s;
  // Download what can be downloaded again; open the locked note once its password is knowable and it's down.
  x = add(x, ...homeIcons(story).filter((i) => offload(x, i) === "available").map((i) => installed(i.app)));
  x = add(x, ...story.notes.filter((n) => n.locked && all(x, n.downloadsAfter) && n.knownAfter && all(x, n.knownAfter)).map((n) => unlocked(n.id)));
  // The locked chats, once the code can be known and it's accepted.
  if (story.chatLock && story.chatLock.knownWhen.some((r) => all(x, r)) && isCode(story, x, story.chatLock.code)) x = add(x, CHATS_UNLOCKED);
  x = apps.reduce((acc, app) => openApp(story, acc, app), x);
  x = add(x, "did:case-opened");
  return settle(story, visible(story, x).reduce((acc, id) => see(story, acc, id), x));
}

/** The option this player picks in an exchange. */
function pick(s: CaseState, r: Reply, policy: Policy): ReplyOption | undefined {
  const offered = offeredOptions(s, r);
  // The policy's flags in its own order of preference: the first it lists that's on offer wins.
  for (const f of policy.say ?? []) {
    const o = offered.find((x) => x.sets?.includes(f));
    if (o) return o;
  }
  return offered[0];
}

/** A call, played through: everything said, with its nested exchanges. */
function talk(s: CaseState, call: IncomingCall, policy: Policy): CaseState {
  let x = add(s, `did:answered-${call.id}`, ...(call.sets ?? []));
  let r: Reply | undefined = call.reply;
  while (r) {
    const o = pick(x, r, policy);
    if (!o) break;
    x = keepClock(raakh, add(x, ...(o.sets ?? [])), `said:${o.sets?.[0]}`, 0);
    r = o.next;
  }
  return add(x, `did:done-${call.id}`);
}

/** File the open question with the first claim this player would, and its first route they can table. */
export function solve(story: Story, s: CaseState, qid: string, policy: Policy): CaseState {
  const q = story.questions.find((x) => x.id === qid)!;
  if (q.kind !== "file") throw new Error(`${qid}: not a sentence`);
  const can = (route: readonly string[]) => route.every((id) => seen(s, id));
  const wanted = q.final
    ? q.claims.filter((c) => c.ending === (policy.ending ?? "room6"))
    : q.claims
        .filter((c) => !c.refuse && !c.free)
        .filter((c) => !c.hunch || policy.hunch?.includes(qid))
        .toSorted((a, b) => {
          // A hunch first where this player plays one; then the truth, or his version first for a player who takes it.
          const rank = (c: typeof a) => (c.hunch ? -10 : 0) + (c.version ? (policy.version ? -1 : 1) : 0);
          return rank(a) - rank(b);
        });
  for (const c of wanted) {
    if (claimsFor(q, s, c.words ?? {})[0]?.refuse) continue;
    const routes = c.free ? [[]] : [c.proof, ...(c.orProof ?? [])];
    for (const route of routes.filter(can)) {
      const r = q.final || c.free ? fileSentence(story, s, qid, c.words ?? {}, route) : answer(story, s, qid, { claim: c.id, proof: route });
      if (r.ok) return add(keepClock(story, r.state, `filed:${qid}:${c.id}`, 0), `did:read-${qid}`);
    }
  }
  throw new Error(`${qid}: nothing this player can file (${s.flags.filter((f) => f.startsWith("saw:")).length} things seen)`);
}

/** Every reveal step, as the director would take them. */
function revealStep(s: CaseState, policy: Policy): CaseState {
  const r = raakh.reveal!;
  if (!has(s, "did:rv-voice")) return add(s, "did:rv-voice");
  if (!has(s, "did:rv-guard")) {
    if (policy.decline?.includes("guard")) return add(s, "did:rv-guard", "did:guard-declined");
    return add(talk(s, r.yours.call, policy), "did:rv-guard");
  }
  if (!has(s, "did:rv-meera")) {
    const x = has(s, "did:early-reveal") ? s : talk(s, r.call, policy);
    return policy.facedown ? add(x, "did:rv-meera", FACE_DOWN, REVEAL_DONE) : add(x, "did:camera-open", "did:rv-meera");
  }
  // The shutter has to be pressed before the camera is done (fix brief §6: the kada is the proof).
  if (!has(s, "did:rv-camera")) return add(s, "did:camera-photo", "did:rv-camera");
  for (const step of ["casefile", "montage", "line", "dark", "card"] as const) if (!has(s, `did:rv-${step}`)) return add(s, `did:rv-${step}`, ...(step === "card" ? [REVEAL_DONE] : []));
  return s;
}

/** Play from the parcel until `stop` says so. */
export function play(policy: Policy = {}, stop: (s: CaseState, scene: Scene) => boolean = (_, sc) => sc.kind === "end-card", from?: CaseState): CaseState {
  let s = from ?? add(newCase("solver", 0), "did:opened", "did:unlock", "saw:note");
  for (let step = 0; step < 600; step++) {
    s = settle(raakh, s);
    // Airplane, by the policy's own flags: on, and back off.
    if (policy.airplane && has(s, policy.airplane.on) && !has(s, "did:airplane")) s = { ...add(s, "did:airplane", ...(has(s, "ask:q3") ? [] : (["did:went-dark"] as const))), airplane: true };
    if (policy.airplane?.off && s.airplane && has(s, policy.airplane.off)) s = { ...s, airplane: false };
    if (policy.close && has(s, policy.close) && !has(s, UNOPENED) && !has(s, "did:reveal-start")) s = add(s, UNOPENED);
    if (policy.runOut && has(s, "fired:bhasin-terms") && !has(s, "did:bhasin-left")) s = add(s, "did:bhasin-left");
    for (const item of policy.destroy ?? []) if (!s.deleted?.[item] && visibleItem(s, item)) s = keepClock(raakh, remove(s, item, "perm"), `deleted:${item}`, 0);
    if (policy.send && has(s, "did:meera-contact")) {
      const unsent = s.flags.filter((f): f is `saw:${string}` => f.startsWith("saw:")).map((f) => f.slice(4)).filter((id) => !has(s, `did:sent-m-${id}`));
      if (unsent.length) s = add(s, "did:sent-m", ...unsent.map((id): Flag => `did:sent-m-${id}`));
    }

    const scene = sceneOf(raakh, s);
    if (stop(s, scene)) return s;
    switch (scene.kind) {
      case "death":
        s = add(s, DEATH_SEEN);
        continue;
      case "recap":
        s = add(s, recapShown(scene.episode));
        continue;
      case "next":
        s = add(s, teaserShown(scene.episode));
        continue;
      case "charge":
        s = add(s, ...PLUGGED_IN);
        continue;
      case "opener":
        s = add(s, openerShown(scene.episode));
        continue;
      case "title":
        s = add(s, titleShown(scene.episode));
        continue;
      case "dark":
        s = add(s, darkDone(scene.dark.id), ...(scene.dark.sets ?? []));
        continue;
      case "reveal":
        s = revealStep(s, policy);
        continue;
      case "before": {
        const before = raakh.final?.before[scene.ending];
        for (const st of before?.steps ?? []) {
          if (!policy.before?.includes(st.id)) continue;
          if ((st.requires ?? []).some((f) => !has(s, f)) || (st.unless ?? []).some((f) => has(s, f))) continue;
          if (st.delete) s = keepClock(raakh, remove(s, st.delete, "perm"), `deleted:${st.delete}`, 0);
          if (st.sets?.length) s = add(s, ...st.sets);
          const c = st.choose?.find((x) => (x.requires ?? []).every((f) => has(s, f)) && !(x.unless ?? []).some((f) => has(s, f)));
          if (c) s = add(s, ...c.sets);
        }
        s = add(s, ...finish(scene.ending));
        continue;
      }
      case "unopened":
        return s;
      case "ending":
        s = add(s, ENDING_SEEN);
        continue;
      case "ringing": {
        const { call } = scene;
        s = policy.decline?.includes(call.id) && !call.insists ? add(s, `did:declined-${call.id}`) : talk(s, call, policy);
        continue;
      }
      default:
        break;
    }

    s = look(s);
    // Say what the policy says, in any chat waiting on the player.
    let said = false;
    for (const app of ["whatsapp", "instagram"] as const) {
      for (const t of threadsIn(raakh, s, app)) {
        if (t.locked && !has(s, CHATS_UNLOCKED)) continue;
        const r = offline(raakh, s) ? undefined : openReply(s, t);
        const o = r && pick(s, r, policy);
        if (o) {
          s = keepClock(raakh, add(s, ...(o.sets ?? [])), `said:${o.sets?.[0]}`, 0);
          said = true;
        }
      }
    }
    if (said) continue;
    const due = dueEvents(raakh, s)[0];
    if (due) {
      s = fire(raakh, s, due.id, step);
      continue;
    }
    const q = openQuestion(raakh, s);
    if (q) {
      s = solve(raakh, s, q.id, policy);
      continue;
    }
    // A hunch filed, or his version: file the truth over it once it can be (a Revisit), if this player tells the truth.
    const side = policy.version ? undefined : sideQuestions(raakh, s).find((x) => x.contestable);
    if (side) {
      try {
        s = solve(raakh, s, side.id, { ...policy, hunch: [] });
        continue;
      } catch {
        // Not provable yet.
      }
    }
    throw new Error(`stuck at ${scene.kind}, question ${openQuestion(raakh, s)?.id ?? "none"}, episode flags ${s.flags.filter((f) => f.startsWith("ep:")).join(",")}; last flags ${s.flags.slice(-6).join(" ")}`);
  }
  throw new Error(`ran out of steps at ${sceneOf(raakh, s).kind}`);
}

/** Whether an item is somewhere the player could have deleted it from. */
function visibleItem(s: CaseState, item: string): boolean {
  const lib = library(raakh, s);
  if ([...lib.recents, ...lib.bin].some((p) => p.id === item && loaded(s, p))) return true;
  if ([...memos(raakh, s).recordings, ...memos(raakh, s).bin].some((m) => m.id === item) && has(s, installed("voicememos"))) return true;
  if (raakh.notes.some((n) => has(s, unlocked(n.id)) && n.attachments?.some((a) => a.id === item))) return true;
  return raakh.threads.some((t) => conversation(s, t, "29/11").some((m) => m.id === item)) && has(s, CHATS_UNLOCKED);
}

export { recover, restored };
