import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import type { Flag, Story } from "@/content/types";
import { openReply } from "@/lib/game/chat";
import { add, all, dueEvents, fire, has, newCase, traced, type CaseState } from "@/lib/game/engine";
import { chosen } from "@/lib/game/endings";
import { momentDone, sceneOf, titleShown } from "@/lib/game/scene";
import { unlocked } from "@/lib/game/phone";
import { stationOf, statusOf } from "@/lib/game/route";

/**
 * Last Local (LAST-LOCAL.md), played by a solver: every ending reachable by
 * the moves a player can make, and the night never stuck.
 */

const story: Story = STORIES.lastlocal;

/** What a player picks: an option per exchange, call or moment, optionally only once a flag holds. */
type Plan = Readonly<Record<string, string | { readonly option: string; readonly when: Flag }>>;

/** Everything a careful player would have read by now. */
function look(s: CaseState): CaseState {
  let next = s;
  for (const n of story.notes) if (n.locked && n.knownAfter && all(next, n.knownAfter)) next = add(next, unlocked(n.id));
  const seen = story.evidence
    .filter((e) => all(next, e.requires) && (e.app !== "notes" || has(next, unlocked("original"))))
    .map((e): Flag => `saw:${e.id}`);
  return add(next, ...seen);
}

function pick(plan: Plan, id: string, s: CaseState): string | undefined {
  const p = plan[id];
  if (!p) return undefined;
  if (typeof p === "string") return p;
  return has(s, p.when) ? p.option : undefined;
}

function playOut(plan: Plan, extra: { readonly at?: Flag; readonly set: Flag }[] = []): CaseState {
  let s = add(newCase("solver", 0), "did:opened", "did:unlock", "saw:note", "did:past-lock");
  for (let step = 0; step < 400; step++) {
    s = look(s);
    for (const x of extra) if ((!x.at || has(s, x.at)) && !has(s, x.set)) s = add(s, x.set);
    const scene = sceneOf(story, s);
    if (scene.kind === "ending") return s;
    if (scene.kind === "title") {
      s = add(s, titleShown(scene.episode));
      continue;
    }
    if (scene.kind === "ringing") {
      const { call } = scene;
      const id = pick(plan, call.id, s) ?? call.reply?.options[0].id;
      const o = call.reply?.options.find((x) => x.id === id);
      s = add(s, `did:answered-${call.id}`, ...(o?.sets ?? []), `did:done-${call.id}`);
      continue;
    }
    if (scene.kind === "moment") {
      const { moment } = scene;
      const id = pick(plan, moment.id, s) ?? moment.timeout ?? moment.options[0].id;
      const o = moment.options.find((x) => x.id === id)!;
      s = add(s, momentDone(moment.id), ...o.sets);
      continue;
    }
    // Say what the plan says, wherever there's something to say.
    let said = false;
    for (const t of story.threads) {
      const r = openReply(s, t);
      const id = r && pick(plan, r.id, s);
      const o = id ? r.options.find((x) => x.id === id && all(s, x.requires)) : undefined;
      if (o) {
        s = add(s, ...(o.sets ?? []));
        said = true;
      }
    }
    if (said) continue;
    const due = dueEvents(story, s)[0];
    if (due) {
      s = fire(story, s, due.id);
      continue;
    }
    throw new Error(`stuck: ${sceneOf(story, s).kind}, ${s.flags.slice(-6).join(" ")}`);
  }
  throw new Error("never ended");
}

const BEST: Plan = {
  rohit: "police",
  "a-reply": "where",
  "imran-ask": "truth",
  "imran-send": "send",
  "rohit-side": "ananya",
  "impostor-reply": "who",
  "real-call": "near",
  vasai: "stay",
};

describe("Last Local, every ending", () => {
  it("Morning Edition: the files in, stayed on, every link traced", () => {
    const s = playOut(BEST);
    expect(chosen(story, s)?.id).toBe("morning");
    expect(traced(story, s).map((l) => l.id)).toEqual(story.chain.map((l) => l.id));
  });

  it("The Decoy: the files in, the phone left on the seat", () => {
    expect(chosen(story, playOut({ ...BEST, vasai: "decoy" }))?.id).toBe("decoy");
  });

  it("Too Late: the files held back", () => {
    expect(chosen(story, playOut({ ...BEST, "imran-send": "hold" }))?.id).toBe("late");
  });

  it("sent after the gap, the files drop, and a resend lands at Nalasopara", () => {
    const s = playOut({ ...BEST, "imran-send": "hold", "imran-send-again": { option: "send2", when: "fired:dead-zone" }, "imran-resend": "resend" });
    expect(has(s, "fired:upload-dropped")).toBe(true);
    expect(chosen(story, s)?.id).toBe("morning");
  });

  it("Wrong Platform: off at Vasai", () => {
    expect(chosen(story, playOut({ ...BEST, vasai: "off" }))?.id).toBe("platform");
  });

  it("Lost and Found: 139", () => {
    expect(chosen(story, playOut({ ...BEST, vasai: "139" }))?.id).toBe("lost");
  });

  it("The Family's Version: sided with Rohit and handed it over at Borivali", () => {
    const s = playOut({ ...BEST, rohit: "tell", "rohit-side": "family", borivali: "give" });
    expect(chosen(story, s)?.id).toBe("family");
    expect(has(s, "fired:shinde-boards")).toBe(false);
  });

  it("refused at Borivali, the night goes on to Vasai", () => {
    const s = playOut({ ...BEST, "rohit-side": "family", borivali: "keep" });
    expect(has(s, "did:moment-vasai")).toBe(true);
    expect(chosen(story, s)?.id).toBe("morning");
  });

  it("turning the location off brings Shinde's call, and the night still ends", () => {
    const s = playOut({ ...BEST, "shinde-calls": "floors" }, [{ at: "fired:title-2", set: "did:location-off" }]);
    expect(has(s, "did:done-shinde-calls")).toBe(true);
    expect(chosen(story, s)?.id).toBe("morning");
  });
});

describe("Last Local, its clocks", () => {
  it("tracks the train from Dadar to Virar", () => {
    const s = playOut(BEST);
    expect(stationOf(story, add(newCase("x", 0)))?.here).toBe("Dadar");
    expect(stationOf(story, s)?.here).toBe("Virar");
  });

  it("always says what's going on, and ends knowing the texts were Shinde's", () => {
    expect(statusOf(story, newCase("x", 0))).toMatch(/Dadar/);
    expect(statusOf(story, playOut(BEST))).toMatch(/weren't her/);
  });

  it("says where the upload stands: in, dropped, and in again", () => {
    expect(statusOf(story, add(newCase("x", 0), "did:imran-knows", "did:sent-files", "did:files-in"))).toMatch(/Imran has the files/);
    const dropped = add(newCase("x", 0), "did:imran-knows", "did:sent-files", "fired:shinde-boards", "fired:upload-dropped");
    expect(statusOf(story, dropped)).toMatch(/dead zone/);
    expect(statusOf(story, add(dropped, "did:files-in"))).toMatch(/Imran has the files/);
  });

  it("keeps every player line free of gendered verbs", () => {
    const lines = [
      ...story.threads.flatMap((t) => (t.replies ?? []).flatMap((r) => r.options.map((o) => o.text))),
      ...story.incoming.flatMap((c) => c.reply?.options.map((o) => o.text) ?? []),
    ];
    // First person only: "she got off" is hers to be gendered, never the player's "I".
    for (const l of lines) expect(l, l).not.toMatch(/\b(raha|rahi|gaya|gayi|sakta|sakti) hoon\b|\b(karunga|karungi|dunga|dungi|jaunga|jaungi)\b/);
  });
});
