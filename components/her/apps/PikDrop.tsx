"use client";

import type { Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { Group, Row } from "../AppView";
import styles from "./PikDrop.module.css";

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

  return (
    <>
      <Group label="Delivery">
        <Row title="Booked" meta={`${c.day} ${c.bookedAt}`} />
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
            <span className={styles.at}>{r.at}</span>
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
            <span className={styles.at}>{m.at}</span>
          </p>
        ))}
      </div>
    </>
  );
}
