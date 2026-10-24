import type { FindMy, Story } from "@/content/types";
import { all, has, type CaseState } from "./engine";

/* ===========================================================================
   Where the train is, and where everyone following it is (Last Local).

   The route's stations each carry the flag that says the train has reached
   them; the first carries none. Find My's people move by steps the same way:
   the last step whose flag holds is where they are.
   =========================================================================== */

export type Where = { readonly index: number; readonly here: string; readonly next?: { readonly name: string; readonly at: string } };

export function stationOf(story: Story, s: CaseState): Where | undefined {
  const route = story.route;
  if (!route) return undefined;
  let index = 0;
  route.stations.forEach((st, i) => {
    if (!st.flag || has(s, st.flag)) index = i;
  });
  const next = route.stations[index + 1];
  return { index, here: route.stations[index].name, next: next && { name: next.name, at: next.at } };
}

export type Person = FindMy["people"][number];

/** Where a person is now: the last step whose flag holds. */
export function placeOf(p: Person, s: CaseState): { readonly at: string; readonly note?: string } {
  let step = p.steps[0];
  for (const st of p.steps) if (!st.after || has(s, st.after)) step = st;
  return step;
}

/** Who Find My shows now, and which of them are following this phone. */
export function peopleOf(story: Story, s: CaseState): readonly (Person & { readonly following: boolean })[] {
  return (story.findMy?.people ?? []).filter((p) => all(s, p.requires)).map((p) => ({ ...p, following: Boolean(p.follows && all(s, p.follows)) }));
}

/** What the home screen's slip says now. */
export const statusOf = (story: Story, s: CaseState): string | undefined =>
  (story.status ?? []).filter((l) => all(s, l.requires) && !(l.unless ?? []).some((f) => has(s, f))).at(-1)?.text;
