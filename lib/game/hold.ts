import type { Story } from "@/content/types";
import { all, has, type CaseState } from "./engine";

/** The night's decider is coming: the record waits until it's played (`Story.hold`). */
export const holding = (story: Story, s: CaseState): boolean =>
  Boolean(story.hold && all(s, story.hold.after) && !story.hold.until.some((f) => has(s, f)));
