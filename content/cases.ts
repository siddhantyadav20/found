import { meta, teaser } from "./shagun";

/* ===========================================================================
   Every case Found has, in the light form: names, routes, share lines, and
   what each one's lock screen keeps receiving.

   No scripts here. The desk, the sitemap and the share cards read this file
   and none of them should carry a story; `content/stories.ts` maps the same
   ids to the scripts, for the phone and the server routes that play them.
   =========================================================================== */

export type CaseMeta = {
  readonly id: string;
  readonly href: string;
  readonly title: string;
  readonly cta: string;
  readonly hint: string;
  readonly description: string;
  /** The found phone's lock screen, and the time the desk shows on it. */
  readonly wallpaper: string;
  readonly time: string;
  /** The desk's luggage tag: how many episodes, and what kind of story. */
  readonly episodes: number;
  readonly tone: string;
  /** The content note on the parcel's label: the age, and what's in it. */
  readonly note: string;
  /** The question that goes with a share, under the result line. */
  readonly ask: string;
  /** What keeps landing on this case's lock screen. The desk cycles it. */
  readonly teaser: readonly { readonly from: string; readonly text: string }[];
};

export const CASES = {
  shagun: { ...meta, teaser },
} as const satisfies Record<string, CaseMeta>;

export type CaseId = keyof typeof CASES;

export const CASE_IDS = Object.keys(CASES) as CaseId[];

/** The case the desk puts in front of you. */
export const FEATURED: CaseId = "shagun";

export const isCaseId = (x: unknown): x is CaseId => typeof x === "string" && Object.hasOwn(CASES, x);
