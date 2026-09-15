/**
 * The name written on a passed-on envelope, as the block capitals on the
 * label would take it.
 *
 * Letters in any script, with their combining marks (a Devanagari name is
 * mostly marks), and single spaces. Nothing else survives: no digits, no
 * punctuation, no links. The label is small and handwritten, so it holds
 * sixteen characters.
 *
 * Shared by the end card, which previews the label, and the server action,
 * which is what actually decides.
 */
export const NAME_MAX = 16;

export function cleanDropName(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const kept = raw
    .normalize("NFC")
    .replace(/[^\p{L}\p{M} ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  return Array.from(kept).slice(0, NAME_MAX).join("").trim().toLocaleUpperCase("en-IN");
}

/** "ANANYA RAO" as a sentence would write it: "Ananya Rao". Scripts without case pass through. */
export function displayName(to: string): string {
  return to.toLocaleLowerCase("en-IN").replace(/(^|\s)(\p{L})/gu, (_, gap: string, c: string) => gap + c.toLocaleUpperCase("en-IN"));
}

/** The envelope's label for a drop: the name if there is one, the story's own otherwise. */
export function dropLabel(to: string, fallback: readonly string[]): readonly string[] {
  return to ? [`TO ${to}`, "BY HAND"] : fallback;
}
