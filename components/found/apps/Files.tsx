"use client";

import { useEffect, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { FileItem, Sheet } from "@/content/found/types";
import { keyTap, refuse } from "@/lib/found/buzz";
import { all, dayNow, has, type CaseState } from "@/lib/found/engine";
import * as play from "../FoundPhone/actions";
import AppBar, { Chevron } from "./AppBar";
import PhotoFrame, { PhotoViewer } from "./PhotoFrame";
import type { AppProps } from "./types";
import app from "./App.module.css";
import styles from "./Files.module.css";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function order(at: string): number {
  const [day, time = "00:00"] = at.split(" ");
  const [h, m] = time.split(":").map(Number);
  return Math.max(0, WEEK.indexOf(day)) * 1440 + (h || 0) * 60 + (m || 0);
}

function dated(at: string, today: string): string {
  const [day, time = ""] = at.split(" ");
  const t = WEEK.indexOf(today.slice(0, 3));
  const d = WEEK.indexOf(day);
  return `${d === t ? "Today" : d === (t + 6) % 7 ? "Yesterday" : day} ${time}`;
}

/** The little document an icon shows, by what kind of file it is. */
function FileIcon({ file }: { file: FileItem }) {
  const ext = file.name.split(".").pop()?.toUpperCase() ?? "";
  return (
    <span className={styles.icon} data-kind={file.content.kind} aria-hidden="true">
      {ext}
    </span>
  );
}

/**
 * Files, as iOS lays it out: recent files, then the folders they're in. What
 * a file opens onto depends on what it is: a floor plan whose rooms can be
 * tapped, a PDF's pages, a spreadsheet with its sheet tabs (and, under the
 * tabs' menu, any sheet someone hid), an encrypted archive that asks for its
 * code, or a video.
 *
 * Opened from a chat (`arg` is a file id), it goes straight to that file.
 */
export default function Files({ state, arg }: AppProps) {
  const ep = useStory();
  const today = dayNow(state, ep.clocks);
  const files = (ep.files ?? []).filter((f) => all(state, f.requires)).sort((a, b) => order(b.at) - order(a.at));
  const [open, setOpen] = useState<string | null>(arg && files.some((f) => f.id === arg) ? arg : null);
  const [folder, setFolder] = useState<string | null>(null);
  const file = files.find((f) => f.id === open);
  const folders = [...new Set(files.map((f) => f.folder))].sort();

  useEffect(() => {
    play.see(file?.evidence);
  }, [file]);

  if (file) return <FileView key={file.id} file={file} state={state} onBack={() => setOpen(null)} backLabel={folder ?? "Files"} />;

  const row = (f: FileItem) => (
    <li key={f.id}>
      <button type="button" className={styles.file} onClick={() => setOpen(f.id)}>
        <FileIcon file={f} />
        <span className={app.rowMain}>
          <span className={app.rowTitle}>{f.name}</span>
          <span className={app.rowSub}>
            {dated(f.at, today)} · {f.size}
          </span>
        </span>
      </button>
    </li>
  );

  if (folder) {
    return (
      <section className={app.view}>
        <AppBar title={folder} onBack={() => setFolder(null)} backLabel="Files" />
        <div className={app.body}>
          <ul className={styles.list}>{files.filter((f) => f.folder === folder).map(row)}</ul>
        </div>
      </section>
    );
  }

  return (
    <section className={app.view}>
      <AppBar />
      <div className={app.body}>
        <h2 className={app.big}>Files</h2>
        <p className={app.groupLabel}>Recents</p>
        <ul className={styles.list}>{files.slice(0, 6).map(row)}</ul>
        <p className={app.groupLabel}>On My iPhone</p>
        <ul className={app.group}>
          {folders.map((name) => (
            <li key={name}>
              <button type="button" className={app.row} onClick={() => setFolder(name)}>
                <span className={styles.folder} aria-hidden="true" />
                <span className={app.rowMain}>
                  <span className={app.rowTitle}>{name}</span>
                </span>
                <span className={app.rowMeta}>{files.filter((f) => f.folder === name).length}</span>
                <Chevron />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FileView({ file, state, onBack, backLabel }: { file: FileItem; state: CaseState; onBack: () => void; backLabel: string }) {
  const c = file.content;
  if (c.kind === "video") return <PhotoViewer id={c.photo} cast={state.cast} onClose={onBack} />;
  return (
    <section className={app.view} data-file={c.kind}>
      <AppBar title={file.name} onBack={onBack} backLabel={backLabel} />
      {c.kind === "plan" && <PlanView floors={c.floors} />}
      {c.kind === "pdf" && <PdfView pages={c.pages} />}
      {c.kind === "sheet" && <SheetView sheets={c.sheets} />}
      {c.kind === "archive" && <ArchiveView lock={c.lock} photos={c.photos} state={state} name={file.name} />}
    </section>
  );
}

/* --- A floor plan ------------------------------------------------------------ */

function PlanView({ floors }: { floors: Extract<FileItem["content"], { kind: "plan" }>["floors"] }) {
  const [floor, setFloor] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const rooms = floors[floor]?.rooms ?? [];
  const room = rooms.find((r) => r.id === picked);

  return (
    <div className={app.body}>
      <div className={styles.segments} role="tablist">
        {floors.map((f, i) => (
          <button
            type="button"
            key={f.name}
            role="tab"
            aria-selected={i === floor}
            data-on={i === floor || undefined}
            onClick={() => {
              setFloor(i);
              setPicked(null);
            }}
          >
            {f.name}
          </button>
        ))}
      </div>
      <div className={styles.paper}>
        <svg viewBox="0 0 100 64" className={styles.plan} role="img" aria-label={`${floors[floor]?.name} plan`}>
          <rect x="1" y="1" width="98" height="62" className={styles.outline} />
          {rooms.map((r) => (
            <g
              key={r.id}
              className={styles.room}
              data-on={picked === r.id || undefined}
              data-code={/^[A-Z]-\d/.test(r.label) || undefined}
              onClick={() => {
                setPicked(r.id);
                play.see(r.evidence);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                setPicked(r.id);
                play.see(r.evidence);
              }}
              role="button"
              tabIndex={0}
              aria-label={r.label}
            >
              <rect x={r.x} y={r.y} width={r.w} height={r.h} />
              <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 1}>
                {r.label}
              </text>
            </g>
          ))}
        </svg>
        <p className={styles.planCaption}>MALHOTRA RESIDENCE · {floors[floor]?.name.toUpperCase()} · NOT TO SCALE</p>
      </div>
      <p className={app.note}>{room ? `${room.label}.` : "Tap a room."}</p>
    </div>
  );
}

/* --- A PDF --------------------------------------------------------------------- */

function PdfView({ pages }: { pages: Extract<FileItem["content"], { kind: "pdf" }>["pages"] }) {
  useEffect(() => {
    play.seeAll(pages.flatMap((p) => p.lines.map((l) => l.evidence)));
  }, [pages]);
  return (
    <div className={app.body}>
      {pages.map((p, i) => (
        <article key={i} className={styles.page}>
          {p.title && <h3 className={styles.pageTitle}>{p.title}</h3>}
          {p.lines.map((l) => (
            <p key={l.text} className={styles.pageLine} data-strong={l.strong || undefined}>
              {l.text}
            </p>
          ))}
          <span className={styles.pageNo}>
            {i + 1} / {pages.length}
          </span>
        </article>
      ))}
    </div>
  );
}

/* --- A spreadsheet ---------------------------------------------------------------- */

const COLUMN = (i: number) => String.fromCharCode(65 + i);

function SheetView({ sheets }: { sheets: readonly Sheet[] }) {
  const [unhidden, setUnhidden] = useState<ReadonlySet<string>>(() => new Set());
  const [current, setCurrent] = useState(sheets.find((s) => !s.hidden)?.name ?? sheets[0]?.name);
  const [menu, setMenu] = useState(false);
  const visible = sheets.filter((s) => !s.hidden || unhidden.has(s.name));
  const hidden = sheets.filter((s) => s.hidden && !unhidden.has(s.name));
  const sheet = visible.find((s) => s.name === current) ?? visible[0];

  useEffect(() => {
    play.see(sheet?.evidence);
  }, [sheet]);

  return (
    <div className={styles.sheetWrap}>
      <div className={styles.grid} data-no-swipe>
        <table className={styles.table}>
          <thead>
            <tr>
              <th />
              {sheet?.columns.map((_, i) => (
                <th key={i}>{COLUMN(i)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              {sheet?.columns.map((col) => (
                <td key={col} data-head>
                  {col}
                </td>
              ))}
            </tr>
            {sheet?.rows.map((row, r) => (
              <tr key={r}>
                <th>{r + 2}</th>
                {row.map((cell, i) => (
                  <td key={i} data-loud={/^[A-Z ]{6,}$|CR$/.test(cell) || undefined}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.tabs}>
        {visible.map((s) => (
          <button type="button" key={s.name} data-on={s.name === sheet?.name || undefined} onClick={() => setCurrent(s.name)}>
            {s.name}
          </button>
        ))}
        <button type="button" className={styles.more} onClick={() => setMenu((m) => !m)} aria-label="Sheet options" aria-expanded={menu}>
          ⋯
        </button>
        {menu && (
          <div className={styles.menu} role="menu">
            {hidden.length > 0 ? (
              hidden.map((s) => (
                <button
                  type="button"
                  key={s.name}
                  role="menuitem"
                  onClick={() => {
                    setUnhidden((u) => new Set(u).add(s.name));
                    setCurrent(s.name);
                    setMenu(false);
                  }}
                >
                  Unhide sheet “{s.name}”
                </button>
              ))
            ) : (
              <span className={styles.menuEmpty}>No hidden sheets</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* --- An encrypted archive ------------------------------------------------------------ */

const LENGTH = 4;

function ArchiveView({ lock, photos, state, name }: { lock: string; photos: readonly string[]; state: CaseState; name: string }) {
  const ep = useStory();
  const open = has(state, `lock:${lock}`);
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const details = ep.locks.find((l) => l.id === lock);

  const press = (d: string) => {
    if (code.length >= LENGTH) return;
    keyTap();
    const next = code + d;
    setCode(next);
    if (next.length < LENGTH) return;
    if (play.unlock(lock, next)) return;
    refuse();
    window.setTimeout(() => {
      setCode("");
      setShake((n) => n + 1);
    }, 200);
  };

  if (!open) {
    return (
      <div className={app.body}>
        <div className={styles.locked}>
          <span className={styles.zip} aria-hidden="true">
            ZIP
          </span>
          <p className={styles.lockedTitle}>“{name}” is encrypted</p>
          <p className={styles.lockedSub}>Enter the password to unzip it.</p>
          <div key={shake} className={styles.dots} data-shake={shake > 0 || undefined}>
            {Array.from({ length: LENGTH }, (_, i) => (
              <span key={i} data-on={i < code.length || undefined} />
            ))}
          </div>
          {hint && <p className={styles.hint}>{hint}</p>}
          <div className={styles.pad}>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k) =>
              k === "" ? (
                <span key="gap" />
              ) : (
                <button
                  type="button"
                  key={k}
                  onClick={() => (k === "⌫" ? setCode((c) => c.slice(0, -1)) : press(k))}
                  aria-label={k === "⌫" ? "Delete" : k}
                >
                  {k}
                </button>
              ),
            )}
          </div>
          {details && (
            <button type="button" className={styles.forgot} onClick={() => setHint(play.hint(lock))}>
              {hint ? "Still stuck?" : "Forgot password?"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={app.body}>
      <p className={app.note}>{photos.length} items, unzipped.</p>
      <div className={styles.thumbs}>
        {photos.map((id) => (
          <button type="button" key={id} className={styles.thumb} onClick={() => setViewing(id)}>
            <PhotoFrame id={id} cast={state.cast} size="thumb" />
          </button>
        ))}
      </div>
      {viewing && <PhotoViewer id={viewing} cast={state.cast} onClose={() => setViewing(null)} />}
    </div>
  );
}
