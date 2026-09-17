"use client";

import { useState } from "react";

import type { Photo, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import styles from "./Photos.module.css";

/* ===========================================================================
   Photos, and the reason a retired bank manager's Photos matters: at 11:40 PM
   on Friday she photographed every page of her diary, the way she used to
   photograph a cheque before depositing it.

   Recently Deleted is where page six went at 12:37 AM, while she was on a
   terrace and this phone was in Andheri East. Restoring it is how the player
   learns there was a list, and that they are on it.

   The pages are drawn, not photographed: her handwriting arrives with the
   shoot (ROADMAP P11), and the words matter now.
   =========================================================================== */

function Page({ photo }: { photo: Photo }) {
  if (photo.kind === "paper")
    return (
      <div className={styles.paper}>
        <p className={styles.paperTitle}>{photo.title}</p>
        {photo.lines?.map((l, i) => (
          <p key={i} className={styles.hand}>
            {l}
          </p>
        ))}
      </div>
    );
  return (
    <div className={styles.scene}>
      <span className={styles.sceneTitle}>{photo.title}</span>
    </div>
  );
}

export default function Photos({
  story,
  state,
  onRead,
  onRestore,
}: {
  story: Story;
  state: CaseState;
  onRead: (ids: readonly string[]) => void;
  onRestore: (id: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [inBin, setInBin] = useState(false);

  const visible = story.photos.filter((p) => all(state, p.requires));
  const deleted = visible.filter((p) => p.deletedAt && !state.flags.includes(`did:restored-${p.id}`));
  const library = visible.filter((p) => !deleted.includes(p));
  const shown = inBin ? deleted : library;
  const photo = shown.find((p) => p.id === open);

  if (photo)
    return (
      <div className={styles.viewer}>
        <div className={styles.viewerBar}>
          <button type="button" className={styles.link} onClick={() => setOpen(null)}>
            ‹ {inBin ? "Recently Deleted" : "Library"}
          </button>
          <span className={styles.stamp}>
            {photo.day} {photo.at}
          </span>
        </div>
        <Page photo={photo} />
        {photo.caption && <p className={styles.caption}>{photo.caption}</p>}
        {photo.deletedAt && (
          <div className={styles.binBar}>
            <span>Deleted at {photo.deletedAt}</span>
            <button
              type="button"
              className={styles.recover}
              onClick={() => {
                onRestore(photo.id);
                if (photo.evidence) onRead([photo.evidence]);
                setOpen(null);
                setInBin(false);
              }}
            >
              Recover
            </button>
          </div>
        )}
      </div>
    );

  return (
    <>
      <div className={styles.tabs}>
        <button type="button" data-on={!inBin || undefined} onClick={() => setInBin(false)}>
          Library
        </button>
        <button type="button" data-on={inBin || undefined} onClick={() => setInBin(true)}>
          Recently Deleted{deleted.length ? ` (${deleted.length})` : ""}
        </button>
      </div>

      <div className={styles.grid}>
        {shown.map((p) => (
          <button
            key={p.id}
            type="button"
            className={styles.cell}
            onClick={() => {
              setOpen(p.id);
              if (p.evidence && !p.deletedAt) onRead([p.evidence]);
            }}
          >
            <Page photo={p} />
            <span className={styles.cellStamp}>{p.at}</span>
          </button>
        ))}
        {shown.length === 0 && <p className={styles.empty}>Nothing here.</p>}
      </div>
    </>
  );
}
