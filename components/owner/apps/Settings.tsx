"use client";

import { useState } from "react";

import type { AppId, Flag, SettingsRow, Story } from "@/content/types";
import { all, has, type CaseState } from "@/lib/game/engine";
import { AIRPLANE } from "@/lib/game/phone";
import { Page, SearchField } from "../AppView";
import Switch from "../ios/Switch";
import app from "../ios/App.module.css";
import { Chevron } from "../ios/AppBar";
import Avatar from "../ios/Avatar";
import { AppGlyph } from "../ios/icons";
import s from "../ios/Settings.module.css";
import local from "./Settings.module.css";

/* ===========================================================================
   Settings, as the pilot drew it: the owner's name at the top on a profile
   card, and every row led by iOS's own coloured tile. What's in it is the
   chapter's (`story.settings`), and nothing in it is pointed at: a passcode
   turned off, and when, is the kind of thing it holds. A row can open a page
   one level down, and can do one thing that can't be undone.

   =========================================================================== */

/* Settings' tiles keep iOS's light-mode colours in dark mode, as iOS does. */
const BLUE = "#007aff";
const GREEN = "#34c759";
const GREY = "#8e8e93";
const RED = "#ff3b30";
const PURPLE = "#5856d6";

function Tile({ bg, app: icon, children }: { bg?: string; app?: AppId; children?: React.ReactNode }) {
  // A row about an app wears that app's own icon.
  if (icon)
    return (
      <span className={s.appTile} aria-hidden="true">
        <AppGlyph app={icon} />
      </span>
    );
  return (
    <span className={`${s.tile} sq`} style={{ background: bg }} aria-hidden="true">
      <svg viewBox="0 0 24 24">{children}</svg>
    </span>
  );
}

/* The pilot's glyphs (c03aa03), and the ones for rows it never had. */
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

const PLANE = <path className={s.solid} d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" />;
const WIFI = (
  <path
    className={s.solid}
    d="M12 19.2 9.2 16.4a4 4 0 0 1 5.6 0Zm-5.7-5.7a8 8 0 0 1 11.4 0l-1.8 1.8a5.5 5.5 0 0 0-7.8 0Zm-3-3a12.3 12.3 0 0 1 17.4 0l-1.8 1.8a9.8 9.8 0 0 0-13.8 0Z"
  />
);
const BLUETOOTH = <path d="m7 7.5 10 8.5-5 4.5V3.5l5 4.5-10 8.5" />;
const ANTENNA = (
  <>
    <circle cx="12" cy="9" r="1.6" className={s.solid} />
    <path d="M12 10.5V20M8.2 5.3a5.4 5.4 0 0 0 0 7.4M15.8 5.3a5.4 5.4 0 0 1 0 7.4" />
  </>
);

const APPS = (
  <>
    <rect x="5" y="5" width="5.5" height="5.5" rx="1.4" />
    <rect x="13.5" y="5" width="5.5" height="5.5" rx="1.4" />
    <rect x="5" y="13.5" width="5.5" height="5.5" rx="1.4" />
    <rect x="13.5" y="13.5" width="5.5" height="5.5" rx="1.4" />
  </>
);

/** Which tile leads which row. A row nobody drew a tile for goes without. */
const TILES: Record<string, { bg?: string; glyph?: React.ReactNode; app?: AppId }> = {
  "Face ID & Passcode": { bg: GREEN, glyph: FACE },
  Photos: { app: "photos" },
  Apps: { bg: PURPLE, glyph: APPS },
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

/** A switch that only goes one way: on, it sets its flags; this phone never turns it back off. */
function OneWay({ sets, label, state, onAct }: { sets: readonly Flag[]; label: string; state: CaseState; onAct?: (sets: readonly Flag[]) => void }) {
  const on = all(state, sets);
  return <Switch on={on} disabled={on} label={label} onChange={() => onAct?.(sets)} />;
}

/** A page one level down: what it's about, its rows and switches, and the one thing you can do, if any. */
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
    <Page title={row.title} onBack={onBack} backLabel="Settings">
      <p className={app.groupLabel}>{row.detail.heading}</p>
      <ul className={app.group}>
        {row.detail.title && (
          <li>
            <div className={app.row}>
              {TILES[row.title] && (
                <Tile bg={TILES[row.title].bg} app={TILES[row.title].app}>
                  {TILES[row.title].glyph}
                </Tile>
              )}
              <span className={app.rowMain}>
                <span className={app.rowTitle}>{done ? row.action?.done : row.detail.title}</span>
              </span>
            </div>
          </li>
        )}
        {!done &&
          row.detail.rows.map((r) => (
            <li key={r.label}>
              <div className={app.row}>
                <span className={app.rowMain}>
                  <span className={app.rowTitle}>{r.label}</span>
                </span>
                {r.toggle ? (
                  <OneWay sets={r.toggle.sets} label={r.label} state={state} onAct={onAct} />
                ) : (
                  <span className={app.rowMeta}>{r.value}</span>
                )}
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
    </Page>
  );
}

export default function Settings({
  story,
  state,
  onAct,
  onRead,
  onHome,
}: {
  story: Story;
  state: CaseState;
  onAct?: (sets: readonly Flag[]) => void;
  /** Opening a page one level down is how what's on it gets found. */
  onRead?: (ids: readonly string[]) => void;
  onHome?: () => void;
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

  const airplane = has(state, AIRPLANE);
  /* What every iPhone's Settings opens with, under the account: its radios. Airplane
     Mode is the real switch, one way, as in Control Centre; the rest only say how things are. */
  const radios = [
    { title: "Airplane Mode", bg: "#ff9500", glyph: PLANE },
    { title: "Wi-Fi", bg: BLUE, glyph: WIFI, value: airplane ? "Off" : "Not Connected" },
    { title: "Bluetooth", bg: BLUE, glyph: BLUETOOTH, value: "On" },
    { title: "Mobile Service", bg: GREEN, glyph: ANTENNA, value: airplane ? "Airplane Mode" : "" },
  ];

  return (
    <Page title="Settings" large root onBack={onHome} backLabel="Home">
      <SearchField />
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

      <ul className={app.group}>
        {radios.map((r) => (
          <li key={r.title}>
            <div className={app.row}>
              <Tile bg={r.bg}>{r.glyph}</Tile>
              <span className={app.rowMain}>
                <span className={app.rowTitle}>{r.title}</span>
              </span>
              {r.title === "Airplane Mode" ? (
                <OneWay sets={[AIRPLANE]} label="Airplane Mode" state={state} onAct={onAct} />
              ) : (
                <>
                  {r.value && <span className={app.rowMeta}>{r.value}</span>}
                  <Chevron />
                </>
              )}
            </div>
          </li>
        ))}
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
                    {tile && (
                      <Tile bg={tile.bg} app={tile.app}>
                        {tile.glyph}
                      </Tile>
                    )}
                    <span className={app.rowMain}>
                      <span className={app.rowTitle}>{r.title}</span>
                      {r.sub && <span className={app.rowSub}>{r.sub}</span>}
                    </span>
                    {r.toggle ? (
                      <OneWay sets={r.toggle.sets} label={r.title} state={state} onAct={onAct} />
                    ) : (
                      <span className={app.rowMeta}>{done ? r.action?.done : r.value}</span>
                    )}
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
    </Page>
  );
}
