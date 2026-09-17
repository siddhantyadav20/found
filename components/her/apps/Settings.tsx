"use client";

import type { Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { Group, Row } from "../AppView";

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

export default function Settings({ story, state }: { story: Story; state: CaseState }) {
  return (
    <>
      {story.settings.map((g, i) => {
        const rows = g.rows.filter((r) => all(state, r.requires));
        if (!rows.length) return null;
        return (
          <Group key={i} label={g.label}>
            {rows.map((r) => (
              <Row key={r.title} title={r.title} sub={r.sub} meta={r.value} />
            ))}
          </Group>
        );
      })}
    </>
  );
}
