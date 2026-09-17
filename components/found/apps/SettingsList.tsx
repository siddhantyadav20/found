"use client";

import { useEffect } from "react";

import { useStory } from "@/components/found/StoryContext";
import { all, battery } from "@/lib/found/engine";
import { setLargerText, useLargerText } from "@/lib/found/prefs";
import * as play from "../FoundPhone/actions";
import AppBar from "./AppBar";
import Avatar from "./Avatar";
import Switch from "./Switch";
import type { AppProps } from "./types";
import app from "./App.module.css";
import s from "./Settings.module.css";

/**
 * Settings, for a story that writes its phone's settings as data: what the
 * phone knows about itself, as rows in inset groups. Nothing here is a
 * switch the story needs; the facts are the point (a passcode turned off, a
 * SIM taken out, and when). Larger Text is the player's own and works.
 *
 * Opening Settings is looking at all of it.
 */
export default function SettingsList({ state }: AppProps) {
  const ep = useStory();
  const largerText = useLargerText();
  const sections = (ep.settings ?? [])
    .map((sec) => ({ ...sec, rows: sec.rows.filter((r) => all(state, r.requires)) }))
    .filter((sec) => sec.rows.length > 0);
  const owner = `${state.cast.name} ${ep.surname}`;

  useEffect(() => {
    play.seeAll(sections.flatMap((sec) => sec.rows.map((r) => r.evidence)));
  }, [sections]);

  return (
    <section className={app.view}>
      <AppBar />
      <div className={app.body}>
        <h2 className={app.big}>Settings</h2>
        <ul className={app.group}>
          <li className={s.profile}>
            <Avatar name={owner} size="head" />
            <span className={app.rowMain}>
              <span className={s.profileName}>{owner}</span>
              <span className={s.profileSub}>Apple Account, iCloud and more</span>
            </span>
          </li>
        </ul>
        {sections.map((sec, i) => (
          <div key={sec.title ?? i}>
            {sec.title && <p className={app.groupLabel}>{sec.title}</p>}
            <ul className={app.group}>
              {sec.rows.map((r) => (
                <li key={r.title} className={app.row}>
                  <span className={app.rowMain}>
                    <span className={app.rowTitle}>{r.title}</span>
                    {r.sub && <span className={app.rowSub}>{r.sub}</span>}
                  </span>
                  {r.value && <span className={app.rowMeta}>{r.value}</span>}
                </li>
              ))}
            </ul>
            {sec.footer && <p className={app.note}>{sec.footer}</p>}
          </div>
        ))}
        <ul className={app.group}>
          <li className={app.row}>
            <span className={app.rowMain}>
              <span className={app.rowTitle}>Battery</span>
            </span>
            <span className={app.rowMeta}>{battery(ep, state)}%</span>
          </li>
          <li className={app.row}>
            <span className={app.rowMain}>
              <span className={app.rowTitle}>Larger Text</span>
            </span>
            <Switch on={largerText} onChange={() => setLargerText(!largerText)} label="Larger Text" />
          </li>
        </ul>
        <p className={app.note}>Larger Text stays on this device, whatever case you play.</p>
      </div>
    </section>
  );
}
