"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { FeedPost, Profile, ProfilePost, ReplyOption, Story } from "@/content/types";
import { all, episodeOf, type CaseState } from "@/lib/game/engine";
import { Chevron } from "../ios/AppBar";
import Chat from "./Chat";
import styles from "./Instagram.module.css";
import Sketch from "./Sketch";

/* ===========================================================================
   Instagram, drawn as Instagram draws itself on an iPhone: black, its script
   wordmark, stories in their gradient rings, the feed a post at a time, and
   its own bar at the foot with Home, Explore and the owner's profile.

   Since 2026-10-23 (RAAKH) it does what "your phone" used to: it's where the
   night goes public, and where faces meet names. Photos holds what the owner
   shot and kept; Instagram holds what people put out: his polished posts,
   other people's, private accounts, and anybody who can be searched for.

   A post that proves something counts once it has been on screen long
   enough to read (`onRead`), in the feed or opened from a grid.
   =========================================================================== */

const initials = (name: string) =>
  name
    .split(/[\s._]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** A steady colour per account, for the ones without a photograph. */
const hue = (s: string) => [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 360, 7);

/** 18400 → "18.4K", as Instagram counts. */
// Likes as Instagram writes them under a post: the whole number, grouped, until it's in the millions.
const count = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M` : n.toLocaleString("en-IN"));

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
  lock: "M7 10.5V8a5 5 0 0 1 10 0v2.5M5.5 10.5h13v10h-13Z",
  archive: "M12 7v5l3 2M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v3h3",
  plus: "M12 5v14M5 12h14",
};

function Glyph({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? styles.glyph} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/** Whoever wrote a post, however much the story knows about them. */
type Who = { handle: string; name: string; avatar?: string; own?: boolean };

function Avatar({ who, size, ring = true }: { who: Who; size?: "post" | "profile" | "row"; ring?: boolean }) {
  return (
    <span className={styles.ring} data-own={who.own || !ring || undefined} data-size={size}>
      <span className={styles.face} style={who.avatar ? undefined : { background: `hsl(${hue(who.handle)} 32% 30%)` }}>
        {who.avatar ? <Image src={who.avatar} alt="" fill sizes="90px" className={styles.image} /> : initials(who.name)}
      </span>
    </span>
  );
}

/** The picture: a photograph, words on a colour, or a drawing of what it would show. */
function Media({ post, big }: { post: { title: string; src?: string; card?: string; text?: string }; big?: boolean }) {
  if (post.src)
    return (
      <span className={styles.tile} data-big={big || undefined}>
        <Image src={post.src} alt={post.title} fill sizes={big ? "420px" : "140px"} className={styles.image} />
      </span>
    );
  if (post.card)
    return (
      <span className={styles.tile} data-big={big || undefined} data-card style={{ background: post.card }}>
        <span className={styles.cardText}>{post.text ?? post.title}</span>
      </span>
    );
  return (
    <span className={styles.tile} data-big={big || undefined}>
      <Sketch id={post.title} title={post.title} hue={hue(post.title)} big={big} />
    </span>
  );
}

/** One post as the feed shows it: who, the picture, the actions, the caption, a comment or two. */
type Shown = {
  key: string;
  who: Who;
  title: string;
  src?: string;
  card?: string;
  caption?: string;
  english?: string;
  when?: string;
  place?: string;
  likes?: number;
  comments?: ProfilePost["comments"];
  evidence?: string;
  suggested?: boolean;
  /** Archived: only its owner sees it, and the header says so. */
  archived?: string;
};

function Post({ post, onProfile, onSeen }: { post: Shown; onProfile?: () => void; onSeen?: (evidence: string) => void }) {
  const [english, setEnglish] = useState(false);
  const ref = useRef<HTMLElement>(null);
  /* Read once it has been most of the way on screen for a moment: scrolled
     past at speed, it hasn't been seen. */
  useEffect(() => {
    const el = ref.current;
    if (!el || !post.evidence || !onSeen) return undefined;
    let t: number | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearTimeout(t);
        if (e.isIntersecting) t = window.setTimeout(() => onSeen(post.evidence!), 700);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [post.evidence, onSeen]);
  const words = post.caption;
  return (
    <article className={styles.post} ref={ref}>
      {post.suggested && <p className={styles.suggested}>Suggested for you</p>}
      {post.archived && (
        <p className={styles.archivedNote}>
          <Glyph d={G.archive} className={styles.archivedGlyph} />
          {post.archived} · Only you can see this post
        </p>
      )}
      <header className={styles.postHead}>
        <button type="button" className={styles.postWho} onClick={onProfile} disabled={!onProfile}>
          <Avatar who={post.who} size="post" />
          <span className={styles.postWhoText}>
            <b>{post.who.handle}</b>
            {post.place && <span className={styles.place}>{post.place}</span>}
          </span>
        </button>
        <Glyph d={G.dots} className={styles.dots} />
      </header>
      <Media post={{ title: post.title, src: post.src, card: post.card, text: post.card ? post.caption : undefined }} big />
      <div className={styles.actions} aria-hidden="true">
        <Glyph d={G.heart} />
        <Glyph d={G.comment} />
        <Glyph d={G.send} />
        <Glyph d={G.save} className={`${styles.glyph} ${styles.saveGlyph}`} />
      </div>
      {post.likes !== undefined && <p className={styles.likes}>{count(post.likes)} likes</p>}
      {words && !post.card && (
        <p className={styles.caption}>
          <b>{post.who.handle}</b> {words}
        </p>
      )}
      {post.english && (
        <button type="button" className={styles.translate} onClick={() => setEnglish((e) => !e)}>
          {english ? post.english : "See translation"}
        </button>
      )}
      {post.comments?.map((c) => (
        <p key={c.who + c.text} className={styles.comment}>
          <b>{c.who}</b> {c.text}
          {c.english && <span className={styles.commentEnglish}> · {c.english}</span>}
        </p>
      ))}
      {post.when && <p className={styles.when}>{post.when}</p>}
    </article>
  );
}

const fromProfile = (p: Profile, post: ProfilePost): Shown => ({
  key: `${p.handle}/${post.id}`,
  who: { handle: p.handle, name: p.name, avatar: p.avatar, own: p.own },
  title: post.title,
  src: post.src,
  card: post.card,
  caption: post.caption,
  english: post.english,
  when: post.when,
  place: post.place,
  likes: post.likes,
  comments: post.comments,
  evidence: post.evidence,
  archived: post.archived,
});

const fromFeed = (f: FeedPost, episode: number, profiles: readonly Profile[]): Shown => {
  const known = profiles.find((p) => p.handle === f.handle);
  return {
    key: `feed/${f.id}`,
    who: { handle: f.handle, name: f.who, avatar: known?.avatar },
    title: f.media ?? f.text,
    src: f.src,
    card: f.card,
    caption: f.text,
    english: f.english,
    when: f.when,
    likes: f.shares[Math.min(2, Math.max(0, episode - 1))],
    comments: f.comments,
    // The night's own posts come from accounts he doesn't follow.
    suggested: Boolean(f.requires?.length),
  };
};

function ProfileView({
  profile,
  onBack,
  onRead,
  backLabel = "Back",
}: {
  profile: Profile;
  onBack: () => void;
  onRead: (ids: readonly string[]) => void;
  backLabel?: string;
}) {
  const [post, setPost] = useState<string | null>(null);
  const [archive, setArchive] = useState(false);
  const shown = profile.posts.filter((p) => Boolean(p.archived) === archive);
  const archivedCount = profile.own ? profile.posts.filter((p) => p.archived).length : 0;
  // Where the grid was when a post was opened, so closing it goes back there.
  const body = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const open = profile.posts.find((p) => p.id === post);
  useEffect(() => {
    if (!open && body.current) body.current.scrollTop = scroll.current;
  }, [open]);
  const who = { handle: profile.handle, name: profile.name, avatar: profile.avatar, own: profile.own };

  return (
    <div className={styles.app} data-push>
      <header className={styles.bar}>
        <button
          type="button"
          className={styles.back}
          onClick={open ? () => setPost(null) : archive ? () => setArchive(false) : onBack}
          data-back
          aria-label={open ? "Back to the grid" : archive ? "Back to the profile" : backLabel}
        >
          <Chevron back />
        </button>
        <span className={styles.handleBar}>{open ? "Posts" : archive ? "Archive" : profile.handle}</span>
        <Glyph d={G.dots} className={styles.dots} />
      </header>

      <div className={styles.body} ref={body}>
        {open ? (
          <Post post={fromProfile(profile, open)} onSeen={(id) => onRead([id])} />
        ) : archive ? (
          /* The Archive, as Instagram keeps it: its own page, just the grid, and who can see it. */
          <>
            <p className={styles.archiveNote}>
              <Glyph d={G.archive} />
              Only you can see what you&apos;ve archived.
            </p>
            <div className={styles.grid}>
              {shown.map((p) => (
                <button key={p.id} type="button" className={styles.gridCell} onClick={() => setPost(p.id)} aria-label={p.title}>
                  <Media post={{ title: p.title, src: p.src, card: p.card, text: p.caption }} />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className={styles.profileHead}>
              <Avatar who={who} size="profile" ring={!profile.private} />
              <span className={styles.stats}>
                <span>
                  <b>{profile.postCount ?? profile.posts.filter((p) => !p.archived).length}</b>posts
                </span>
                <span>
                  <b>{profile.followers ?? "391"}</b>followers
                </span>
                <span>
                  <b>{profile.following ?? "208"}</b>following
                </span>
              </span>
            </div>
            <p className={styles.name}>{profile.name}</p>
            {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
            <div className={styles.buttons} aria-hidden="true">
              <span data-blue={!profile.own && !profile.private ? "" : undefined}>{profile.own ? "Edit profile" : profile.private ? "Follow" : "Following"}</span>
              <span>{profile.own ? "Share profile" : "Message"}</span>
            </div>
            {/* His own Archive, which only he can see: one tap from his profile, as Instagram keeps it. */}
            {archivedCount > 0 && !archive && (
              <button type="button" className={styles.archiveRow} onClick={() => setArchive(true)}>
                <Glyph d={G.archive} />
                <span>
                  <b>Archive</b>
                  <span>
                    {archivedCount} {archivedCount === 1 ? "post" : "posts"} only you can see
                  </span>
                </span>
                <Chevron />
              </button>
            )}
            {profile.private ? (
              <div className={styles.private}>
                <span className={styles.privateLock}>
                  <Glyph d={G.lock} />
                </span>
                <b>This account is private</b>
                <span>Follow this account to see their photos and videos.</span>
              </div>
            ) : (
              <>
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
                  {shown.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={styles.gridCell}
                      onClick={() => {
                        scroll.current = body.current?.scrollTop ?? 0;
                        setPost(p.id);
                      }}
                      aria-label={p.title}
                    >
                      <Media post={{ title: p.title, src: p.src, card: p.card, text: p.caption }} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

type Tab = "home" | "explore" | "me" | "messages";

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
  const [tab, setTab] = useState<Tab>("home");
  const [handle, setHandle] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [explored, setExplored] = useState<string | null>(null);
  const profiles = story.profiles.filter((p) => all(state, p.requires)).sort((a, b) => Number(Boolean(b.own)) - Number(Boolean(a.own)));
  const own = profiles.find((p) => p.own);
  const open = profiles.find((p) => p.handle === handle);
  const episode = episodeOf(state);
  const visit = (p: Profile) => {
    setHandle(p.handle);
    if (p.evidence) onRead([p.evidence]);
  };
  const seen = (id: string) => onRead([id]);

  // The night's posts, once their thread is known; then the people he follows and the rest of the world, in turn.
  const feed = (story.feed ?? []).filter((f) => all(state, f.requires));
  const night = feed.filter((f) => f.requires?.length).map((f) => fromFeed(f, episode, profiles));
  const world = feed.filter((f) => !f.requires?.length).map((f) => fromFeed(f, episode, profiles));
  // The people he follows, a post of each in turn, then his own latest two.
  const friends = profiles.filter((p) => !p.private && !p.own);
  const followed: Shown[] = [];
  const live = (p: Profile) => p.posts.filter((x) => !x.archived);
  for (let i = 0; i < 3; i++) for (const p of friends) if (live(p)[i]) followed.push(fromProfile(p, live(p)[i]));
  if (own) followed.push(...live(own).slice(0, 2).map((post) => fromProfile(own, post)));
  const mixed: Shown[] = [...night];
  for (let i = 0; i < Math.max(followed.length, world.length); i++) {
    if (followed[i]) mixed.push(followed[i]);
    if (world[i]) mixed.push(world[i]);
  }
  const messages = story.threads.some((t) => t.app === "instagram" && all(state, t.requires));

  if (open) return <ProfileView key={open.handle} profile={open} onBack={() => setHandle(null)} onRead={onRead} />;
  if (tab === "me" && own) return <ProfileView key="me" profile={own} onBack={() => setTab("home")} onRead={onRead} backLabel="Home" />;

  // Explore: search for anyone by name, and a grid of everything public.
  const wanted = query.trim().toLowerCase().replace(/^@/, "");
  // Anyone the player could know of, by handle, name or what their bio says (fix brief §8.9: "bedi" finds the nurse).
  const found = wanted
    ? profiles.filter((p) => p.handle.includes(wanted) || p.name.toLowerCase().includes(wanted) || (p.bio ?? "").toLowerCase().includes(wanted))
    : [];
  const requests = profiles.filter((p) => p.request && all(state, p.request.requires));
  const tiles: Shown[] = [...night, ...world, ...profiles.filter((p) => !p.private && !p.own).flatMap((p) => p.posts.filter((x) => !x.archived).map((post) => fromProfile(p, post)))];
  const exploredPost = tiles.find((t) => t.key === explored);

  const nav = (
    <nav className={styles.tabBar}>
      <button type="button" aria-label="Home" aria-pressed={tab === "home"} onClick={() => { setTab("home"); setExplored(null); }}>
        <Glyph d={G.home} className={`${styles.glyph} ${tab === "home" ? styles.on : ""}`} />
      </button>
      <button type="button" aria-label="Search and explore" aria-pressed={tab === "explore"} onClick={() => { setTab("explore"); setExplored(null); }}>
        <Glyph d={G.search} className={`${styles.glyph} ${tab === "explore" ? styles.on : ""}`} />
      </button>
      <span aria-hidden="true">
        <Glyph d={G.reels} />
      </span>
      <button type="button" aria-label="Messages" aria-pressed={tab === "messages"} onClick={() => setTab("messages")}>
        <Glyph d={G.send} className={`${styles.glyph} ${tab === "messages" ? styles.on : ""}`} />
      </button>
      <button type="button" className={styles.me} aria-label="Your profile" onClick={() => setTab("me")}>
        {own?.avatar ? <Image src={own.avatar} alt="" fill sizes="30px" className={styles.image} /> : own ? initials(own.name) : ""}
      </button>
    </nav>
  );

  if (tab === "explore")
    return (
      <div className={styles.app}>
        <header className={styles.bar}>
          <button type="button" className={styles.back} onClick={exploredPost ? () => setExplored(null) : () => setTab("home")} data-back aria-label="Back">
            <Chevron back />
          </button>
          {exploredPost ? (
            <span className={styles.handleBar}>Explore</span>
          ) : (
            <input
              className={styles.search}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search Instagram"
              autoComplete="off"
              spellCheck={false}
            />
          )}
          <span />
        </header>
        <div className={styles.body}>
          {exploredPost ? (
            <Post
              post={exploredPost}
              onSeen={seen}
              onProfile={(() => {
                const p = profiles.find((x) => x.handle === exploredPost.who.handle);
                return p ? () => visit(p) : undefined;
              })()}
            />
          ) : wanted ? (
            <ul className={styles.results}>
              {found.map((p) => (
                <li key={p.handle}>
                  <button type="button" className={styles.result} onClick={() => visit(p)}>
                    <Avatar who={p} size="row" ring={false} />
                    <span>
                      <b>{p.handle}</b>
                      <span>
                        {p.name}
                        {p.private ? " · Private" : ""}
                        {p.followers ? ` · ${p.followers} followers` : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {!found.length && <li className={styles.noResults}>No results for “{query.trim()}”.</li>}
            </ul>
          ) : (
            <div className={styles.explore}>
              {tiles.map((t, i) => (
                <button key={t.key} type="button" className={styles.gridCell} data-tall={i % 7 === 2 || undefined} onClick={() => setExplored(t.key)} aria-label={t.title}>
                  <Media post={{ title: t.title, src: t.src, card: t.card, text: t.card ? t.caption : undefined }} />
                </button>
              ))}
            </div>
          )}
        </div>
        {nav}
      </div>
    );

  if (tab === "messages")
    return (
      <div className={styles.app}>
        <header className={styles.bar}>
          <button type="button" className={styles.back} onClick={() => setTab("home")} data-back aria-label="Back">
            <Chevron back />
          </button>
          <span className={styles.handleBar}>{own?.handle ?? "Messages"}</span>
          <span />
        </header>
        <div className={styles.body}>
          {messages ? (
            <Chat story={story} state={state} app="instagram" chrome={false} onRead={onRead} onSay={onSay} />
          ) : (
            <p className={styles.noResults}>No messages yet. Messages you send and receive will appear here.</p>
          )}
        </div>
        {nav}
      </div>
    );

  return (
    <div className={styles.app}>
      <header className={styles.bar}>
        <button type="button" className={styles.back} onClick={onHome} data-back aria-label="Home">
          <Chevron back />
        </button>
        <span className={styles.wordmark}>Instagram</span>
        <span className={styles.barEnd} aria-hidden="true">
          <Glyph d={G.heart} />
          <Glyph d={G.plus} />
        </span>
      </header>

      <div className={styles.body}>
        {/* Activity: who asked to follow him (fix brief H-10). */}
        {requests.map((p) => (
          <button key={p.handle} type="button" className={styles.result} onClick={() => visit(p)} aria-label={`Follow request from ${p.handle}`}>
            <Avatar who={p} size="row" ring={false} />
            <span>
              <b>Follow request</b>
              <span>
                {p.handle} {p.request!.note} · {p.request!.when}
              </span>
            </span>
          </button>
        ))}
        <ul className={styles.rings} aria-label="Stories">
          {profiles
            .filter((p) => !p.private)
            .map((p) => (
              <li key={p.handle}>
                <button type="button" className={styles.storyButton} onClick={() => visit(p)} aria-label={p.own ? "Your profile" : `${p.name}'s profile`}>
                  <Avatar who={p} />
                  {p.own && <span className={styles.addStory}>+</span>}
                </button>
                <span className={styles.handle}>{p.own ? "Your story" : p.handle}</span>
              </li>
            ))}
        </ul>

        {mixed.map((post) => {
          const p = profiles.find((x) => x.handle === post.who.handle);
          return <Post key={post.key} post={post} onSeen={seen} onProfile={p ? () => visit(p) : undefined} />;
        })}
        <p className={styles.caughtUp}>You&apos;re all caught up</p>
      </div>
      {nav}
    </div>
  );
}
