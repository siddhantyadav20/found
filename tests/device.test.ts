import { describe, expect, it } from "vitest";

import { STORIES } from "@/content/stories";
import { POWER, isFoundEvent } from "@/lib/found/events";
import { detectOS, isHandheld } from "@/lib/found/platform";

/**
 * The phone matches the player's own: Android for Android, iOS for an iPhone,
 * and iOS for everything else. And Episode 2's charger is measured.
 */

const UA = {
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1",
  android: "Mozilla/5.0 (Linux; Android 16; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
  ipad: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Safari/605.1.15",
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  windows: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
};

describe("the player's device", () => {
  it("gives Android players Android, and everyone else iOS", () => {
    expect(detectOS(UA.android)).toBe("android");
    for (const ua of [UA.iphone, UA.ipad, UA.mac, UA.windows]) expect(detectOS(ua)).toBe("ios");
  });

  it("knows a phone or tablet from a laptop, including an iPad that says it's a Mac", () => {
    expect(isHandheld(UA.iphone)).toBe(true);
    expect(isHandheld(UA.android)).toBe(true);
    expect(isHandheld(UA.ipad, 5)).toBe(true);
    expect(isHandheld(UA.mac, 0)).toBe(false);
    expect(isHandheld(UA.windows)).toBe(false);
  });

  it("counts how Episode 2's phone came back", () => {
    for (const e of POWER) expect(isFoundEvent(STORIES.shagun, e), e).toBe(true);
  });
});
