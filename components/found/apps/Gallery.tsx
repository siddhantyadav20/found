"use client";

import { useEffect, useRef, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { Photo } from "@/content/found/types";
import { all } from "@/lib/found/engine";
import AppBar, { Chevron } from "./AppBar";
import PhotoFrame, { PhotoViewer } from "./PhotoFrame";
import type { AppProps } from "./types";
import app from "./App.module.css";
import styles from "./Photos.module.css";

type Album = "library" | "camera" | "telegram" | "videos";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** "Fri 22:47" as a number that sorts. */
function order(at: string): number {
  const [day, time = "00:00"] = at.split(" ");
  const [h, m] = time.split(":").map(Number);
  return Math.max(0, WEEK.indexOf(day)) * 1440 + (h || 0) * 60 + (m || 0);
}

const ALBUMS: { id: Exclude<Album, "library">; title: string; test: (p: Photo) => boolean }[] = [
  { id: "camera", title: "CamLink", test: (p) => p.album === "camera" },
  { id: "telegram", title: "Telegram", test: (p) => p.album === "telegram" },
  { id: "videos", title: "Videos", test: (p) => !!p.video },
];

/** Everything that lives in Photos, rather than inside a chat or a file. */
const inPhotos = (p: Photo) => p.album === "recents" || p.album === "camera" || p.album === "telegram";

/**
 * Photos, for a phone whose photos came from three places: its own camera,
 * the photographer's camera over CamLink (the walkthrough clips too), and
 * Telegram, which saved the client's pictures before the client deleted the
 * chat. Library is all of it in the order it was taken; Collections has an
 * album for each source, and Videos.
 *
 * Frames the camera had sent but the phone hadn't finished importing wait in
 * CamLink as a count, and arrive with their episode.
 */
export default function Gallery({ state }: AppProps) {
  const ep = useStory();
  const [tab, setTab] = useState<"library" | "collections">("library");
  const [album, setAlbum] = useState<Album>("library");
  const [viewing, setViewing] = useState<string | null>(null);
  const body = useRef<HTMLDivElement>(null);

  const everything = ep.photos.filter(inPhotos).sort((a, b) => order(a.takenAt) - order(b.takenAt));
  const available = everything.filter((p) => all(state, p.requires));
  const waiting = everything.filter((p) => p.album === "camera" && !all(state, p.requires)).length;
  const inAlbum = (a: Album) => (a === "library" ? available : available.filter(ALBUMS.find((x) => x.id === a)!.test));
  const list = inAlbum(album);
  const title = album === "library" ? "Library" : ALBUMS.find((x) => x.id === album)!.title;

  // Opens at the newest, at the bottom, like the real one.
  useEffect(() => {
    const el = body.current;
    if (el && (tab === "library" || album !== "library")) el.scrollTop = el.scrollHeight;
  }, [tab, album, list.length]);

  const grid = (
    <div className={styles.grid}>
      {list.map((p) => (
        <button type="button" key={p.id} className={styles.thumb} onClick={() => setViewing(p.id)} aria-label={`${p.video ? "Video, " : ""}${p.place}, ${p.takenAt}`}>
          <PhotoFrame id={p.id} cast={state.cast} size="thumb" />
          {p.video && <span className={styles.days}>0:{String(p.video.seconds).padStart(2, "0")}</span>}
        </button>
      ))}
    </div>
  );

  const inside = album !== "library";

  return (
    <section className={app.view}>
      {inside ? <AppBar title={title} onBack={() => setAlbum("library")} backLabel="Collections" /> : <AppBar />}

      <div className={app.body} ref={body} data-tabbed={!inside || undefined}>
        {inside ? (
          <>
            {album === "camera" && waiting > 0 && (
              <p className={styles.kept}>
                EOS R50 · {waiting} more {waiting === 1 ? "photo" : "photos"} waiting to import
              </p>
            )}
            {grid}
          </>
        ) : tab === "library" ? (
          <>
            <h2 className={app.big}>Library</h2>
            <p className={styles.sub}>
              {available.length} Items{waiting > 0 ? ` · ${waiting} importing` : ""}
            </p>
            {grid}
          </>
        ) : (
          <>
            <h2 className={app.big}>Collections</h2>
            <p className={app.groupLabel}>Albums</p>
            <ul className={app.group}>
              {ALBUMS.map((a) => {
                const photos = inAlbum(a.id);
                return (
                  <li key={a.id}>
                    <button type="button" className={app.row} onClick={() => setAlbum(a.id)}>
                      <span className={styles.albumThumb}>{photos.at(-1) && <PhotoFrame id={photos.at(-1)!.id} cast={state.cast} size="thumb" />}</span>
                      <span className={app.rowMain}>
                        <span className={app.rowTitle}>{a.title}</span>
                      </span>
                      <span className={app.rowMeta}>{photos.length}</span>
                      <Chevron />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {!inside && (
        <nav className={styles.tabs} aria-label="Photos">
          <span className={styles.tabGroup}>
            <button type="button" className={styles.tab} data-on={tab === "library" || undefined} onClick={() => setTab("library")}>
              Library
            </button>
            <button type="button" className={styles.tab} data-on={tab === "collections" || undefined} onClick={() => setTab("collections")}>
              Collections
            </button>
          </span>
        </nav>
      )}

      {viewing && <PhotoViewer id={viewing} cast={state.cast} onClose={() => setViewing(null)} />}
    </section>
  );
}
