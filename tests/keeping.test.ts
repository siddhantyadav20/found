import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import { newCase, type CaseState } from "@/lib/game/engine";
import { KEEPING, eventsFor } from "@/lib/found/events";
import {
  AWAY_MS,
  NUMBER_ALPHABET,
  ago,
  arrivals,
  betterSolved,
  describeCase,
  deskState,
  wasAway,
  isSolved,
  normalizeCaseNumber,
  numberFromBytes,
  pickSave,
  restorePath,
  summarise,
  type Solved,
} from "@/lib/found/keeping";
import { chromeIntent, inAppBrowser } from "@/lib/found/platform";
import { createShelf, putShelf, readShelf } from "@/lib/found/shelfStore";

/**
 * Never losing a case: numbers that survive being read aloud, saves that
 * merge towards whoever got further, finishes that outlive "Start over", and
 * the in-app browsers that forget everything.
 */

const fresh = () => newCase("t", 0);
const add = (s: CaseState, ...flags: string[]): CaseState => ({ ...s, flags: [...s.flags, ...flags] as unknown as CaseState["flags"] });
const A = `[${NUMBER_ALPHABET}]`;
const SHAPE = new RegExp(`^${A}{4}-${A}{4}-${A}{4}$`);

describe("case numbers", () => {
  it("are twelve characters in three groups, with nothing that reads two ways", () => {
    const n = numberFromBytes(Array.from({ length: 24 }, (_, i) => i * 10));
    expect(n).toMatch(SHAPE);
    expect(NUMBER_ALPHABET).not.toMatch(/[01ILO]/);
  });

  it("skip bytes that would make some characters likelier, and give up without enough", () => {
    expect(numberFromBytes([248, 255, ...Array(12).fill(0)])).toBe("2222-2222-2222");
    expect(numberFromBytes(Array(12).fill(250))).toBeNull();
  });

  it("read back however they were typed", () => {
    expect(normalizeCaseNumber("k7q4 mx2p-r9ta")).toBe("K7Q4-MX2P-R9TA");
    expect(normalizeCaseNumber("K7Q4MX2PR9TA")).toBe("K7Q4-MX2P-R9TA");
    expect(normalizeCaseNumber("K7Q4-MX2P-R9TO")).toBeNull();
    expect(normalizeCaseNumber("K7Q4-MX2P-R91A")).toBeNull();
    expect(normalizeCaseNumber("K7Q4-MX2P")).toBeNull();
    expect(normalizeCaseNumber(42)).toBeNull();
    expect(restorePath("K7Q4-MX2P-R9TA")).toBe("/r/K7Q4-MX2P-R9TA");
  });
});

describe("two devices, one case", () => {
  const s = fresh();
  const further = add(s, "lock:passcode");

  it("keeps whichever save got further, and the incoming one on a tie", () => {
    expect(pickSave(s, further)).toBe(further);
    expect(pickSave(further, s)).toBe(further);
    const twin = { ...s };
    expect(pickSave(s, twin)).toBe(twin);
    expect(pickSave(null, s)).toBe(s);
    expect(pickSave(s, null)).toBe(s);
  });

  it("keeps the first finish of the furthest episode", () => {
    const one: Solved = { episode: 1, minutes: 31, held: 2, at: 1 };
    const again: Solved = { ...one, minutes: 20, at: 2 };
    const two: Solved = { episode: 2, minutes: 40, held: 2, at: 3 };
    expect(betterSolved(one, again)).toBe(one);
    expect(betterSolved(one, two)).toBe(two);
    expect(betterSolved(two, one)).toBe(two);
    expect(betterSolved(null, one)).toBe(one);
    expect(isSolved(one)).toBe(true);
    expect(isSolved({ ...one, episode: 3 })).toBe(true);
    expect(isSolved({ ...one, episode: 4 })).toBe(false);
    expect(isSolved({ ...one, held: -1 })).toBe(false);
    expect(isSolved(null)).toBe(false);
  });
});

describe("your cases, in a line", () => {
  const hours = (h: number) => h * 3_600_000;

  it("follows a case from the envelope to the end", () => {
    const s = fresh();
    expect(summarise(s)).toMatchObject({ episode: 1, phase: "playing" });
    expect(describeCase(s, null, hours(3))).toEqual({ status: "Episode 1 · the call is still running · 3 h ago", result: null, cta: "Carry on" });
    expect(describeCase(add(s, "did:bank-dead"), null, 0).cta).toBe("Charge it");
    expect(summarise(add(s, "did:bank-dead", "did:charged", "ep:2")).episode).toBe(2);
    // Episode 2's end card leads straight into Episode 3.
    expect(summarise(add(s, "did:bank-dead", "did:charged", "ep:2", "ep:3"))).toMatchObject({ episode: 3, phase: "playing" });
    expect(summarise(add(s, "did:bank-dead", "did:charged", "ep:2", "ep:3", "did:chose")).phase).toBe("done");
    expect(describeCase(add(s, "did:bank-dead", "did:charged", "ep:2", "ep:3", "did:chose"), null, 0).status).toBe("Case closed");
  });

  it("keeps a finish on the desk after the save is gone", () => {
    const line = describeCase(null, { episode: 1, minutes: 31, held: 2, at: 0 }, 0);
    expect(line.status).toBe("Back in its envelope");
    expect(line.result).toBe("Solved Episode 1 in 31 min · they had 2 on you");
  });

  it("says how long ago in words a person would use", () => {
    expect(ago(0, 20_000)).toBe("just now");
    expect(ago(0, 12 * 60_000)).toBe("12 min ago");
    expect(ago(0, hours(30))).toBe("yesterday");
    expect(ago(0, hours(24 * 5))).toBe("5 days ago");
  });
});

describe("the desk remembers", () => {
  const s = fresh();
  const one: Solved = { episode: 1, minutes: 31, held: 2, at: 0 };

  it("draws the phone as it was left", () => {
    expect(deskState(null, null)).toEqual({ kind: "new" });
    expect(deskState(s, null)).toMatchObject({ kind: "playing", episode: 1 });
    expect(deskState(add(s, "did:bank-dead"), one)).toEqual({ kind: "between" });
    expect(deskState(add(s, "did:bank-dead", "did:charged", "ep:2"), one)).toMatchObject({ kind: "playing", episode: 2 });
    expect(deskState(add(s, "did:bank-dead", "did:charged", "ep:2", "ep:3"), one)).toMatchObject({ kind: "playing", episode: 3 });
    expect(deskState(add(s, "did:bank-dead", "did:charged", "ep:2", "ep:3", "did:chose"), one)).toEqual({ kind: "solved", solved: one, again: false });
    expect(deskState(null, one)).toEqual({ kind: "solved", solved: one, again: true });
  });

  it("says something arrived only to someone who has been before", () => {
    expect(arrivals(null, ["dont-cut-the-call", "case-two"])).toEqual([]);
    expect(arrivals(["dont-cut-the-call"], ["dont-cut-the-call", "case-two"])).toEqual(["case-two"]);
    expect(arrivals(["dont-cut-the-call", "case-two"], ["dont-cut-the-call", "case-two"])).toEqual([]);
  });

  it("welcomes a player back after half an hour away", () => {
    expect(wasAway(s, AWAY_MS - 1)).toBe(false);
    expect(wasAway(s, AWAY_MS)).toBe(true);
    const later = { ...s, at: { "lock:passcode": AWAY_MS } };
    expect(wasAway(later, AWAY_MS + 60_000)).toBe(false);
  });
});

describe("the shelf", () => {
  it("keeps a save under a number, and never under a number nobody made", async () => {
    const n = await createShelf();
    expect(n).toMatch(SHAPE);
    const s = add(fresh(), "did:unlock");
    expect(await putShelf(n, "dont-cut-the-call", { save: s, solved: { episode: 1, minutes: 31, held: 2, at: 1 } })).toBe(true);

    const shelf = await readShelf(n);
    expect(shelf?.saves["dont-cut-the-call"]?.flags).toEqual(s.flags);
    expect(shelf?.solved["dont-cut-the-call"]?.minutes).toBe(31);

    // Start over: the save goes, the finish stays.
    await putShelf(n, "dont-cut-the-call", { save: null });
    const after = await readShelf(n);
    expect(after?.saves["dont-cut-the-call"]).toBeUndefined();
    expect(after?.solved["dont-cut-the-call"]?.held).toBe(2);

    expect(await putShelf("2222-2222-2222", "dont-cut-the-call", { save: s })).toBe(false);
    expect(await readShelf("2222-2222-2222")).toBeNull();
  });
});

describe("in-app browsers", () => {
  const INSTAGRAM_IOS =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 334.0.4.32.98 (iPhone15,2; iOS 17_5; en_IN; en-IN; scale=3.00; 1179x2556; 606404286)";
  const FACEBOOK_ANDROID =
    "Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.6422.165 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/468.0.0.55.105;]";
  const CHROME_ANDROID =
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";

  it("are told apart from a real browser", () => {
    expect(inAppBrowser(INSTAGRAM_IOS)).toBe("instagram");
    expect(inAppBrowser(FACEBOOK_ANDROID)).toBe("facebook");
    expect(inAppBrowser(CHROME_ANDROID)).toBeNull();
  });

  it("hand the page to Chrome on Android, with the page itself as the fallback", () => {
    expect(chromeIntent("https://found.example/d/abc?x=1")).toBe(
      "intent://found.example/d/abc?x=1#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https%3A%2F%2Ffound.example%2Fd%2Fabc%3Fx%3D1;end",
    );
  });

  it("and everything here is counted, by name, and nothing else", () => {
    for (const e of KEEPING) expect(eventsFor(STORIES["dont-cut-the-call"])).toContain(e);
  });
});
