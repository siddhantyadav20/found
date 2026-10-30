import styles from "./Title.module.css";

/**
 * A title cut into letters for the flicker: each letter holds a copy of itself
 * one line down, and rolling `[data-char]` by whole heights looks like a slot
 * machine settling. The words are read out once, from the label.
 */
export default function Title({ text, className }: { text: string; className?: string }) {
  return (
    <h2 className={`${styles.title} ${className ?? ""}`} aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span key={w} className={styles.word} aria-hidden="true">
          {[...word].map((letter, i) => (
            <span key={i} className={styles.char} data-char>
              <span>{letter}</span>
              <span className={styles.clone}>{letter}</span>
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}

export type Flicker = { readonly el: HTMLElement; readonly turns: number; readonly delay: number };

/** Eight to fourteen turns each, started .04s apart in a random order. */
export function prepareFlicker(chars: readonly HTMLElement[]): Flicker[] {
  const order = chars.map((_, i) => i).sort(() => Math.random() - 0.5);
  return chars.map((el, i) => ({
    el,
    turns: 8 + Math.floor(Math.random() * 7),
    delay: order[i] * 0.04,
  }));
}

const DURATION = 2;

/** One frame of the flicker. Returns false once every letter has landed. */
export function drawFlicker(flicker: readonly Flicker[], seconds: number) {
  let alive = false;
  for (const { el, turns, delay } of flicker) {
    const p = Math.min(Math.max((seconds - delay) / DURATION, 0), 1);
    if (p < 1) alive = true;
    const eased = p === 1 ? 1 : 1 - 2 ** (-10 * p);
    el.style.transform = p === 1 ? "" : `translate3d(0, ${-((eased * turns) % 1) * 100}%, 0)`;
  }
  return alive;
}

export function stopFlicker(flicker: readonly Flicker[]) {
  for (const { el } of flicker) el.style.transform = "";
}
