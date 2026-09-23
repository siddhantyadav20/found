import styles from "./Avatar.module.css";

/** Initials the way iOS takes them: the first letter, or first and last for two words. */
function initials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "";
  const letters = words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0][0];
  return letters.toUpperCase();
}

function Person() {
  return (
    <svg viewBox="0 0 24 24" className={styles.person} aria-hidden="true">
      <circle cx="12" cy="9.2" r="4.3" />
      <path d="M4.2 21c1.2-4.1 4.4-6.1 7.8-6.1s6.6 2 7.8 6.1Z" />
    </svg>
  );
}

/**
 * A contact's picture, as iOS draws one it has no photo for: their initials
 * on the grey gradient; a silhouette for a number nobody has named; two
 * overlapping faces for a group.
 */
export default function Avatar({
  name,
  unknown = false,
  group = false,
  size = "row",
}: {
  name: string;
  unknown?: boolean;
  group?: boolean;
  size?: "row" | "head" | "card";
}) {
  if (group) {
    return (
      <span className={styles.cluster} data-size={size} aria-hidden="true">
        <span className={styles.mono}>
          <Person />
        </span>
        <span className={styles.mono}>
          <Person />
        </span>
      </span>
    );
  }
  return (
    <span className={styles.mono} data-size={size} aria-hidden="true">
      {unknown ? <Person /> : initials(name)}
    </span>
  );
}
