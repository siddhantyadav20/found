import { story as blueRoom } from "./blue-room/story";
import type { CaseId } from "./cases";
import { story as lowBattery } from "./found/story";
import type { Story } from "./found/types";

/**
 * Each case's script, by id. Heavy on purpose: only the phone and the server
 * routes that check what a player did import this. Anything that just needs a
 * case's name or route reads `content/cases.ts` instead.
 */
export const STORIES: Record<CaseId, Story> = {
  "low-battery": lowBattery,
  "blue-room": blueRoom,
};
