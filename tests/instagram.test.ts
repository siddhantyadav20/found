import { describe, expect, it } from "vitest";

import { conversation } from "@/lib/game/chat";
import { add, all, dueEvents, newCase, type CaseState } from "@/lib/game/engine";
import { AIRPLANE } from "@/lib/game/phone";
import { actFlags } from "@/lib/game/record";
import { ep } from "./support/play";

/**
 * Raakh without your phone (2026-10-23). Instagram does its public job: faces
 * with names, other people's posts, and the night spreading once the player
 * knows what it is. Meera writes in the chat he pinned for her. The record is
 * sent, posted or given back from the case file.
 */

const start = (): CaseState => add(newCase("ig", 0), "did:opened", "did:unlock", "saw:note", "did:past-lock");
const feed = ep.feed ?? [];
const shown = (s: CaseState) => feed.filter((p) => all(s, p.requires));
const night = /Dilip|Kunal|Sehgal|Chhattarpur|firing|goli|waiter/i;

describe("no phone of yours", () => {
  it("has none, and nothing arrives on one but the knock at your gate", () => {
    expect(ep.yours).toBeUndefined();
    expect(ep.threads.filter((t) => t.app === "yours:chats")).toEqual([]);
    expect(ep.events.filter((e) => e.device === "yours").map((e) => e.id)).toEqual(["guard-rings"]);
  });

  it("closes the case from the case file: sent, posted, or given back from the first minute", () => {
    expect(ep.close?.sendTo).toBe("Meera Arora");
    expect(actFlags(ep, start(), "return")).toContain("did:returned");
  });
});

describe("Instagram, the night in public", () => {
  it("is an ordinary Saturday feed from everywhere until the player has found the night on his phone", () => {
    const s = start();
    expect(shown(s).length).toBeGreaterThan(5);
    for (const p of shown(s)) expect(`${p.text} ${p.english ?? ""} ${p.media ?? ""}`, p.id).not.toMatch(night);
    const heard = add(s, "saw:poster", "did:heard-him");
    expect(shown(heard).map((p) => p.id)).toEqual(expect.arrayContaining(["f-rumour", "f-poster", "f-video"]));
  });

  it("tells the wrong story first, and by the third episode it is the loudest thing about the night", () => {
    const rumour = feed.find((p) => p.id === "f-rumour")!;
    expect(rumour.text).toMatch(/Kunal/);
    const about = feed.filter((p) => p.requires?.length);
    expect(rumour.shares[2]).toBe(Math.max(...about.map((p) => p.shares[2])));
  });

  it("only ever climbs, and shows nothing before the episode that posts it", () => {
    for (const p of feed) {
      expect(p.shares[1], p.id).toBeGreaterThanOrEqual(p.shares[0]);
      expect(p.shares[2], p.id).toBeGreaterThanOrEqual(p.shares[1]);
      if (p.requires?.includes("ep:2")) expect(p.shares[0], p.id).toBe(0);
    }
  });

  it("puts faces to the people in it, and keeps Meera's account private", () => {
    const handles = ep.profiles.map((p) => p.handle);
    expect(handles).toEqual(expect.arrayContaining(["sk.weddings", "kunal.sehgal", "nitin.edits", "meera.arora"]));
    for (const p of ep.profiles) expect(p.avatar, p.handle).toBeTruthy();
    expect(ep.profiles.find((p) => p.handle === "meera.arora")?.private).toBe(true);
  });

  it("shows Nitin wasn't at the wedding, and Dilip held the light in his place", () => {
    const fever = ep.profiles.find((p) => p.handle === "nitin.edits")!.posts[0];
    expect(fever.caption).toMatch(/102/);
    expect(fever.caption).toMatch(/Dilip, light/);
  });

  it("holds what Photos doesn't: the polished posts and Kunal's revolver are Instagram's alone", () => {
    const posted = new Set(ep.profiles.flatMap((p) => p.posts.map((x) => x.src)).filter(Boolean));
    for (const src of ["/found/raakh/w-couple.jpg", "/found/raakh/w-family.jpg", "/found/raakh/w-kunal.jpg"]) {
      expect(posted.has(src), src).toBe(true);
      expect(ep.photos.some((p) => p.src === src), src).toBe(false);
    }
  });

  it("lets the night's news lapse rather than arrive an episode late, and stops in airplane mode", () => {
    const late = add(start(), "did:heard-him", "ask:q5", "ep:2", "fired:title-2", "ep:3", "fired:title-3");
    const due = dueEvents(ep, late).map((e) => e.id);
    expect(due).not.toContain("ig-trend");
    expect(due).not.toContain("ig-rumour");
    expect(dueEvents(ep, add(start(), "did:heard-him", AIRPLANE)).map((e) => e.id)).not.toContain("ig-trend");
  });
});

describe("Meera, once she's rung", () => {
  const m = () => {
    const all = ep.threads.filter((t) => t.id === "m");
    return { ...all[0], messages: all.flatMap((t) => t.messages) };
  };

  it("writes in the chat he pinned for her, and tells the player his password is his birthday", () => {
    const s = add(start(), "ep:2", "did:meera-called", "did:knows-meera", "fired:meera-reads");
    const said = conversation(s, m(), "30/11").map((x) => x.text).join(" ");
    expect(said).toMatch(/Unblock kar diya/);
    expect(said).toMatch(/birthday/);
  });

  it("tells them to go to airplane mode once Bhasin can see the phone, and then can't write again", () => {
    const s = add(start(), "ep:2", "ep:3", "did:knows-meera", "fired:bhasin-rings");
    expect(dueEvents(ep, s).map((e) => e.id)).toContain("meera-airplane");
    expect(dueEvents(ep, add(s, AIRPLANE)).map((e) => e.id)).not.toContain("meera-airplane");
  });
});
