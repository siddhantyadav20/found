import { describe, expect, it } from "vitest";

import { cameraStop, filmRun, perforation } from "@/components/cinema/camera";

describe("the camera's sounds", () => {
  it.each([
    ["film run", filmRun],
    ["camera stop", cameraStop],
    ["perforation", perforation],
  ])("%s renders clean", (_, render) => {
    for (const rate of [44100, 48000]) {
      const [left, right] = render(rate);
      expect(left.length).toBe(right.length);
      for (const channel of [left, right]) {
        let peak = 0;
        for (const v of channel) peak = Math.max(peak, Math.abs(v));
        expect(peak).toBeGreaterThan(0.5);
        expect(peak).toBeLessThanOrEqual(1);
        expect(Math.abs(channel[channel.length - 1])).toBeLessThan(0.001);
      }
    }
  });
});
