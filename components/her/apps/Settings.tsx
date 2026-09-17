"use client";

import { useState } from "react";

import type { Story } from "@/content/types";
import { all, has, type CaseState } from "@/lib/game/engine";
import { Group, Row } from "../AppView";
import styles from "./Settings.module.css";

/* ===========================================================================
   Settings, in iOS's own grouped lists.

   Three rows in here are the chapter, and none of them is pointed at:

     Face ID & Passcode — Off, turned off Thursday 8:10 PM
     VPN & Device Management — RBI Secure KYC, installed Thursday 8:14 PM
     Her Apple Account — signed in on a device she has never owned

   Four minutes after she turned the lock off, they installed the profile.
   That is why the blue pill has been around her clock ever since, and why
   everything the player does on this phone is watched (CHAPTER1.md, twist 5).
   =========================================================================== */

export default function Settings({
  story,
  state,
  onAct,
}: {
  story: Story;
  state: CaseState;
  onAct?: (sets: readonly import("@/content/types").Flag[]) => void;
}) {
  const [asking, setAsking] = useState<string | null>(null);

  return (
    <>
      {story.settings.map((g, i) => {
        const rows = g.rows.filter((r) => all(state, r.requires));
        if (!rows.length) return null;
        return (
          <Group key={i} label={g.label}>
            {rows.map((r) => {
              const done = r.action?.sets.every((f) => has(state, f));
              return (
                <Row
                  key={r.title}
                  title={r.title}
                  sub={
                    r.action && asking === r.title ? (
                      <span className={styles.confirm}>
                        <span>{r.action.confirm}</span>
                        <span className={styles.confirmRow}>
                          <button
                            type="button"
                            className={styles.destructive}
                            onClick={() => {
                              onAct?.(r.action!.sets);
                              setAsking(null);
                            }}
                          >
                            {r.action.label}
                          </button>
                          <button type="button" className={styles.cancel} onClick={() => setAsking(null)}>
                            Cancel
                          </button>
                        </span>
                      </span>
                    ) : (
                      r.sub
                    )
                  }
                  meta={done ? r.action?.done : r.value}
                  onClick={r.action && !done ? () => setAsking(r.title) : undefined}
                />
              );
            })}
          </Group>
        );
      })}
    </>
  );
}
