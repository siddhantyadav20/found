"use client";

import Image from "next/image";
import { useState } from "react";

import type { Profile, ReplyOption, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { Chevron } from "../ios/AppBar";
import Chat from "./Chat";
import styles from "./Instagram.module.css";

/* ===========================================================================
   Instagram: the wordmark, a row of profiles in their gradient rings (the
   owner's first, "Your story"), and the Direct messages underneath
   (PLAYTEST.md #42). A ring opens its profile: the name, the bio, and the
   grid, where a photographer keeps his best work and a groom's brother keeps
   his wedding.
   =========================================================================== */

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Tile({ post, big }: { post: Profile["posts"][number]; big?: boolean }) {
  return (
    <span className={styles.tile} data-big={big || undefined}>
      {post.src ? (
        <Image src={post.src} alt={post.title} fill sizes={big ? "400px" : "130px"} className={styles.image} />
      ) : (
        <span className={styles.tileTitle}>{post.title}</span>
      )}
    </span>
  );
}

function ProfileView({
  profile,
  onBack,
  onRead,
}: {
  profile: Profile;
  onBack: () => void;
  onRead: (ids: readonly string[]) => void;
}) {
  const [post, setPost] = useState<string | null>(null);
  const open = profile.posts.find((p) => p.id === post);

  return (
    <div className={styles.app}>
      <header className={styles.bar}>
        <button type="button" className={styles.back} onClick={open ? () => setPost(null) : onBack} data-back aria-label="Back">
          <Chevron back />
        </button>
        <span className={styles.handleBar}>{profile.handle}</span>
        <span />
      </header>

      <div className={styles.body}>
        {open ? (
          <figure className={styles.post}>
            <Tile post={open} big />
            {open.caption && (
              <figcaption className={styles.caption}>
                <b>{profile.handle}</b> {open.caption}
              </figcaption>
            )}
          </figure>
        ) : (
          <>
            <div className={styles.profileHead}>
              <span className={styles.ring} data-own={profile.own || undefined}>
                <span className={styles.face}>{initials(profile.name)}</span>
              </span>
              <span className={styles.counts}>
                <b>{profile.posts.length}</b> posts
              </span>
            </div>
            <p className={styles.name}>{profile.name}</p>
            {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
            <div className={styles.grid}>
              {profile.posts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={styles.gridCell}
                  onClick={() => {
                    setPost(p.id);
                    if (p.evidence) onRead([p.evidence]);
                  }}
                  aria-label={p.title}
                >
                  <Tile post={p} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Instagram({
  story,
  state,
  onHome,
  onRead,
  onSay,
}: {
  story: Story;
  state: CaseState;
  onHome: () => void;
  onRead: (ids: readonly string[]) => void;
  onSay?: (option: ReplyOption, replyId: string) => void;
}) {
  const [handle, setHandle] = useState<string | null>(null);
  const profiles = story.profiles.filter((p) => all(state, p.requires)).sort((a, b) => Number(Boolean(b.own)) - Number(Boolean(a.own)));
  const open = profiles.find((p) => p.handle === handle);

  if (open) return <ProfileView key={open.handle} profile={open} onBack={() => setHandle(null)} onRead={onRead} />;

  return (
    <div className={styles.app}>
      <header className={styles.bar}>
        <button type="button" className={styles.back} onClick={onHome} data-back aria-label="Home">
          <Chevron back />
        </button>
        <span className={styles.wordmark}>Instagram</span>
        <span />
      </header>

      <div className={styles.body}>
        <ul className={styles.rings} aria-label="Profiles">
          {(profiles.length ? profiles : [{ handle: "", name: story.owner.name, own: true, posts: [] }]).map((p) => (
            <li key={p.handle || "own"}>
              <button
                type="button"
                className={styles.ring}
                data-own={p.own || undefined}
                onClick={() => {
                  if (!p.handle) return;
                  setHandle(p.handle);
                  if (p.evidence) onRead([p.evidence]);
                }}
                aria-label={p.own ? "Your profile" : `${p.name}'s profile`}
              >
                <span className={styles.face}>{initials(p.name)}</span>
              </button>
              <span className={styles.handle}>{p.own ? "Your story" : p.handle}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.section}>Messages</h3>
        <Chat story={story} state={state} app="instagram" chrome={false} onRead={onRead} onSay={onSay} />
      </div>
    </div>
  );
}
