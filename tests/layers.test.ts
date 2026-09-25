import { describe, expect, it } from "vitest";

import { add, episodeOf, homeIcons, newCase, see, seen, settle, type CaseState } from "@/lib/game/engine";
import { installed, library, loaded, memos, offload, SHOW_HIDDEN, syncPaused, unlocked } from "@/lib/game/phone";
import { episode3 } from "@/content/shagun/episode3";
import { ep, play } from "./support/play";

/**
 * The phone in layers (CHAPTER1.md F, decided 2026-09-25; PLAYTEST-SHAGUN.md
 * #11): what would give an episode away has a door a player can find in
 * Episode 1 and can't open until its own episode.
 *   Episode 2's: the 12:29 photo and the reel take still in iCloud, and
 *   Voice Memos, with the memo in its bin, offloaded.
 *   Episode 3's: the whole fire clip and Kunal's frame in his locked note,
 *   whose password (0152) nothing on the phone gives before Episode 3.
 */

const start = (): CaseState => add(newCase("layers", 0), "did:opened", "did:unlock", "saw:note", "did:past-lock");
const photo = (id: string) => ep.photos.find((p) => p.id === id)!;
const voiceMemos = homeIcons(ep).find((i) => i.app === "voicememos")!;
const insurance = ep.notes.find((n) => n.id === "insurance")!;

describe("Episode 1's phone", () => {
  const s = start();

  it("has the 12:29 photo and the reel take only as thumbnails, and says iCloud is paused", () => {
    for (const id of ["bts", "reel-take"]) expect(loaded(s, photo(id)), id).toBe(false);
    expect(library(ep, s).bin.map((p) => p.id)).toContain("reel-take");
    expect(syncPaused(ep, s)).toBe(true);
  });

  it("has Voice Memos offloaded, and the App Store won't bring it back yet", () => {
    expect(offload(s, voiceMemos)).toBe("offloaded");
  });

  it("keeps the locked note's password out of reach, and its hint to itself", () => {
    expect(insurance.locked).toBe(true);
    expect(insurance.hint).toBeTruthy();
    expect(insurance.knownAfter).toEqual(["ep:3"]);
  });

  it("shows only his hidden EMI notices in Hidden", () => {
    const hidden = library(ep, add(s, SHOW_HIDDEN)).hidden ?? [];
    expect(hidden.length).toBeGreaterThan(0);
    for (const p of hidden) expect(p.evidence, p.id).toBeUndefined();
  });

  it("never gives the password: nothing a player can read before Episode 3 says 1:52", () => {
    const early = (requires?: readonly string[]) => !(requires ?? []).includes("ep:3");
    // Episode 3's own chats only arrive in Episode 3.
    const third = new Set(episode3.threads.map((t) => t.id));
    const readable = [
      ...ep.threads.filter((t) => !third.has(t.id) && early(t.requires)).flatMap((t) => t.messages.filter((m) => early(m.requires))),
      ...ep.photos,
      ...ep.notes.filter((n) => n.id !== "insurance"),
      ...ep.mail,
      ...ep.memos,
      ...ep.searches,
      ...ep.calls,
      ...ep.payments,
      ...ep.settings,
    ];
    // 1:52 or 0152 on its own, not inside Kunal's 11:52.
    const said = JSON.stringify(readable).match(/(?<!\d)(?:0?1:52|0152)(?!\d)/);
    expect(said?.[0]).toBeUndefined();
  });
});

describe("the turn to Episode 2", () => {
  const s = play((x, scene) => episodeOf(x) === 2 && scene.kind === "table");

  it("brings the photo and the take down, and Voice Memos back when it's tapped", () => {
    for (const id of ["bts", "reel-take"]) expect(loaded(s, photo(id)), id).toBe(true);
    expect(syncPaused(ep, s)).toBe(false);
    expect(offload(start(), voiceMemos)).toBe("offloaded");
    expect(offload(add(start(), "ep:2"), voiceMemos)).toBe("available");
    expect(offload(add(start(), "ep:2", installed("voicememos")), voiceMemos)).toBe("installed");
  });

  it("finds the memo only once Voice Memos is back", () => {
    const at2 = add(start(), "ep:2");
    expect(memos(ep, at2).bin.map((m) => m.id)).toContain("memo-458");
    expect(seen(see(ep, at2, "memo"), "memo")).toBe(false);
    expect(seen(settle(ep, add(see(ep, at2, "memo"), installed("voicememos"))), "memo")).toBe(true);
  });
});

describe("the locked note", () => {
  it("opens with the minute of the lie and counts what's in it, in Episode 3", () => {
    expect(insurance.password).toBe("0152");
    const ids = (insurance.attachments ?? []).map((a) => a.evidence);
    expect(ids).toEqual(["fire-original", "frame"]);
    const at3 = add(start(), "ep:2", "ep:3");
    for (const id of ["fire-original", "frame"]) {
      expect(seen(see(ep, at3, id), id), `${id} before it's opened`).toBe(false);
      expect(seen(see(ep, add(at3, unlocked("insurance")), id), id)).toBe(true);
    }
  });

  it("opened early by a lucky guess, counts once Episode 3 opens", () => {
    const guessed = see(ep, add(start(), unlocked("insurance")), "frame");
    expect(seen(guessed, "frame")).toBe(false);
    expect(seen(settle(ep, add(guessed, "ep:2", "ep:3")), "frame")).toBe(true);
  });
});

describe("what's read in plain view before it can count (PLAYTEST-SHAGUN.md #25)", () => {
  it("counts the moment its episode opens, so the chat carries no badge", () => {
    const read = see(ep, start(), "gun-to-kunal");
    expect(seen(read, "gun-to-kunal")).toBe(false);
    expect(seen(settle(ep, add(read, "ep:2")), "gun-to-kunal")).toBe(true);
  });

  it("isn't counted for what was never read", () => {
    expect(seen(settle(ep, add(start(), "ep:2")), "gun-to-kunal")).toBe(false);
  });
});
