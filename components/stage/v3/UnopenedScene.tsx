"use client";

import { useEffect, useState } from "react";

import type { Story } from "@/content/types";
import { buzz } from "@/lib/found/buzz";
import { Unopened } from "./EndCardV3";
import own from "./Lockscreen.module.css";
import styles from "./Screens.module.css";

/* ===========================================================================
   Unopened (RAAKH-V3 §11): put away before 3:58. The phone face down on the
   envelope, notifications glowing at the table's edge; a card; and an end
   card with nothing on it but its name and "Open it again", which puts it
   back exactly as it was. No tally, no Look again.
   =========================================================================== */

export default function UnopenedScene({ story, onOpen }: { story: Story; onOpen: () => void }) {
  const end = story.endings.find((e) => e.id === "unopened");
  const [step, setStep] = useState<"table" | "card" | "end">("table");
  useEffect(() => {
    if (step === "end") return undefined;
    if (step === "table") buzz();
    const t = window.setTimeout(() => setStep(step === "table" ? "card" : "end"), step === "table" ? 4600 : 3000);
    return () => window.clearTimeout(t);
  }, [step]);

  if (step === "end") return <Unopened story={story} onOpen={onOpen} />;
  if (step === "card")
    return (
      <div className={styles.card} role="status">
        <p className={styles.cardLine}>{story.unopened?.card}</p>
      </div>
    );
  const glow = (end?.lines ?? []).filter((l) => l.kind === "glow");
  return (
    <div className={styles.table} role="img" aria-label="The phone, face down on the envelope, still lighting up">
      <div className={own.envelope} aria-hidden="true" />
      <div className={own.glow}>
        {glow.map((g) => (
          <p key={g.text}>
            <b>{g.who}</b> {g.text}
          </p>
        ))}
      </div>
    </div>
  );
}
