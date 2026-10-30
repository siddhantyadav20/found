import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ChapterHero from "@/components/cinema/ChapterHero";
import { CASES, isCaseId } from "@/content/cases";
import { REELS } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return REELS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/chapters/[id]">): Promise<Metadata> {
  const { id } = await params;
  if (!isCaseId(id)) return {};
  const meta = CASES[id];
  return {
    title: { absolute: `${meta.title} · Chapter ${meta.chapter} · Found` },
    description: meta.description,
    alternates: { canonical: meta.page },
  };
}

/** A chapter's own page. Only its top exists so far; the game itself is at /c/<id>. */
export default async function Chapter({ params }: PageProps<"/chapters/[id]">) {
  const { id } = await params;
  const item = REELS.find((r) => r.id === id);
  if (!item) notFound();
  return <ChapterHero item={item} />;
}
