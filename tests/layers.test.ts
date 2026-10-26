import { describe, expect, it } from "vitest";

import { add, episodeOf, homeIcons, newCase, see, seen, settle, type CaseState } from "@/lib/game/engine";
import { installed, isCode, library, loaded, memos, offload, SHOW_HIDDEN, syncPaused, unlocked } from "@/lib/game/phone";
import { all } from "@/lib/game/engine";
import { ep, play } from "./support/play";

/**
 * The phone in layers (CHAPTER1.md F, decided 2026-09-25; PLAYTEST-SHAGUN.md
 * #11): what would give an episode away has a door a player can find in
 * Episode 1 and can't open until its own episode.
 *   Episode 2's: the 12:29 photo and the reel take still in iCloud, and
 *   Voice Memos, with the memo in its bin, offloaded.
 *   Episode 3's: the whole fire clip and Kunal's frame in his locked note,
 *   whose password is his birthday (1403), in Settings; what's inside counts in Episode 3.
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

  it("locks the note with his birthday, which Settings shows under his name", () => {
    expect(insurance.locked).toBe(true);
    expect(insurance.hint).toMatch(/birthday/);
    expect(insurance.knownAfter).toEqual(["saw:apple-account"]);
    const account = ep.settings[0].rows[0];
    expect(account.detail?.rows.find((r) => r.label === "Date of Birth")?.value).toBe("14 March 1998");
    expect(insurance.password).toBe("1403");
  });

  it("shows only his hidden EMI notices in Hidden", () => {
    const hidden = library(ep, add(s, SHOW_HIDDEN)).hidden ?? [];
    expect(hidden.length).toBeGreaterThan(0);
    for (const p of hidden) expect(p.evidence, p.id).toBeUndefined();
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
  it("opens with his birthday and counts what's in it, in Episode 3", () => {
    expect(insurance.password).toBe("1403");
    const ids = (insurance.attachments ?? []).map((a) => a.evidence);
    expect(ids).toEqual(["fire-original", "frame"]);
    const at3 = add(start(), "ep:2", "ep:3");
    for (const id of ["fire-original", "frame"]) {
      expect(seen(see(ep, at3, id), id), `${id} before it's opened`).toBe(false);
      expect(seen(see(ep, add(at3, unlocked("insurance")), id), id)).toBe(true);
    }
  });

  it("opened early, counts once Episode 3 opens", () => {
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

/* Q3 of the perfection pass (2026-10-26): Safari and the locked chats are
   Episode 2's layer, so a code passed on by a friend, or a curious tap on
   Safari, can't skip ahead. */
describe("Episode 2's other doors", () => {
  it("keeps the locked chats shut in Episode 1, even to the right code", () => {
    expect(isCode(ep, start(), "pakki")).toBe(false);
    expect(isCode(ep, add(start(), "ep:2"), " Pakki ")).toBe(true);
  });

  it("keeps Safari on a tab that can't reload until Episode 2", () => {
    const waits = ep.safariWaits!;
    expect(all(start(), waits.until)).toBe(false);
    expect(all(add(start(), "ep:2"), waits.until)).toBe(true);
  });

  it("asks nothing in Episode 1 that only Safari or the locked chats can prove", () => {
    const later = new Set(
      ep.evidence.filter((e) => e.app === "safari" || ["nitin-car", "nitin-gate", "nitin-reply", "nitin-back", "dilip-107", "promise"].includes(e.id)).map((e) => e.id),
    );
    for (const q of ep.questions) {
      if (q.episode !== 1 || q.kind !== "file") continue;
      for (const c of q.claims.filter((c) => !c.refuse)) {
        const routes = [c.proof, ...(c.orProof ?? [])];
        expect(routes.some((r) => r.every((id) => !later.has(id))), `${q.id}:${c.id}`).toBe(true);
      }
    }
  });
});
