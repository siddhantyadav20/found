import type { CaseId } from "./cases";
import { story as dontCutTheCall } from "./dont-cut-the-call/story";
import type { Story } from "./types";

/**
 * Each case's script, by id. Heavy on purpose: only the phone and the server
 * routes that check what a player did import this. Anything that just needs a
 * case's name or route reads `content/cases.ts` instead.
 */
export const STORIES: Record<CaseId, Story> = {
  "dont-cut-the-call": dontCutTheCall,
};
