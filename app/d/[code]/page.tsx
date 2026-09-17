import type { Metadata } from "next";

import Stage from "@/components/stage/Stage";
import SaveScript from "@/components/found/SaveScript";
import { CaseProvider } from "@/components/found/StoryContext";
import { CASES, FEATURED } from "@/content/cases";
import { displayName } from "@/lib/found/dropName";
import { readDrop } from "@/lib/found/dropStore";
import { estimatedMinutes } from "@/lib/found/store";

export async function generateMetadata({ params }: PageProps<"/d/[code]">): Promise<Metadata> {
  const { code } = await params;
  const drop = await readDrop(code);
  const meta = CASES[drop?.case ?? FEATURED];
  const title = drop?.to ? `${displayName(drop.to)}, this came for you` : "This came for you";
  return {
    title: { absolute: title },
    description: meta.hint,
    // A drop is one person's envelope, not a page for search.
    robots: { index: false, follow: false },
    openGraph: { title, description: meta.hint, type: "website" },
    twitter: { card: "summary_large_image", title, description: meta.hint },
  };
}

/**
 * A passed-on phone. Straight to the envelope, with the friend's name on the
 * label: no desk, no choices, nothing between the link and the hook.
 *
 * A code that has expired, or never existed, still opens the case, on a plain
 * envelope. A link someone was sent should never be a dead end.
 */
export default async function DropPage({ params }: PageProps<"/d/[code]">) {
  const { code } = await params;
  const drop = await readDrop(code);
  const id = drop?.case ?? FEATURED;
  return (
    <CaseProvider id={id} via={drop ? code : undefined} to={drop?.to} minutes={await estimatedMinutes(id)}>
      <SaveScript caseId={id} />
      <Stage />
    </CaseProvider>
  );
}
