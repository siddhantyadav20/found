"use client";

import Image from "next/image";
import { useState } from "react";

import type { Profile, ReplyOption, Story } from "@/content/types";
import { all, type CaseState } from "@/lib/game/engine";
import { Chevron } from "../ios/AppBar";
import Chat from "./Chat";
import styles from "./Instagram.module.css";

/* ===========================================================================
   Instagram, drawn as Instagram draws itself on an iPhone, not as iOS would:
   black, its script wordmark, the heart and Direct at the top; stories in
   their gradient rings; the feed, a post at a time with its action row;
   Direct messages when there are any; and its own flat bar at the foot. A
   ring, or a name over a post, opens that profile: the counts, the bio, the
   buttons, and the grid, where a photographer keeps his best work and a
   groom's brother keeps his wedding.
   =========================================================================== */

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Instagram's own glyphs, drawn at 24 units, outlined as the app draws them. */
const G = {
  heart: "M12 20.3s-8-4.7-8-10.4A4.5 4.5 0 0 1 12 7.2a4.5 4.5 0 0 1 8 2.7c0 5.7-8 10.4-8 10.4Z",
  comment: "M20.5 11.8a8.5 8.5 0 1 1-4.1-7.3A8.5 8.5 0 0 1 20.5 11.8Zm0 0 .9 8.2-6.3-2.6",
  send: "M21.5 3 3 10.3l7.1 2.9M21.5 3l-7.4 18-4-7.8M21.5 3 10.1 13.2",
  save: "M18.5 21 12 15.3 5.5 21V4.5a1.5 1.5 0 0 1 1.5-1.5h10a1.5 1.5 0 0 1 1.5 1.5Z",
  home: "M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1Z",
  reels: "M3.5 7.5h17M8 3l2.5 4.5M14 3l2.5 4.5M6 3h12a2.5 2.5 0 0 1 2.5 2.5v13A2.5 2.5 0 0 1 18 21H6a2.5 2.5 0 0 1-2.5-2.5v-13A2.5 2.5 0 0 1 6 3Zm4 8.5v6l5-3Z",
  search: "M10.5 17.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 5 5",
  grid: "M3 3h18v18H3ZM9 3v18M15 3v18M3 9h18M3 15h18",
  tag: "M12 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6.5 8c.8-3.4 3.4-5.3 6.5-5.3s5.7 1.9 6.5 5.3M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
};

function Glyph({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? styles.glyph} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

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

function Face({ profile, size }: { profile: Pick<Profile, "name" | "own">; size?: "post" | "profile" }) {
  return (
    <span className={styles.ring} data-own={profile.own || undefined} data-size={size}>
      <span className={styles.face}>{initials(profile.name)}</span>
    </span>
  );
}

/** One post as the feed shows it: who, the picture, the actions, the caption. */
function Post({ profile, post, onProfile }: { profile: Profile; post: Profile["posts"][number]; onProfile?: () => void }) {
  return (
    <article className={styles.post}>
      <header className={styles.postHead}>
        <button type="button" className={styles.postWho} onClick={onProfile} disabled={!onProfile}>
          <Face profile={profile} size="post" />
          <b>{profile.handle}</b>
        </button>
        <Glyph d={G.dots} className={styles.dots} />
      </header>
      <Tile post={post} big />
      <div className={styles.actions} aria-hidden="true">
        <Glyph d={G.heart} />
        <Glyph d={G.comment} />
        <Glyph d={G.send} />
        <Glyph d={G.save} className={`${styles.glyph} ${styles.saveGlyph}`} />
      </div>
      {post.caption && (
        <p className={styles.caption}>
          <b>{profile.handle}</b> {post.caption}
        </p>
      )}
    </article>
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
    <div className={styles.app} data-push>
      <header className={styles.bar}>
        <button type="button" className={styles.back} onClick={open ? () => setPost(null) : onBack} data-back aria-label="Back">
          <Chevron back />
        </button>
        <span className={styles.handleBar}>{open ? "Posts" : profile.handle}</span>
        <Glyph d={G.dots} className={styles.dots} />
      </header>

      <div className={styles.body}>
        {open ? (
          <Post profile={profile} post={open} />
        ) : (
          <>
            <div className={styles.profileHead}>
              <Face profile={profile} size="profile" />
              <span className={styles.stats}>
                <span>
                  <b>{profile.posts.length}</b>posts
                </span>
                <span>
                  <b>{profile.own ? "2,418" : "391"}</b>followers
                </span>
                <span>
                  <b>{profile.own ? "311" : "208"}</b>following
                </span>
              </span>
            </div>
            <p className={styles.name}>{profile.name}</p>
            {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
            <div className={styles.buttons} aria-hidden="true">
              <span>{profile.own ? "Edit profile" : "Follow"}</span>
              <span>{profile.own ? "Share profile" : "Message"}</span>
            </div>
            <div className={styles.gridTabs} aria-hidden="true">
              <span data-on>
                <Glyph d={G.grid} />
              </span>
              <span>
                <Glyph d={G.reels} />
              </span>
              <span>
                <Glyph d={G.tag} />
              </span>
            </div>
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
  const visit = (p: Profile) => {
    setHandle(p.handle);
    if (p.evidence) onRead([p.evidence]);
  };
  /* The feed the app opens on. A post that proves something stays out of it:
     that has to be opened in the grid, not scrolled past. */
  const feed = profiles.flatMap((p) => p.posts.filter((post) => !post.evidence).map((post) => ({ p, post })));
  const messages = story.threads.some((t) => t.app === "instagram" && all(state, t.requires));
  const own = profiles.find((p) => p.own);

  if (open) return <ProfileView key={open.handle} profile={open} onBack={() => setHandle(null)} onRead={onRead} />;

  return (
    <div className={styles.app}>
      <header className={styles.bar}>
        <button type="button" className={styles.back} onClick={onHome} data-back aria-label="Home">
          <Chevron back />
        </button>
        <span className={styles.wordmark}>Instagram</span>
        <span className={styles.barEnd} aria-hidden="true">
          <Glyph d={G.heart} />
          <Glyph d={G.send} />
        </span>
      </header>

      <div className={styles.body}>
        <ul className={styles.rings} aria-label="Profiles">
          {(profiles.length ? profiles : [{ handle: "", name: story.owner.name, own: true, posts: [] }]).map((p) => (
            <li key={p.handle || "own"}>
              <button
                type="button"
                className={styles.storyButton}
                onClick={() => p.handle && visit(p as Profile)}
                aria-label={p.own ? "Your profile" : `${p.name}'s profile`}
              >
                <Face profile={p} />
                {p.own && <span className={styles.addStory}>+</span>}
              </button>
              <span className={styles.handle}>{p.own ? "Your story" : p.handle}</span>
            </li>
          ))}
        </ul>

        {feed.map(({ p, post }) => (
          <Post key={post.id} profile={p} post={post} onProfile={() => visit(p)} />
        ))}

        {messages && (
          <>
            <h3 className={styles.section}>Messages</h3>
            <Chat story={story} state={state} app="instagram" chrome={false} onRead={onRead} onSay={onSay} />
          </>
        )}
      </div>

      {/* Instagram's own bar at the foot: home, reels, Direct, search, you. */}
      <nav className={styles.tabBar} aria-hidden="true">
        <Glyph d={G.home} className={`${styles.glyph} ${styles.on}`} />
        <Glyph d={G.reels} />
        <Glyph d={G.send} />
        <Glyph d={G.search} />
        <span className={styles.me}>{own ? initials(own.name) : ""}</span>
      </nav>
    </div>
  );
}
