import styles from "./Landing.module.css";

/* ===========================================================================
   Three numbered figures, in the way a manual draws its parts: isometric
   line drawings of the chapter's three moves. The parcel that arrives; the
   phone, opened out into its layers; the record, and the three ways it can
   go. Projected here, so every line is exact and nothing is an image.
   =========================================================================== */

type P = readonly [number, number, number];

/** Isometric projection: x to the right and down, y to the left and down, z straight up. */
const iso = ([x, y, z]: P): [number, number] => [120 + (x - y) * 0.866, 150 + (x + y) * 0.5 - z];

const path = (pts: readonly P[], close = true) =>
  pts.map((p, i) => `${i ? "L" : "M"}${iso(p)[0].toFixed(1)} ${iso(p)[1].toFixed(1)}`).join(" ") + (close ? " Z" : "");

/** A box's three visible faces: top, left, right. */
function Box({ x, y, z, w, d, h, label }: { x: number; y: number; z: number; w: number; d: number; h: number; label?: boolean }) {
  const top: P[] = [
    [x, y, z + h],
    [x + w, y, z + h],
    [x + w, y + d, z + h],
    [x, y + d, z + h],
  ];
  const left: P[] = [
    [x, y + d, z],
    [x + w, y + d, z],
    [x + w, y + d, z + h],
    [x, y + d, z + h],
  ];
  const right: P[] = [
    [x + w, y, z],
    [x + w, y + d, z],
    [x + w, y + d, z + h],
    [x + w, y, z + h],
  ];
  return (
    <g>
      <path d={path(left)} className={styles.figFace} />
      <path d={path(right)} className={styles.figFace} data-shade />
      <path d={path(top)} className={styles.figFace} data-top />
      {label && (
        <>
          <path
            d={path([
              [x + w * 0.22, y + d * 0.3, z + h],
              [x + w * 0.7, y + d * 0.3, z + h],
              [x + w * 0.7, y + d * 0.68, z + h],
              [x + w * 0.22, y + d * 0.68, z + h],
            ])}
            className={styles.figLine}
          />
          {[0.4, 0.5, 0.58].map((t) => (
            <path key={t} d={path([[x + w * 0.28, y + d * t, z + h], [x + w * 0.6, y + d * t, z + h]], false)} className={styles.figThin} />
          ))}
          {/* The tape, across the end. */}
          <path d={path([[x + w * 0.9, y, z + h], [x + w * 0.9, y + d, z + h], [x + w * 0.9, y + d, z]], false)} className={styles.figThin} />
        </>
      )}
    </g>
  );
}

/** A thin slab with rounded intent: one layer of the phone. */
function Layer({ z, kind }: { z: number; kind: "glass" | "apps" | "chat" | "case" }) {
  const w = 70;
  const d = 130;
  const x = -10;
  const y = -40;
  const plate: P[] = [
    [x, y, z],
    [x + w, y, z],
    [x + w, y + d, z],
    [x, y + d, z],
  ];
  return (
    <g>
      <path d={path(plate)} className={styles.figFace} data-top />
      {kind === "apps" &&
        Array.from({ length: 12 }, (_, i) => {
          const cx = x + 12 + (i % 3) * 22;
          const cy = y + 18 + Math.floor(i / 3) * 24;
          return (
            <path
              key={i}
              d={path([
                [cx, cy, z],
                [cx + 12, cy, z],
                [cx + 12, cy + 12, z],
                [cx, cy + 12, z],
              ])}
              className={styles.figThin}
            />
          );
        })}
      {kind === "chat" &&
        [0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={path([
              [x + (i % 2 ? 26 : 10), y + 20 + i * 26, z],
              [x + (i % 2 ? 60 : 46), y + 20 + i * 26, z],
              [x + (i % 2 ? 60 : 46), y + 34 + i * 26, z],
              [x + (i % 2 ? 26 : 10), y + 34 + i * 26, z],
            ])}
            className={styles.figThin}
          />
        ))}
      {kind === "case" &&
        [0, 1, 2, 3, 4].map((i) => <path key={i} d={path([[x + 12, y + 24 + i * 18, z], [x + 58 - (i % 2) * 14, y + 24 + i * 18, z]], false)} className={styles.figThin} />)}
      {kind === "glass" && <path d={path([[x + 18, y + 8, z], [x + 52, y + 8, z]], false)} className={styles.figLine} />}
    </g>
  );
}

export default function Figures() {
  return (
    <section className={styles.figures} aria-label="How a chapter goes">
      <figure className={styles.fig}>
        <span className={styles.figNo}>Fig 0.1</span>
        <svg viewBox="0 0 240 240" className={styles.figArt} aria-hidden="true">
          <Box x={-30} y={-20} z={0} w={110} d={70} h={16} label />
          <Box x={-12} y={-56} z={16} w={44} d={26} h={4} />
        </svg>
        <figcaption>
          <b>It arrives</b>
          <span>A parcel comes back to your door. Inside: a stranger&apos;s phone, and a note meant for somebody else.</span>
        </figcaption>
      </figure>
      <figure className={styles.fig}>
        <span className={styles.figNo}>Fig 0.2</span>
        <svg viewBox="0 0 240 240" className={styles.figArt} aria-hidden="true">
          <g transform="translate(0 -6)">
            <Layer z={0} kind="case" />
            <Layer z={22} kind="chat" />
            <Layer z={44} kind="apps" />
            <Layer z={66} kind="glass" />
          </g>
        </svg>
        <figcaption>
          <b>You get in</b>
          <span>No passcode. Every layer of his life is there, and some of it is locked, deleted, or hidden on purpose.</span>
        </figcaption>
      </figure>
      <figure className={styles.fig}>
        <span className={styles.figNo}>Fig 0.3</span>
        <svg viewBox="0 0 240 240" className={styles.figArt} aria-hidden="true">
          <Box x={-60} y={-10} z={0} w={40} d={40} h={10} />
          <Box x={-10} y={-10} z={0} w={40} d={40} h={34} />
          <Box x={40} y={-10} z={0} w={40} d={40} h={58} />
          <path d={path([[-40, 10, 10], [10, 10, 34]], false)} className={styles.figDash} />
          <path d={path([[10, 10, 34], [60, 10, 58]], false)} className={styles.figDash} />
        </svg>
        <figcaption>
          <b>You decide</b>
          <span>Send what you proved to the lawyer, post it for everyone, or give the parcel back. Each ending is the one you earned.</span>
        </figcaption>
      </figure>
    </section>
  );
}
