"use client";

import { useEffect, useState } from "react";

import { useStory } from "@/components/found/StoryContext";
import { actionAvailable, all, battery, has } from "@/lib/found/engine";
import { setLargerText, useLargerText } from "@/lib/found/prefs";
import { say } from "@/lib/found/voice";
import * as play from "../FoundPhone/actions";
import { AppGlyph } from "../FoundPhone/icons";
import AppBar, { Chevron } from "./AppBar";
import Avatar from "./Avatar";
import Switch from "./Switch";
import type { AppProps } from "./types";
import app from "./App.module.css";
import s from "./Settings.module.css";

type Page = "root" | "wifi" | "sharing" | "messages" | "passcode" | "account" | "display";

/* iOS's settings tiles: a white glyph on the setting's own colour. */
const BLUE = "#0a84ff";
const GREEN = "#30d158";

function Tile({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span className={s.tile} style={{ background: bg }} aria-hidden="true">
      <svg viewBox="0 0 24 24">{children}</svg>
    </span>
  );
}

const WIFI = (
  <>
    <path d="M12 18.8 9.8 16.6a3.1 3.1 0 0 1 4.4 0Z" className={s.solid} />
    <path d="M6.6 13.4a7.6 7.6 0 0 1 10.8 0" />
    <path d="M3.8 10.5a11.6 11.6 0 0 1 16.4 0" />
  </>
);
const ARROW = <path d="M18.6 5.4 5.6 10.9l6 1.5 1.5 6Z" className={s.solid} />;
const SHARING = (
  <>
    <circle cx="12" cy="12" r="2.6" className={s.solid} />
    <circle cx="12" cy="12" r="6.8" />
  </>
);
const BUBBLE = (
  <>
    <ellipse cx="12" cy="11.3" rx="7.6" ry="6.3" className={s.solid} />
    <path d="M6 15.2c-.2 1.6-1 2.9-2 3.7 2.1.2 4.1-.5 5.5-1.8Z" className={s.solid} />
  </>
);
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

/** A settings row: a page behind it when `onOpen` is given, a plain fact when not. */
function Row({
  title,
  meta,
  sub,
  icon,
  end,
  onOpen,
}: {
  title: string;
  meta?: string;
  sub?: string;
  icon?: React.ReactNode;
  end?: React.ReactNode;
  onOpen?: () => void;
}) {
  const inner = (
    <>
      {icon}
      <span className={app.rowMain}>
        <span className={app.rowTitle}>{title}</span>
        {sub && <span className={app.rowSub}>{sub}</span>}
      </span>
      {meta && <span className={app.rowMeta}>{meta}</span>}
      {end}
    </>
  );
  return onOpen ? (
    <li>
      <button type="button" className={app.row} onClick={onOpen}>
        {inner}
        <Chevron />
      </button>
    </li>
  ) : (
    <li className={app.row}>{inner}</li>
  );
}

/**
 * Settings, as iOS lays it out: the owner's account at the top, then rows
 * with their coloured tiles. It's where nobody thinks to look, and where the
 * phone keeps what it knows about itself: every network it joined and when,
 * who can see where it is, what it does to someone who types the wrong
 * passcode, and which other devices are signed in. Some of the switches
 * work. What the player flips is something the phone did.
 */
export default function Settings({ state }: AppProps) {
  const ep = useStory();
  const [page, setPage] = useState<Page>("root");
  const t = (x: string) => say(x, state.cast);
  const ep2 = has(state, "ep:2");
  const online = has(state, "did:wifi-on");
  const canWifi = actionAvailable(ep, state, "wifi-on");
  const sharing = !has(state, "did:sharing-off");
  const receipts = !has(state, "did:receipts-off");
  const networks = ep.wifi.filter((n) => all(state, n.requires));
  const devices = ep.devices.filter((d) => all(state, d.requires));
  const owner = `${state.cast.name} ${ep.surname}`;
  const largerText = useLargerText();

  useEffect(() => {
    if (page === "wifi") play.seeAll(networks.map((n) => n.evidence));
    if (page === "account") play.seeAll(devices.map((d) => d.evidence));
  }, [page, networks, devices]);

  const Back = (title: string) => <AppBar title={title} onBack={() => setPage("root")} backLabel="Settings" />;

  if (page === "wifi") {
    return (
      <section className={app.view}>
        {Back("Wi-Fi")}
        <div className={app.body}>
          <ul className={app.group}>
            <Row
              title="Wi-Fi"
              icon={<Tile bg={BLUE}>{WIFI}</Tile>}
              end={<Switch on={online} disabled={online || !canWifi} onChange={() => play.perform("wifi-on")} label="Wi-Fi" />}
            />
          </ul>
          <p className={app.note}>
            {online
              ? "Connected to Home-4B."
              : canWifi
                ? "There's enough charge now."
                : ep2
                  ? "Needs more charge."
                  : "Turned off by Low Power Mode."}
          </p>
          <p className={app.groupLabel}>Known Networks</p>
          <ul className={app.group}>
            {networks.map((n) => (
              <Row
                key={n.ssid}
                title={n.ssid}
                sub={n.lastJoined === "Connected" ? "Connected" : `Last joined ${n.lastJoined}`}
              />
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (page === "sharing") {
    return (
      <section className={app.view}>
        {Back("Location Sharing")}
        <div className={app.body}>
          <ul className={app.group}>
            <Row
              title="Share My Location"
              end={<Switch on={sharing} disabled={!sharing} onChange={() => play.perform("sharing-off")} label="Share My Location" />}
            />
          </ul>
          <p className={app.groupLabel}>Sharing With</p>
          <ul className={app.group}>
            <Row title="K." sub={sharing ? "Since Sat 00:05" : "Stopped"} icon={<Avatar name="K." size="row" />} />
          </ul>
        </div>
      </section>
    );
  }

  if (page === "messages") {
    return (
      <section className={app.view}>
        {Back("Messages")}
        <div className={app.body}>
          <ul className={app.group}>
            <Row
              title="Send Read Receipts"
              end={<Switch on={receipts} disabled={!receipts} onChange={() => play.perform("receipts-off")} label="Send Read Receipts" />}
            />
          </ul>
          <p className={app.note}>When this is on, people are told when you&apos;ve read their messages.</p>
        </div>
      </section>
    );
  }

  if (page === "passcode") {
    return (
      <section className={app.view}>
        {Back("Face ID & Passcode")}
        <div className={app.body}>
          <ul className={app.group}>
            <Row title="Passcode" meta="On" />
            <Row title="Face ID" sub={t("Set up for {name}")} />
            <Row title="Photo after a wrong passcode" sub={t("Emails it to {name}")} meta="On" />
          </ul>
        </div>
      </section>
    );
  }

  if (page === "display") {
    return (
      <section className={app.view}>
        {Back("Display & Brightness")}
        <div className={app.body}>
          <ul className={app.group}>
            <Row
              title="Larger Text"
              end={<Switch on={largerText} onChange={() => setLargerText(!largerText)} label="Larger Text" />}
            />
          </ul>
          <p className={app.note}>Makes the text in apps bigger. It stays on this device, whatever case you play.</p>
        </div>
      </section>
    );
  }

  if (page === "account") {
    return (
      <section className={app.view}>
        {Back("Account")}
        <div className={app.body}>
          <div className={s.card}>
            <Avatar name={owner} size="card" />
            <p className={s.cardName}>{owner}</p>
          </div>
          <p className={app.groupLabel}>Signed In On</p>
          <ul className={app.group}>
            {devices.map((d) => (
              <Row key={d.id} title={t(d.name)} sub={t(d.detail)} />
            ))}
            {!online && <Row title="Refreshing…" sub="Needs Wi-Fi" />}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className={app.view}>
      <AppBar />
      <div className={app.body}>
        <h2 className={app.big}>Settings</h2>
        <ul className={app.group}>
          <li>
            <button type="button" className={s.profile} onClick={() => setPage("account")}>
              <Avatar name={owner} size="head" />
              <span className={app.rowMain}>
                <span className={s.profileName}>{owner}</span>
                <span className={s.profileSub}>Apple Account, iCloud and more</span>
              </span>
              <Chevron />
            </button>
          </li>
        </ul>
        <ul className={app.group}>
          <Row title="Wi-Fi" icon={<Tile bg={BLUE}>{WIFI}</Tile>} meta={online ? "Home-4B" : "Off"} onOpen={() => setPage("wifi")} />
          <Row title="Location Services" icon={<Tile bg={BLUE}>{ARROW}</Tile>} meta="Off" />
          <Row
            title="Location Sharing"
            icon={<Tile bg={GREEN}>{SHARING}</Tile>}
            meta={sharing ? "K." : "Off"}
            onOpen={() => setPage("sharing")}
          />
        </ul>
        <ul className={app.group}>
          <Row title="Display & Brightness" icon={<Tile bg={BLUE}>{SUN}</Tile>} onOpen={() => setPage("display")} />
          <Row title="Messages" icon={<Tile bg={GREEN}>{BUBBLE}</Tile>} onOpen={() => setPage("messages")} />
          <Row title="Face ID & Passcode" icon={<Tile bg={GREEN}>{FACE}</Tile>} onOpen={() => setPage("passcode")} />
        </ul>
        <ul className={app.group}>
          <Row
            title="NightCam"
            icon={
              <span className={s.appTile}>
                <AppGlyph app="nightcam" />
              </span>
            }
            meta="Cloud only"
            sub="Last synced Fri 23:51 via SRM-GATE3-GUEST"
          />
        </ul>
        <ul className={app.group}>
          <Row title="Battery" icon={<Tile bg={GREEN}>{BATTERY}</Tile>} meta={`${battery(ep, state)}%${ep2 ? " · Charging" : ""}`} />
          <Row title="Low Power Mode" end={<Switch on={!ep2} disabled label="Low Power Mode" />} />
        </ul>
      </div>
    </section>
  );
}
