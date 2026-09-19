"use client";

import type { Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { Group, Row } from "../AppView";
import styles from "./PikDrop.module.css";
import { stamp } from "@/lib/found/time";

/* ===========================================================================
   PikDrop: how the phone got here, and the fourteen minutes nobody booked.

   She paid ₹184 at 11:52 PM to send a mobile, a power bank, a diary and a
   letter from Dadar to a door she had never been to. Three of those four
   arrived. The route map says where the fourth one went.
   =========================================================================== */

export default function PikDrop({
  story,
  state,
  onRead,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
}) {
  const c = story.courier;
  const stops = c.route.filter((r) => all(state, r.requires));

  const detour = stops.some((r) => r.wrong);

  return (
    <>
      {/* The courier's own look: its orange, the order, and the map. The map
          shows the detour only once the story has let the player see it. */}
      <div className={styles.brand}>
        <span className={styles.brandName}>Order PD-40412</span>
        <span className={styles.brandSub}>Delivered · {stamp(c.route[c.route.length - 1]?.at)}</span>
      </div>
      <svg className={styles.map} viewBox="0 0 320 150" role="img" aria-label={detour ? "The route, with a stop in Andheri East" : "The route, Dadar to your door"}>
        <rect width="320" height="150" fill="#1b1d22" />
        <path d="M0 0 H48 C40 40 34 80 44 110 C50 130 40 145 34 150 H0 Z" fill="#1d3848" />
        <g stroke="#2a2d33" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M40 120 H310" />
          <path d="M120 150 V0" />
          <path d="M60 30 L300 140" />
        </g>
        {detour ? (
          <path d="M70 120 L120 96 L200 40 L250 60 L276 92" className={styles.path} />
        ) : (
          <path d="M70 120 L150 110 L276 92" className={styles.path} />
        )}
        <circle cx="70" cy="120" r="6" fill="#ff8a1f" />
        {detour && <circle cx="200" cy="40" r="7" fill="#ff453a" />}
        <circle cx="276" cy="92" r="6" fill="#fff" />
      </svg>

      <Group label="Delivery">
        <Row title="Booked" meta={`${c.day} ${stamp(c.bookedAt)}`} />
        <Row title="Item" sub={c.item} />
        <Row title="From" sub={c.from} />
        <Row title="To" sub={c.to} />
        <Row title="Rider" sub={c.rider} meta={c.fare} />
      </Group>

      <p className={styles.mapLabel}>Route</p>
      <ol className={styles.route}>
        {stops.map((r) => (
          <li
            key={r.at}
            className={styles.stop}
            data-wrong={r.wrong || undefined}
            onClick={() => r.evidence && onRead([r.evidence])}
          >
            <span className={styles.at}>{stamp(r.at)}</span>
            <span className={styles.place}>
              {r.place}
              {r.note && <span className={styles.note}>{r.note}</span>}
            </span>
          </li>
        ))}
      </ol>

      <p className={styles.mapLabel}>Chat with the rider</p>
      <div className={styles.chat}>
        {c.chat.map((m, i) => (
          <p
            key={i}
            className={styles.msg}
            data-out={m.from === "her" || undefined}
            onClick={() => m.evidence && onRead([m.evidence])}
          >
            <span>{m.text}</span>
            {m.english && <span className={styles.english}>{m.english}</span>}
            <span className={styles.at}>{stamp(m.at)}</span>
          </p>
        ))}
      </div>
    </>
  );
}
