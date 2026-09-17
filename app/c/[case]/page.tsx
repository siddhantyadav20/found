import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Stage from "@/components/stage/Stage";
import SaveScript from "@/components/found/SaveScript";
import { CaseProvider } from "@/components/found/StoryContext";
import { CASES, CASE_IDS, isCaseId } from "@/content/cases";
import { estimatedMinutes } from "@/lib/found/store";

/** Every case is known at build time; anything else is a 404. */
export const dynamicParams = false;
/** The envelope's "About N minutes" follows the real median, hourly. */
export const revalidate = 3600;

export function generateStaticParams() {
  return CASE_IDS.map((id) => ({ case: id }));
}

export async function generateMetadata({ params }: PageProps<"/c/[case]">): Promise<Metadata> {
  const { case: id } = await params;
  if (!isCaseId(id)) return {};
  const meta = CASES[id];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.href },
    openGraph: { title: `${meta.title} — Found`, description: meta.description, url: meta.href, type: "website" },
    twitter: { card: "summary_large_image", title: `${meta.title} — Found`, description: meta.description },
  };
}

/**
 * A case, from its cold open. Everything after the envelope is client-side;
 * the server draws the room and the envelope, so a link opened from a chat
 * shows the hook before any JavaScript has arrived.
 */
export default async function CasePage({ params }: PageProps<"/c/[case]">) {
  const { case: id } = await params;
  if (!isCaseId(id)) notFound();
  return (
    <CaseProvider id={id} minutes={await estimatedMinutes(id)}>
      <SaveScript caseId={id} />
      <Stage />
    </CaseProvider>
  );
}
