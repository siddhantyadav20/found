"use client";

import { useEffect, useState } from "react";

import styles from "./SeenByThem.module.css";

/* ===========================================================================
   "Good morning, #9."

   The last beat of Episode 2. The player has just worked out that this phone
   was in somebody else's hands between 12:36 and 12:39, and has opened the
   profile that was installed four minutes after her passcode came off.

   It types itself out at reading speed, and then the screen goes dark on its
   own. There is no button, because there is nothing to answer.
   =========================================================================== */

const LINE = "Good morning, #9.";

export default function SeenByThem({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (shown >= LINE.length) {
      const t = window.setTimeout(() => setDark(true), 2600);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setShown((n) => n + 1), 110);
    return () => window.clearTimeout(t);
  }, [shown]);

  useEffect(() => {
    if (!dark) return undefined;
    const t = window.setTimeout(onDone, 2000);
    return () => window.clearTimeout(t);
  }, [dark, onDone]);

  return (
    <div className={styles.screen} data-dark={dark || undefined}>
      <p className={styles.app}>RBI Secure KYC</p>
      <p className={styles.line}>
        {LINE.slice(0, shown)}
        <span className={styles.caret} aria-hidden="true" />
      </p>
    </div>
  );
}
