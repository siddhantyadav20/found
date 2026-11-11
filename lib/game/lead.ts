import type { AppId, Flag, IncomingCall, Question, Reply, Story, Thread } from "@/content/types";
import { offeredOptions, openReply, threadsIn } from "./chat";
import {
  all,
  answered,
  appLabel,
  factRoutes,
  filingFor,
  has,
  hint,
  homeIcons,
  leadClaim,
  offline,
  pinning,
  seen,
  usable,
  type CaseState,
  type Hint,
} from "./engine";
import { CHATS_UNLOCKED, installed, offload, SHOW_HIDDEN, unlocked } from "./phone";

/* ===========================================================================
   Where to go next, worked out from the script (2026-11-11).

   Help that's written by hand goes stale the day the script changes: a hint
   that names the waybill is wrong once the waybill moves, and a hint that
   gives the answer is no help to a player who has half of it already. This
   reads the same data the game runs on instead. For a question, it finds the
   first row still waiting, the nearest way to show it, and the first thing
   on that way the player hasn't opened; then what stands in front of that
   thing (a locked chat, an app to download again, a reply somebody is
   waiting for), all the way back to something the player can do now.

   With no question open, `waitingOn` says what the night is waiting for: a
   reply, the phone put down, a question elsewhere. A test plays a whole
   chapter doing nothing but what these say (tests/leads.test.ts), so no
   rewrite can leave a player with nowhere to go and the help saying nothing.
   =========================================================================== */

/** The one thing to do next. */
export type Lead =
  /** Open something on the phone. */
  | { readonly kind: "open"; readonly evidence: string; readonly app: AppId; readonly where: string; readonly how?: string }
  /** Somebody is waiting for the player's reply. */
  | { readonly kind: "reply"; readonly app: AppId; readonly thread: string; readonly who: string }
  /** Something on the phone has to be done first: a code, a password, a download, a switch; and what doing it sets. */
  | { readonly kind: "do"; readonly app: AppId; readonly text: string; readonly sets: readonly Flag[] }
  /** Another question has to be answered first. */
  | { readonly kind: "answer"; readonly question: string; readonly ask: string }
  /** The night moves on by itself: on the home screen (`quiet`), or in a moment. */
  | { readonly kind: "wait"; readonly quiet: boolean }
  /** Something already found answers a row: pin it there (2026-11-12). */
  | { readonly kind: "pin"; readonly question: string; readonly row: number; readonly evidence: string; readonly label: string; readonly what: string };

/* --- where things are ----------------------------------------------------- */

type Holder =
  | { readonly kind: "message"; readonly thread: Thread; readonly requires?: readonly Flag[] }
  | { readonly kind: "photo"; readonly id: string; readonly title: string; readonly requires?: readonly Flag[]; readonly inCloud?: readonly Flag[]; readonly hidden?: boolean; readonly bin?: boolean; readonly how?: string; readonly note?: string }
  | { readonly kind: "note"; readonly id: string; readonly title: string }
  | { readonly kind: "memo"; readonly title: string; readonly requires?: readonly Flag[]; readonly bin?: boolean }
  | { readonly kind: "plain"; readonly where: string; readonly requires?: readonly Flag[]; readonly how?: string };

const quoted = (t: string) => `“${t}”`;

/** A photo's title is its whole description; said in a hint, its first clause is enough. */
const short = (t: string) => (t.length > 48 && t.indexOf(", ") > 12 ? t.slice(0, t.indexOf(", ")) : t);

/** What on the phone carries a piece of evidence, and what that thing waits for. */
function holderOf(story: Story, id: string): Holder | undefined {
  for (const t of story.threads) {
    if (t.contact?.evidence === id) return { kind: "message", thread: t };
    const m = [...t.messages, ...(t.replies ?? []).flatMap((r) => r.options.flatMap((o) => o.then ?? []))].find((x) => x.evidence === id);
    if (m) return { kind: "message", thread: t, requires: m.requires };
  }
  for (const n of story.notes) {
    if (n.evidence === id) return { kind: "note", id: n.id, title: n.title };
    const a = n.attachments?.find((p) => p.evidence === id);
    if (a) return { kind: "photo", id: a.id, title: a.title, requires: a.requires, note: n.id, bin: Boolean(a.deletedAt) };
  }
  for (const p of story.photos) {
    const base = { kind: "photo" as const, id: p.id, title: p.title, requires: p.requires, inCloud: p.inCloud, hidden: p.hidden, bin: Boolean(p.deletedAt) };
    if (p.evidence === id) return base;
    if (p.zoom?.evidence === id) return { ...base, how: "Zoom right in on it." };
    if (p.original?.evidence === id) return { ...base, how: "Edit, then Revert, brings back what was cut." };
    if (p.chat?.lines.some((l) => l.evidence === id)) return base;
  }
  const memo = story.memos.find((m) => m.evidence === id);
  if (memo) return { kind: "memo", title: memo.title, requires: memo.requires, bin: Boolean(memo.deletedAt) };
  const mail = story.mail.find((m) => m.evidence === id || m.attachment?.evidence === id);
  if (mail) return { kind: "plain", where: `the mail ${quoted(mail.subject)}`, requires: mail.requires };
  const pay = story.payments.find((p) => p.evidence === id);
  if (pay) return { kind: "plain", where: `the payment ${pay.amount < 0 ? "to" : "from"} ${pay.who}`, requires: pay.requires };
  const call = story.calls.find((c) => c.evidence === id);
  if (call) return { kind: "plain", where: `${call.name}, in Recents`, requires: call.requires };
  const search = story.searches.find((x) => x.evidence === id);
  if (search) return { kind: "plain", where: `${quoted(search.text)} in History`, requires: search.requires };
  for (const g of story.settings) {
    const row = g.rows.find((r) => r.evidence === id);
    if (row) return { kind: "plain", where: quoted(row.title), requires: row.requires };
  }
  for (const p of story.profiles) {
    if (p.evidence === id) return { kind: "plain", where: `@${p.handle}`, requires: p.requires };
    const post = p.posts.find((x) => x.evidence === id);
    if (post) return { kind: "plain", where: `a post on @${p.handle}`, requires: [...(p.requires ?? []), ...(post.requires ?? [])] };
  }
  return undefined;
}

/** A thread as a person says it: "the chat with Nitin", "the “Sehgal Shaadi” group". */
const chatName = (t: Thread) => (t.group ? `the ${quoted(t.name)} group` : `the chat with ${t.name}`);

/* --- what makes a flag true ----------------------------------------------- */

type Maker =
  | { readonly kind: "reply"; readonly thread: Thread; readonly reply: Reply }
  | { readonly kind: "call"; readonly call: IncomingCall }
  | { readonly kind: "event"; readonly id: string }
  | { readonly kind: "question"; readonly q: Question }
  | { readonly kind: "setting"; readonly where: string; readonly sets: readonly Flag[] }
  /** A scene the story stops for (a dark screen, a moment): it comes once these hold. */
  | { readonly kind: "scene"; readonly after: readonly Flag[] }
  | { readonly kind: "story" };

const makersCache = new WeakMap<Story, Map<string, Maker[]>>();

/** Everything in the story that sets each flag. */
function makers(story: Story): Map<string, Maker[]> {
  const cached = makersCache.get(story);
  if (cached) return cached;
  const map = new Map<string, Maker[]>();
  const put = (flags: readonly Flag[] | undefined, m: Maker) => {
    for (const f of flags ?? []) map.set(f, [...(map.get(f) ?? []), m]);
  };
  for (const t of story.threads) for (const r of t.replies ?? []) for (const o of r.options) put(o.sets, { kind: "reply", thread: t, reply: r });
  const calls = [...story.incoming, ...(story.reveal ? [story.reveal.call, story.reveal.yours.call] : [])];
  for (const c of calls) {
    put(c.sets, { kind: "call", call: c });
    let rs: Reply[] = c.reply ? [c.reply] : [];
    while (rs.length) {
      for (const r of rs) for (const o of r.options) put(o.sets, { kind: "call", call: c });
      rs = rs.flatMap((r) => r.options.flatMap((o) => (o.next ? [o.next] : [])));
    }
  }
  for (const e of story.events) put(e.sets, { kind: "event", id: e.id });
  for (const q of story.questions) {
    put(q.sets, { kind: "question", q });
    if (q.kind === "file") for (const c of q.claims) put(c.sets, { kind: "question", q });
  }
  for (const g of story.settings)
    for (const r of g.rows) {
      if (r.toggle) put(r.toggle.sets, { kind: "setting", where: r.title, sets: r.toggle.sets });
      if (r.action) put(r.action.sets, { kind: "setting", where: `${r.title} › ${r.action.label}`, sets: r.action.sets });
      for (const d of r.detail?.rows ?? []) if (d.toggle) put(d.toggle.sets, { kind: "setting", where: `${r.title} › ${d.label}`, sets: d.toggle.sets });
    }
  for (const m of story.moments ?? []) for (const o of m.options) put(o.sets, { kind: "scene", after: m.after });
  for (const d of story.dark ?? []) put(d.sets, { kind: "scene", after: d.after });
  makersCache.set(story, map);
  return map;
}

/* --- the way there -------------------------------------------------------- */

type Walk = { readonly story: Story; readonly s: CaseState; readonly seen: Set<string>; depth: number };

/** The first of these flags that isn't set, walked back to something the player can do. */
function first(w: Walk, flags: readonly Flag[] | undefined): Lead | undefined {
  for (const f of flags ?? []) if (!has(w.s, f)) return toward(w, f) ?? { kind: "wait", quiet: false };
  return undefined;
}

/** What makes this flag true, as something the player can do now (or wait for). */
function toward(w: Walk, flag: Flag): Lead | undefined {
  const { story, s } = w;
  if (has(s, flag) || w.seen.has(flag) || w.depth > 12) return undefined;
  w.seen.add(flag);
  w.depth++;
  try {
    const [family, ...rest] = flag.split(":");
    const id = rest.join(":");
    if (family === "saw") return leadTo(w, id);
    if (family === "ask" || family === "claim") {
      const q = story.questions.find((x) => x.id === id.split(":")[0]);
      if (!q || answered(s, q.id)) return undefined;
      return all(s, q.requires) ? { kind: "answer", question: q.id, ask: q.ask } : first(w, q.requires);
    }
    if (family === "fired") {
      const e = story.events.find((x) => x.id === id);
      if (!e || (e.unless ?? []).some((f) => has(s, f))) return undefined;
      return all(s, e.after) ? { kind: "wait", quiet: Boolean(e.quiet) } : first(w, e.after);
    }
    if (family === "ep") return { kind: "wait", quiet: false };
    // What the phone's own gates set: opening them is the way.
    if (flag === CHATS_UNLOCKED) return chatCode(w);
    if (flag.startsWith("did:installed-")) return download(w, flag.slice("did:installed-".length) as AppId);
    if (flag.startsWith("did:unlocked-")) {
      const n = story.notes.find((x) => unlocked(x.id) === flag);
      return n && noteGate(w, n.id);
    }
    for (const m of makers(story).get(flag) ?? []) {
      const l = byMaker(w, m);
      if (l) return l;
    }
    return undefined;
  } finally {
    w.depth--;
  }
}

function byMaker(w: Walk, m: Maker): Lead | undefined {
  const { s } = w;
  switch (m.kind) {
    case "reply": {
      if ((m.reply.unless ?? []).some((f) => has(s, f))) return undefined;
      if (!all(s, m.thread.requires)) return first(w, m.thread.requires);
      if (!all(s, m.reply.requires)) return first(w, m.reply.requires);
      const t = m.thread;
      if (t.locked && !has(s, CHATS_UNLOCKED)) return chatCode(w);
      return openReply(s, t) === m.reply ? { kind: "reply", app: t.app, thread: t.id, who: t.name } : undefined;
    }
    case "call":
      return all(s, m.call.after) ? { kind: "wait", quiet: false } : first(w, m.call.after);
    case "event":
      return toward(w, `fired:${m.id}`);
    case "question":
      return answered(s, m.q.id) ? undefined : all(s, m.q.requires) ? { kind: "answer", question: m.q.id, ask: m.q.ask } : first(w, m.q.requires);
    case "setting":
      return { kind: "do", app: "settings", text: `In Settings, ${m.where}.`, sets: m.sets };
    case "scene":
      return all(s, m.after) ? { kind: "wait", quiet: false } : first(w, m.after);
    case "story":
      return { kind: "wait", quiet: false };
  }
}

/** WhatsApp's hidden chats: the code, once it can open anything and once it can be known. */
function chatCode(w: Walk): Lead | undefined {
  const lock = w.story.chatLock;
  if (!lock) return undefined;
  if (!all(w.s, lock.requires)) return first(w, lock.requires);
  if (!lock.knownWhen.some((r) => all(w.s, r))) {
    const nearest = lock.knownWhen.toSorted((a, b) => a.filter((f) => !has(w.s, f)).length - b.filter((f) => !has(w.s, f)).length)[0];
    return first(w, nearest);
  }
  return { kind: "do", app: "whatsapp", text: "Some chats are locked and hidden: type their secret code into WhatsApp's Search.", sets: [CHATS_UNLOCKED] };
}

/** An offloaded app has to come back first. */
function download(w: Walk, app: AppId): Lead | undefined {
  const icon = homeIcons(w.story).find((i) => i.app === app);
  if (!icon) return undefined;
  const state = offload(w.s, icon);
  if (state === "installed") return undefined;
  if (state === "offloaded") return first(w, icon.offloaded);
  return { kind: "do", app, text: `${appLabel(w.story, app)} has been offloaded: tap its icon on the Home Screen to download it again.`, sets: [installed(app)] };
}

/** The way to one piece of evidence: what's in front of it, or the thing itself. */
function leadTo(w: Walk, id: string): Lead | undefined {
  const { story, s } = w;
  const e = story.evidence.find((x) => x.id === id);
  if (!e || seen(s, id)) return undefined;
  const gate = first(w, e.requires) ?? first(w, e.foundBy);
  if (gate) return gate;
  const h = holderOf(story, id);
  const app = e.app;
  const label = appLabel(story, app);
  const heard = e.heard ? " Play it to the end." : "";
  const off = download(w, app);
  if (off) return off;
  if (!h) return { kind: "open", evidence: id, app, where: e.from ?? label, how: heard.trim() || undefined };
  switch (h.kind) {
    case "message": {
      const t = h.thread;
      const g = first(w, t.requires) ?? first(w, h.requires);
      if (g) return g;
      if (t.locked && !has(s, CHATS_UNLOCKED)) return chatCode(w) ?? { kind: "wait", quiet: false };
      const how = [t.archived ? "It's in Archived, at the top of the chat list." : "", heard.trim()].filter(Boolean).join(" ");
      return { kind: "open", evidence: id, app: t.app, where: t.contact?.evidence === id ? `${t.name}'s contact info (tap the name at the top)` : chatName(t), how: how || undefined };
    }
    case "photo": {
      if (h.note) return leadToNote(w, h.note, id, app) ?? undefined;
      const g = first(w, h.requires) ?? first(w, h.inCloud);
      if (g) return g;
      if (h.hidden && !has(s, SHOW_HIDDEN)) return byMaker(w, makers(story).get(SHOW_HIDDEN)?.[0] ?? { kind: "story" });
      const how = [h.bin ? "It's in Recently Deleted." : "", h.hidden ? "It's in the Hidden album." : "", h.how ?? "", heard.trim()].filter(Boolean).join(" ");
      return { kind: "open", evidence: id, app, where: `the photo ${quoted(short(h.title))}`, how: how || undefined };
    }
    case "note":
      return leadToNote(w, h.id, id, app);
    case "memo": {
      const g = first(w, h.requires);
      if (g) return g;
      const how = [h.bin ? "It's in Recently Deleted." : "", heard.trim()].filter(Boolean).join(" ");
      return { kind: "open", evidence: id, app, where: `the recording ${quoted(h.title)}`, how: how || undefined };
    }
    case "plain": {
      const g = first(w, h.requires);
      if (g) return g;
      if (app === "safari") {
        const waits = first(w, story.safariWaits?.until);
        if (waits) return waits;
        if (offline(story, s)) return { kind: "do", app: "safari", text: "The phone is offline: turn Airplane Mode off in Control Centre.", sets: [] };
      }
      return { kind: "open", evidence: id, app, where: h.where, how: h.how ?? (heard.trim() || undefined) };
    }
  }
}

/** What stands in front of a note: its own gates, its download, and its password. */
function noteGate(w: Walk, noteId: string): Lead | undefined {
  const n = w.story.notes.find((x) => x.id === noteId);
  if (!n) return undefined;
  const g = first(w, n.requires);
  if (g) return g;
  if (!n.locked) return undefined;
  const down = first(w, n.downloadsAfter);
  if (down) return down;
  if (has(w.s, unlocked(n.id))) return undefined;
  return (
    first(w, n.knownAfter) ?? { kind: "do", app: "notes", text: `The note ${quoted(n.title)} is locked. ${n.hintAgain ?? "Its password is somewhere on the phone."}`, sets: [unlocked(n.id)] }
  );
}

function leadToNote(w: Walk, noteId: string, id: string, app: AppId): Lead | undefined {
  const n = w.story.notes.find((x) => x.id === noteId);
  if (!n) return undefined;
  return noteGate(w, noteId) ?? { kind: "open", evidence: id, app, where: `the note ${quoted(n.title)}` };
}

const walk = (story: Story, s: CaseState): Walk => ({ story, s, seen: new Set(), depth: 0 });

/* --- for a question --------------------------------------------------------- */

/** The rows a question is waiting on, in its order: what its true line claims and nothing shows yet. */
function waitingRows(story: Story, s: CaseState, q: Question): { what: string; routes: (readonly string[])[] }[] {
  if (q.kind !== "file") return [];
  if (story.filing === "lines") {
    const { rows, lines } = filingFor(story, s, q);
    if (!q.final) return rows.filter((r) => !r.by).map((r) => ({ what: r.fact.what, routes: factRoutes(r.fact) }));
    if (lines.some((l) => l.proof)) return [];
    // The last question: the first ending that still needs something, by what it needs.
    const target = lines.find((l) => l.needs.length && !l.closed);
    return (target?.claim.facts ?? [])
      .filter((f) => !factRoutes(f).some((r) => r.every((id) => usable(story, s, id))))
      .map((f) => ({ what: f.what, routes: factRoutes(f) }));
  }
  const c = leadClaim(q);
  if (!c) return [];
  if (c.facts?.length) return c.facts.filter((f) => !factRoutes(f).some((r) => r.every((id) => seen(s, id)))).map((f) => ({ what: f.what, routes: factRoutes(f) }));
  const routes = [c.proof, ...(c.orProof ?? [])];
  return routes.some((r) => r.every((id) => seen(s, id))) ? [] : [{ what: "", routes }];
}

/** What to open next for a question, and the row it's for. Nothing when everything it needs is shown. */
export function leadFor(story: Story, s: CaseState, q: Question): { lead: Lead; what: string } | undefined {
  // Already found and not yet pinned: the nearest thing of all to do.
  if (story.filing === "lines" && !q.final && pinning(story, s)) {
    const row = filingFor(story, s, q).rows.find((r) => !r.by && r.shown);
    if (row?.shown) {
      const evidence = row.shown.toSorted((a, b) => s.flags.lastIndexOf(`saw:${b}`) - s.flags.lastIndexOf(`saw:${a}`))[0];
      const label = story.evidence.find((e) => e.id === evidence)?.label ?? evidence;
      return { lead: { kind: "pin", question: q.id, row: row.i, evidence, label, what: row.fact.what }, what: row.fact.what };
    }
  }
  // Something to do now beats something to wait for, whichever row it's for.
  let waiting: { lead: Lead; what: string } | undefined;
  for (const row of waitingRows(story, s, q)) {
    // The nearest way: the fewest things still to find, none of them gone for good.
    const routes = row.routes
      .filter((r) => r.every((id) => !seen(s, id) || usable(story, s, id)))
      .toSorted((a, b) => a.filter((id) => !seen(s, id)).length - b.filter((id) => !seen(s, id)).length);
    for (const r of routes) {
      for (const id of r.filter((x) => !seen(s, x))) {
        const lead = leadTo(walk(story, s), id);
        if (lead && lead.kind !== "wait") return { lead, what: row.what };
        if (lead) waiting ??= { lead, what: row.what };
      }
    }
  }
  return waiting;
}

/**
 * The apps still worth looking in for a question: where its waiting rows can
 * be shown, now. Read off the script, so it never names an app the rewrite
 * moved things out of; the question's own `whereToLook` when there's nothing to read.
 */
export function appsFor(story: Story, s: CaseState, q: Question): readonly AppId[] {
  const apps = waitingRows(story, s, q)
    .flatMap((r) => r.routes.flat())
    .filter((id) => !seen(s, id))
    .map((id) => story.evidence.find((e) => e.id === id))
    .filter((e) => e && !e.from)
    .map((e) => e!.app);
  return apps.length ? [...new Set(apps)] : q.whereToLook;
}

/* --- with nothing to answer ----------------------------------------------- */

/** What the night is waiting for, when no question is: a reply, the phone put down, something to open. */
export function waitingOn(story: Story, s: CaseState): Lead | undefined {
  // Somebody waiting for an answer comes first: that's what holds most nights up.
  for (const app of ["whatsapp", "messages", "instagram", "yours:chats"] as const) {
    for (const t of threadsIn(story, s, app)) {
      if (t.locked && !has(s, CHATS_UNLOCKED)) continue;
      const r = openReply(s, t);
      if (r && offeredOptions(s, r).length) return { kind: "reply", app: t.app, thread: t.id, who: t.name };
    }
  }
  const pending = story.events.filter((e) => !has(s, `fired:${e.id}`) && !(e.unless ?? []).some((f) => has(s, f)));
  const due = pending.find((e) => all(s, e.after));
  if (due) return { kind: "wait", quiet: Boolean(due.quiet) };
  // The event nearest to happening, and the first thing the player can do towards it.
  const near = pending.toSorted((a, b) => a.after.filter((f) => !has(s, f)).length - b.after.filter((f) => !has(s, f)).length);
  for (const e of near) {
    const l = first(walk(story, s), e.after);
    if (l && l.kind !== "wait") return l;
  }
  return undefined;
}

/* --- said aloud ----------------------------------------------------------- */

/**
 * A lead in words. Tier 2 says where, never what: the app, and what the row
 * is about. Tier 3 says the thing itself, and what to do to reach it.
 */
export function sayLead(story: Story, lead: Lead, tier: 2 | 3, what = ""): string {
  const app = (a: AppId) => (a === "casefile" ? "the case file" : appLabel(story, a));
  switch (lead.kind) {
    case "open":
      return tier === 2
        ? `Look in ${app(lead.app)}${what ? `: something there shows ${what}` : ""}.`
        : `Open ${lead.where} in ${app(lead.app)}.${lead.how ? ` ${lead.how}` : ""}`;
    case "reply":
      return tier === 2 ? `Someone in ${app(lead.app)} is waiting for an answer.` : `${lead.who} is waiting for your reply in ${app(lead.app)}.`;
    case "do":
      return tier === 2 ? `Something in ${app(lead.app)} has to be opened first.` : lead.text;
    case "answer":
      return `Answer ${quoted(lead.ask)} in the case file first.`;
    case "wait":
      return lead.quiet ? "Put the phone down for a moment: the night moves on while nobody's holding it." : "Give it a moment: something's on its way.";
    case "pin":
      return tier === 2
        ? `You've already found what shows ${lead.what}. Pin it to that line in the case file.`
        : `In the case file, pin ${quoted(clueName(lead.label))} to ${quoted(lead.what)}.`;
  }
}

/** A clue as a hint says it: its label up to the first ": ", unless that's too short to tell apart ("Screenshot"). */
export function clueName(label: string): string {
  const head = label.split(": ")[0].trim();
  return head.length < 9 || /screenshot|deleted memo/i.test(head) ? label : head;
}

/** The help for a tier, worked out now: the written nudge first, then where, then what. */
export function helpText(story: Story, s: CaseState, q: Question, tier: 1 | 2 | 3): string {
  if (tier === 1 || q.kind !== "file") return q.hints[tier - 1];
  const next = leadFor(story, s, q);
  if (next) return sayLead(story, next.lead, tier, next.what);
  if (story.filing === "lines" && filingFor(story, s, q).lines.some((l) => l.proof)) return "Everything this needs is on the phone, and in the rows above. File the line that's true.";
  return q.hints[tier - 1];
}

/** A hint, taken: the tier it counts as, said from where the player is now. */
export function helpFor(story: Story, s: CaseState, q: Question): Hint | null {
  const h = hint(story, s, q.id);
  return h && { ...h, text: helpText(story, s, q, h.tier) };
}
