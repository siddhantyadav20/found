"use client";

import { useState } from "react";

import type { Flag, SettingsRow, Story } from "@/content/types";
import { all, has, type CaseState } from "@/lib/game/engine";
import app from "../ios/App.module.css";
import { Chevron } from "../ios/AppBar";
import Avatar from "../ios/Avatar";
import s from "../ios/Settings.module.css";
import local from "./Settings.module.css";

/* ===========================================================================
   Settings, as the pilot drew it: the owner's name at the top on a profile
   card, and every row led by iOS's own coloured tile. What's in it is the
   chapter's (`story.settings`), and nothing in it is pointed at: a passcode
   turned off, and when, is the kind of thing it holds. A row can open a page
   one level down, and can do one thing that can't be undone.

   =========================================================================== */

const BLUE = "#0a84ff";
const GREEN = "#30d158";
const GREY = "#8e8e93";
const RED = "#ff453a";
const PURPLE = "#5e5ce6";

function Tile({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span className={s.tile} style={{ background: bg }} aria-hidden="true">
      <svg viewBox="0 0 24 24">{children}</svg>
    </span>
  );
}

/* The pilot's glyphs (c03aa03), and four new ones for rows it never had. */
const FACE = (
  <>
    <path d="M8 4.5H6.5a2 2 0 0 0-2 2V8M16 4.5h1.5a2 2 0 0 1 2 2V8M8 19.5H6.5a2 2 0 0 1-2-2V16M16 19.5h1.5a2 2 0 0 0 2-2V16" />
    <path d="M9 9.5v1.2M15 9.5v1.2M12 9.5v3.2h-.9M9.5 15.4a4 4 0 0 0 5 0" />
  </>
);
const BATTERY = (
  <>
    <rect x="3.5" y="8" width="15" height="8" rx="2.2" />
    <rect x="5.7" y="10.2" width="7.4" height="3.6" rx="1" className={s.solid} />
    <path d="M20.5 10.6v2.8" />
  </>
);
const SUN = (
  <>
    <circle cx="12" cy="12" r="3.6" className={s.solid} />
    <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6" />
  </>
);
const GEAR = (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 4.5v2.2M12 17.3v2.2M4.5 12h2.2M17.3 12h2.2M6.8 6.8l1.6 1.6M15.6 15.6l1.6 1.6M17.2 6.8l-1.6 1.6M8.4 15.6l-1.6 1.6" />
  </>
);
/** A tick inside a shield: iOS's own mark for a management profile. */
const PROFILE = (
  <>
    <path d="M12 4 18.5 6.4v5.3c0 3.8-2.7 6.5-6.5 8.3-3.8-1.8-6.5-4.5-6.5-8.3V6.4Z" />
    <path d="m9.2 12 2 2 3.8-4" />
  </>
);
const HOURGLASS = <path d="M8 4.5h8M8 19.5h8M8.8 4.5c0 3.5 6.4 4.3 6.4 7.5s-6.4 4-6.4 7.5M15.2 4.5c0 3.5-6.4 4.3-6.4 7.5s6.4 4 6.4 7.5" />;
const AIRDROP = (
  <>
    <circle cx="12" cy="12" r="1.6" className={s.solid} />
    <path d="M8.6 15.4a4.8 4.8 0 1 1 6.8 0M6 18a8.5 8.5 0 1 1 12 0" />
  </>
);
const TEXT = (
  <>
    <path d="M4.5 17.5 8 7l3.5 10.5M5.6 14.2h4.8" />
    <path d="M13.5 17.5 16 11l2.5 6.5M14.3 15.4h3.4" />
  </>
);
const SOS = (
  <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" stroke="none">
    SOS
  </text>
);

/** Which tile leads which row. A row nobody drew a tile for goes without. */
const TILES: Record<string, { bg: string; glyph: React.ReactNode }> = {
  "Face ID & Passcode": { bg: GREEN, glyph: FACE },
  "Screen Time": { bg: PURPLE, glyph: HOURGLASS },
  "Emergency SOS": { bg: RED, glyph: SOS },
  "Software Update": { bg: GREY, glyph: GEAR },
  "VPN & Device Management": { bg: GREY, glyph: PROFILE },
  AirDrop: { bg: BLUE, glyph: AIRDROP },
  "Text Size": { bg: BLUE, glyph: TEXT },
  "Bold Text": { bg: BLUE, glyph: SUN },
  "Battery Percentage": { bg: GREEN, glyph: BATTERY },
  "Low Power Mode": { bg: GREEN, glyph: BATTERY },
};

/** A page one level down: a profile, what it is, and the one thing you can do about it. */
function Detail({
  row,
  state,
  onBack,
  onAct,
}: {
  row: SettingsRow & { detail: NonNullable<SettingsRow["detail"]> };
  state: CaseState;
  onBack: () => void;
  onAct?: (sets: readonly Flag[]) => void;
}) {
  const [asking, setAsking] = useState(false);
  const done = row.action?.sets.every((f) => has(state, f));
  const offered = Boolean(row.action && all(state, row.action.requires));
  return (
    <>
      <button type="button" className={local.backLink} onClick={onBack} data-back>
        <Chevron back /> Settings
      </button>
      <p className={app.groupLabel}>{row.detail.heading}</p>
      <ul className={app.group}>
        <li>
          <div className={app.row}>
            <Tile bg={GREY}>{PROFILE}</Tile>
            <span className={app.rowMain}>
              <span className={app.rowTitle}>{done ? "No profile installed" : row.detail.title}</span>
            </span>
          </div>
        </li>
        {!done &&
          row.detail.rows.map((r) => (
            <li key={r.label}>
              <div className={app.row}>
                <span className={app.rowMain}>
                  <span className={app.rowTitle}>{r.label}</span>
                </span>
                <span className={app.rowMeta}>{r.value}</span>
              </div>
            </li>
          ))}
      </ul>
      {!done && row.detail.footer && <p className={app.note}>{row.detail.footer}</p>}

      {row.action && offered && !done && (
        <ul className={app.group}>
          <li>
            {!asking ? (
              <button type="button" className={`${app.row} ${local.danger}`} onClick={() => setAsking(true)}>
                <span className={app.rowMain}>
                  <span className={app.rowTitle}>{row.action.label}</span>
                </span>
              </button>
            ) : (
              <div className={local.confirm}>
                <span>{row.action.confirm}</span>
                <span className={local.confirmRow}>
                  <button
                    type="button"
                    className={local.destructive}
                    onClick={() => {
                      onAct?.(row.action!.sets);
                      setAsking(false);
                    }}
                  >
                    {row.action.label}
                  </button>
                  <button type="button" className={local.cancel} onClick={() => setAsking(false)}>
                    Cancel
                  </button>
                </span>
              </div>
            )}
          </li>
        </ul>
      )}
    </>
  );
}

export default function Settings({
  story,
  state,
  onAct,
  onRead,
}: {
  story: Story;
  state: CaseState;
  onAct?: (sets: readonly Flag[]) => void;
  /** Opening a page one level down is how what's on it gets found. */
  onRead?: (ids: readonly string[]) => void;
}) {
  const [asking, setAsking] = useState<string | null>(null);
  const [page, setPage] = useState<string | null>(null);
  /* The first group is the account card; a chapter that hasn't written one
     yet still shows whose phone it is. */
  const [account, ...groups] = story.settings;
  const owner = account?.rows[0] ?? { title: story.owner.name, sub: "Apple Account, iCloud and more" };

  const opened = groups.flatMap((g) => g.rows).find((r) => r.title === page);
  if (opened?.detail)
    return <Detail row={{ ...opened, detail: opened.detail }} state={state} onBack={() => setPage(null)} onAct={onAct} />;

  return (
    <>
      {/* The owner's name on the profile card, the way the top of Settings looks. */}
      <ul className={app.group}>
        <li>
          <div className={s.profile}>
            <Avatar name={owner.title} size="head" />
            <span className={app.rowMain}>
              <span className={s.profileName}>{owner.title}</span>
              {/* What sits under the name goes on its own line, so the name keeps its line. */}
              <span className={s.profileSub}>
                {owner.sub}
                {owner.value && ` · ${owner.value}`}
              </span>
            </span>
          </div>
        </li>
      </ul>

      {groups.map((g, i) => {
        const rows = g.rows.filter((r) => all(state, r.requires));
        if (!rows.length) return null;
        return (
          <div key={i}>
            {g.label && <p className={app.groupLabel}>{g.label}</p>}
            <ul className={app.group}>
              {rows.map((r) => {
                const tile = TILES[r.title];
                const done = r.action?.sets.every((f) => has(state, f));
                const offered = Boolean(r.action && all(state, r.action.requires));
                const inner = (
                  <>
                    {tile && <Tile bg={tile.bg}>{tile.glyph}</Tile>}
                    <span className={app.rowMain}>
                      <span className={app.rowTitle}>{r.title}</span>
                      {r.sub && <span className={app.rowSub}>{r.sub}</span>}
                    </span>
                    <span className={app.rowMeta}>{done ? r.action?.done : r.value}</span>
                  </>
                );
                return (
                  <li key={r.title}>
                    {r.detail ? (
                      <button
                        type="button"
                        className={app.row}
                        onClick={() => {
                          setPage(r.title);
                          if (r.evidence) onRead?.([r.evidence]);
                        }}
                      >
                        {inner}
                        <Chevron />
                      </button>
                    ) : r.action && offered && !done ? (
                      <button type="button" className={app.row} onClick={() => setAsking(r.title)}>
                        {inner}
                        <Chevron />
                      </button>
                    ) : (
                      <div className={app.row}>{inner}</div>
                    )}

                    {/* The one row that does something, and cannot be undone. */}
                    {!r.detail && r.action && offered && asking === r.title && (
                      <div className={local.confirm}>
                        <span>{r.action.confirm}</span>
                        <span className={local.confirmRow}>
                          <button
                            type="button"
                            className={local.destructive}
                            onClick={() => {
                              onAct?.(r.action!.sets);
                              setAsking(null);
                            }}
                          >
                            {r.action.label}
                          </button>
                          <button type="button" className={local.cancel} onClick={() => setAsking(null)}>
                            Cancel
                          </button>
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            {g.footer && <p className={app.note}>{g.footer}</p>}
          </div>
        );
      })}
    </>
  );
}
