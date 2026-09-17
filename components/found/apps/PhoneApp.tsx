"use client";

import { useEffect, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import type { CallEntry, Contact } from "@/content/found/types";
import { buzz } from "@/lib/found/buzz";
import { all, dayNow } from "@/lib/found/engine";
import * as play from "../FoundPhone/actions";
import AppBar from "./AppBar";
import type { AppProps } from "./types";
import app from "./App.module.css";
import styles from "./PhoneApp.module.css";

type Tab = "recents" | "contacts";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Recents' time column: the time for today, "Yesterday", or the weekday. */
function when(at: string, today: string): string {
  const [day, time = ""] = at.split(" ");
  const t = WEEK.indexOf(today.slice(0, 3));
  const d = WEEK.indexOf(day);
  if (d === t) return time;
  if (d === (t + 6) % 7) return "Yesterday";
  return day;
}

/**
 * The Phone app: Recents and Contacts, as iOS lays them out, and a contact's
 * card. It holds two of the first minute's answers: RAGHAV is saved as this
 * phone's own other number, and the guard at the Malhotra house was saved at
 * 20:10 on Friday.
 *
 * Every call button works the way a prepaid phone with no balance works: it
 * dials, and the network tells you to recharge. Nobody gets called from this
 * phone, and a stranger isn't going to top it up.
 */
export default function PhoneApp({ state }: AppProps) {
  const ep = useStory();
  const today = dayNow(state, ep.clocks);
  const [tab, setTab] = useState<Tab>("recents");
  const [card, setCard] = useState<string | null>(null);
  const [dialing, setDialing] = useState<string | null>(null);
  const contacts = (ep.contacts ?? []).filter((c) => all(state, c.requires));
  const recents = (ep.callLog ?? []).filter((c) => all(state, c.requires));
  const contact = contacts.find((c) => c.id === card);

  useEffect(() => {
    if (tab === "recents") play.seeAll(recents.map((r) => r.evidence));
  }, [tab, recents]);

  useEffect(() => {
    play.see(contact?.evidence);
  }, [contact]);

  const nameOf = (r: CallEntry) => contacts.find((c) => c.id === r.who)?.name ?? r.who;

  if (dialing) return <Dialing to={dialing} onEnd={() => setDialing(null)} />;

  if (contact) {
    return (
      <section className={app.view}>
        <AppBar onBack={() => setCard(null)} backLabel={tab === "recents" ? "Recents" : "Contacts"} />
        <div className={app.body}>
          <div className={styles.card}>
            <span className={styles.bigAvatar}>{contact.name.replace(/[^\p{L}]/gu, "").slice(0, 1)}</span>
            <p className={styles.cardName}>{contact.name}</p>
            <button type="button" className={styles.callButton} onClick={() => setDialing(contact.name)}>
              <PhoneGlyph />
              call
            </button>
          </div>
          <ul className={app.group}>
            <li className={styles.field}>
              <span className={styles.fieldLabel}>{contact.label ?? "mobile"}</span>
              <span className={styles.fieldValue}>{contact.number}</span>
            </li>
            {contact.note && (
              <li className={styles.field}>
                <span className={styles.fieldLabel}>Notes</span>
                <span className={styles.note}>{contact.note}</span>
              </li>
            )}
          </ul>
          {recents.some((r) => r.who === contact.id) && (
            <>
              <p className={app.groupLabel}>Calls</p>
              <ul className={app.group}>
                {recents
                  .filter((r) => r.who === contact.id)
                  .map((r) => (
                    <li key={r.id} className={styles.field}>
                      <span className={styles.fieldValue} data-missed={r.dir === "missed" || undefined}>
                        {r.dir === "out" ? "Outgoing call" : r.dir === "in" ? "Incoming call" : "Missed call"}
                        {r.count ? ` (${r.count})` : ""}
                      </span>
                      <span className={styles.fieldLabel}>
                        {r.at.replace(" ", " · ")}
                        {r.duration ? ` · ${r.duration}` : ""}
                      </span>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={app.view}>
      <AppBar />
      <div className={app.body}>
        <h2 className={app.big}>{tab === "recents" ? "Recents" : "Contacts"}</h2>
        {tab === "recents" ? (
          <ul className={styles.list}>
            {recents.map((r) => {
              const known = contacts.some((c) => c.id === r.who);
              return (
                <li key={r.id} className={styles.recent}>
                  <span className={styles.dir} aria-hidden="true">
                    {r.dir === "out" && (
                      <svg viewBox="0 0 12 12">
                        <path d="M3 9 9 3M4.5 3H9v4.5" />
                      </svg>
                    )}
                  </span>
                  <span className={styles.recentMain}>
                    <span className={styles.recentName} data-missed={r.dir === "missed" || undefined}>
                      {nameOf(r)}
                      {r.count ? ` (${r.count})` : ""}
                    </span>
                    <span className={styles.recentSub}>{known ? (contacts.find((c) => c.id === r.who)?.label ?? "mobile") : "unknown"}</span>
                  </span>
                  <span className={styles.recentTime}>{when(r.at, today)}</span>
                  {known ? (
                    <button type="button" className={styles.infoButton} onClick={() => setCard(r.who)} aria-label={`${nameOf(r)} details`}>
                      <svg viewBox="0 0 22 22" aria-hidden="true">
                        <circle cx="11" cy="11" r="9" />
                        <path d="M11 10v5.5M11 6.8v.2" />
                      </svg>
                    </button>
                  ) : (
                    <span className={styles.infoButton} />
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className={app.group}>
            {[...contacts]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c: Contact) => (
                <li key={c.id}>
                  <button type="button" className={app.row} onClick={() => setCard(c.id)}>
                    <span className={app.rowMain}>
                      <span className={app.rowTitle}>{c.name}</span>
                      {c.label && <span className={app.rowSub}>{c.label}</span>}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
      <nav className={styles.tabs}>
        {(["recents", "contacts"] as const).map((t) => (
          <button type="button" key={t} data-on={tab === t || undefined} onClick={() => setTab(t)}>
            {t === "recents" ? "Recents" : "Contacts"}
          </button>
        ))}
      </nav>
    </section>
  );
}

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.6 4.6c.5-.2 1.1 0 1.4.4l1.8 2.8c.3.5.2 1.1-.2 1.5L9.4 10.5c.8 1.9 2.2 3.4 4.1 4.3l1.2-1.2c.4-.4 1-.5 1.5-.2l2.8 1.8c.5.3.6.9.4 1.4l-.8 1.9c-.3.6-.9 1-1.6.9C10.4 18.8 5.4 13.9 4.8 7.3c-.1-.7.3-1.3.9-1.6Z" />
    </svg>
  );
}

/** How long it dials before the network answers instead of the person. */
const RING_FOR = 2200;

/** Dialling, then the network's recorded voice, then back. */
function Dialing({ to, onEnd }: { to: string; onEnd: () => void }) {
  const ep = useStory();
  const [refused, setRefused] = useState(false);
  const message = ep.cantCall;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      buzz();
      setRefused(true);
    }, RING_FOR);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className={styles.dialing}>
      <p className={styles.dialState}>{refused ? message?.from ?? "Call failed" : "calling mobile…"}</p>
      <h2 className={styles.dialName}>{to}</h2>
      {refused && message && (
        <p className={styles.dialLine}>
          “{message.text}”{message.en && <small>{message.en}</small>}
        </p>
      )}
      <button type="button" className={styles.hangUp} onClick={onEnd} aria-label="End call">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.2 13.6c4.9-4.3 12.7-4.3 17.6 0 .6.5.7 1.4.2 2l-1.4 1.6c-.5.5-1.2.6-1.8.3l-2.3-1.2c-.5-.3-.8-.8-.8-1.4v-1.4c-2-.6-3.4-.6-5.4 0v1.4c0 .6-.3 1.1-.8 1.4l-2.3 1.2c-.6.3-1.3.2-1.8-.3L3 15.6c-.5-.6-.4-1.5.2-2Z" />
        </svg>
      </button>
    </section>
  );
}
