import type { CaseId } from "./cases";
import { story as lastlocal } from "./lastlocal/story";
import { story as raakh } from "./raakh/story";
import type { Story } from "./types";

/**
 * Each case's script, by id. Heavy on purpose: only the phone and the server
 * routes that check what a player did import this. Anything that just needs a
 * case's name or route reads `content/cases.ts` instead.
 */
export const STORIES: Record<CaseId, Story> = {
  lastlocal,
  raakh,
};
