import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CASES, FEATURED, isCaseId, type CaseId } from "@/content/cases";
import { STORIES } from "@/content/stories";
import type { Story } from "@/content/types";
import { LEFT } from "@/lib/found/events";
import { readFunnel, type Funnel } from "@/lib/found/store";
import { redisReady } from "@/lib/upstash";
import styles from "./insights.module.css";

/* ===========================================================================
   Insights (2026-10-29): where players stop, for Siddhant only.

   Reads the funnel straight from the store (lib/found/store.ts): anonymous
   counters, no identifiers. Behind `FOUND_STATS_TOKEN` as `?token=`, open in
   `next dev`; a wrong token is a 404. Without a store or a token it says
   what's missing rather than drawing zeroes.
   =========================================================================== */

export const metadata: Metadata = { title: "Insights", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

type Step = { key: string; label: string; note?: string };

/** The chapter in order: its milestones, with each episode's questions where they're asked. */
function stepsOf(story: Story): Step[] {
  const qs = (ep: number): Step[] =>
    story.questions
      .filter((q) => q.episode === ep && !q.optional)
      .map((q) => ({ key: `solved:${q.id}`, label: `Answered ${q.final ? "the last question" : q.id.toUpperCase()}`, note: q.ask }));
  const eps = story.episodes.length;
  return [
    { key: "open", label: "Opened the parcel" },
    { key: "unlock", label: "Unlocked the phone" },
    { key: "past-lock", label: "Past the lock screen" },
    ...qs(1),
    ...(eps > 1
      ? [
          { key: "ep1-end", label: "Episode 1 over", note: "The phone died" },
          { key: "ep2-start", label: "Episode 2 started", note: "Charged it" },
          ...qs(2),
        ]
      : []),
    ...(eps > 2
      ? [
          { key: "ep2-end", label: "Episode 2 over" },
          { key: "ep3-start", label: "Episode 3 started" },
          ...qs(3).filter((s) => !story.questions.find((q) => `solved:${q.id}` === s.key)?.final),
        ]
      : []),
    ...(story.reveal
      ? [
          { key: "reveal", label: "The reveal began" },
          { key: "reveal-done", label: "The reveal finished" },
        ]
      : []),
    ...story.questions.filter((q) => q.final).map((q) => ({ key: `solved:${q.id}`, label: "Answered the last question", note: q.ask })),
    { key: "end", label: "Reached an ending" },
    { key: "card", label: "Saw the end card" },
  ];
}

const pct = (n: number, of: number) => (of > 0 ? Math.round((n / of) * 100) : 0);
const mins = (s: number | null | undefined) => (s == null ? "—" : `${Math.round(s / 60)} min`);
const at = (xs: readonly number[], q: number) => (xs.length ? xs[Math.min(xs.length - 1, Math.floor(xs.length * q))] : null);

export default async function Insights({ searchParams }: Props) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : undefined;
  const secret = process.env.FOUND_STATS_TOKEN;
  const dev = process.env.NODE_ENV === "development";
  if (!dev && !secret) return <Setup step="token" store={redisReady()} />;
  if (!dev && token !== secret) notFound();

  const c = typeof params.case === "string" && isCaseId(params.case) ? params.case : FEATURED;
  const funnel = await readFunnel(c);
  if (!funnel.configured) return <Setup step="store" store={false} />;
  return <Report id={c} funnel={funnel} token={token} />;
}

function Report({ id, funnel, token }: { id: CaseId; funnel: Funnel; token?: string }) {
  const story = STORIES[id];
  const n = (k: string) => funnel.counts[k] ?? 0;
  const steps = stepsOf(story);
  const opened = n("open");
  const drops = steps.map((s, i) => (i === 0 ? 0 : Math.max(0, n(steps[i - 1].key) - n(s.key))));
  const worst = drops.indexOf(Math.max(...drops));
  const left = LEFT.map((k) => ({ k, label: k.slice(5), v: n(k) }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);
  const leftTotal = left.reduce((t, x) => t + x.v, 0);
  const ends = story.endings.map((e) => ({ id: e.id, row: e.row, v: n(`end:${e.id}`) }));
  const endTotal = ends.reduce((t, x) => t + x.v, 0);
  const maxDay = Math.max(1, ...funnel.days.map((d) => d.counts.open ?? 0));
  const q = (k: string) => (token ? `?case=${k}&token=${encodeURIComponent(token)}` : `?case=${k}`);

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>Found · Insights</p>
        <h1>{story.title}</h1>
        <nav className={styles.cases}>
          {Object.values(CASES).map((m) => (
            <Link key={m.id} href={`/insights${q(m.id)}`} data-on={m.id === id || undefined}>
              {m.title}
            </Link>
          ))}
        </nav>
        <p className={styles.small}>
          Anonymous counts since the store was connected. One player can count twice if they start over; a second go from
          Choose differently isn&apos;t counted again.
        </p>
      </header>

      <section className={styles.kpis}>
        <Kpi label="Opened" value={opened} />
        <Kpi label="Finished" value={n("end")} sub={`${pct(n("end"), opened)}% of opened`} />
        <Kpi label="Median time to finish" value={mins(funnel.medianSeconds)} sub={funnel.times.length ? `middle half ${mins(at(funnel.times, 0.25))}–${mins(at(funnel.times, 0.75))}` : undefined} />
        <Kpi label="Came back after a break" value={n("resume")} />
        <Kpi label="Chose differently" value={n("again")} sub={`${pct(n("again"), n("card"))}% of end cards`} />
        <Kpi label="Opened Pass it on" value={n("share:open")} sub={`${pct(n("share:open"), n("card"))}% of end cards`} />
      </section>

      <section className={styles.block}>
        <h2>The funnel</h2>
        <p className={styles.small}>Each step against everyone who opened the parcel. The biggest loss is marked.</p>
        <ol className={styles.funnel}>
          {steps.map((s, i) => (
            <li key={s.key} data-worst={i === worst && drops[i] > 0 ? true : undefined}>
              <div className={styles.stepHead}>
                <span>
                  {s.label}
                  {s.note && <small>{s.note}</small>}
                </span>
                <b>{n(s.key)}</b>
              </div>
              <span className={styles.track}>
                <i style={{ width: `${pct(n(s.key), opened)}%` }} />
              </span>
              <p className={styles.stepFoot}>
                {pct(n(s.key), opened)}% of opened
                {i > 0 && drops[i] > 0 && ` · lost ${drops[i]} (${pct(drops[i], n(steps[i - 1].key))}%) since the step before`}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.block}>
        <h2>Where they put the phone down</h2>
        <p className={styles.small}>
          The screen showing when the tab was closed or hidden, once per screen per visit. A long bar at a step the funnel also
          loses people at is where to look.
        </p>
        {left.length ? (
          <ul className={styles.bars}>
            {left.map((x) => (
              <li key={x.k}>
                <span>{x.label}</span>
                <span className={styles.track}>
                  <i style={{ width: `${pct(x.v, left[0].v)}%` }} />
                </span>
                <b>
                  {x.v} · {pct(x.v, leftTotal)}%
                </b>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Nothing yet.</p>
        )}
      </section>

      <section className={styles.block}>
        <h2>Questions</h2>
        <p className={styles.small}>Wrong tries per answer and hints are where a question is too hard. Nudges are the game offering help unasked.</p>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Q</th>
                <th>Answered</th>
                <th>Wrong</th>
                <th>Wrong / answer</th>
                <th>Hint 1</th>
                <th>Hint 2</th>
                <th>Hint 3</th>
                <th>Nudged</th>
              </tr>
            </thead>
            <tbody>
              {story.questions.map((x) => {
                const solved = n(`solved:${x.id}`);
                const wrong = n(`wrong:${x.id}`);
                return (
                  <tr key={x.id}>
                    <th title={x.ask}>
                      {x.id.toUpperCase()} <small>Ep {x.episode}</small>
                    </th>
                    <td>{solved}</td>
                    <td>{wrong}</td>
                    <td data-hot={solved && wrong / solved >= 2 ? true : undefined}>{solved ? (wrong / solved).toFixed(1) : "—"}</td>
                    <td>{n(`hint:${x.id}:1`)}</td>
                    <td>{n(`hint:${x.id}:2`)}</td>
                    <td data-hot={solved && n(`hint:${x.id}:3`) / solved >= 0.4 ? true : undefined}>{n(`hint:${x.id}:3`)}</td>
                    <td>{n(`nudge:${x.id}`)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.block}>
        <h2>Endings</h2>
        <p className={styles.small}>First endings only. {n("again")} went back to choose differently.</p>
        <ul className={styles.bars}>
          {ends.map((e) => (
            <li key={e.id}>
              <span>{e.row}</span>
              <span className={styles.track}>
                <i style={{ width: `${pct(e.v, endTotal)}%` }} />
              </span>
              <b>
                {e.v} · {pct(e.v, endTotal)}%
              </b>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.block}>
        <h2>The last two weeks</h2>
        <p className={styles.small}>Days in IST.</p>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Day</th>
                <th>Opened</th>
                <th aria-label="Opened, as a bar" />
                <th>Unlocked</th>
                <th>Ep 2</th>
                <th>Ep 3</th>
                <th>Finished</th>
                <th>Again</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {funnel.days.map((d) => (
                <tr key={d.day}>
                  <th>{new Date(`${d.day}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", weekday: "short", timeZone: "UTC" })}</th>
                  <td>{d.counts.open}</td>
                  <td className={styles.spark}>
                    <i style={{ width: `${pct(d.counts.open ?? 0, maxDay)}%` }} />
                  </td>
                  <td>{d.counts.unlock}</td>
                  <td>{d.counts["ep2-start"]}</td>
                  <td>{d.counts["ep3-start"]}</td>
                  <td>{d.counts.end}</td>
                  <td>{d.counts.again}</td>
                  <td>{d.counts["share:open"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {story.choices?.length ? (
        <section className={styles.block}>
          <h2>Choices along the way</h2>
          <ul className={styles.grid}>
            {story.choices.map((f) => (
              <li key={f}>
                <span>{f.replace(/^did:/, "")}</span>
                <b>{n(f.replace(/^did:/, ""))}</b>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={styles.block}>
        <h2>Passing it on, and keeping it</h2>
        <ul className={styles.grid}>
          {[
            "share:open",
            "share:whatsapp",
            "share:native",
            "share:copy",
            "share:night",
            "drop:create",
            "drop:arrive",
            "drop:open",
            "drop:unlock",
            "drop:end",
            "charge:real",
            "charge:already",
            "charge:tap",
            "keep:number",
            "keep:restore",
            "reset:yes",
            "guard:inapp",
            "guard:chrome",
          ].map((k) => (
            <li key={k}>
              <span>{k}</span>
              <b>{n(k)}</b>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Kpi({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className={styles.kpi}>
      <p>{label}</p>
      <b>{value}</b>
      {sub && <small>{sub}</small>}
    </div>
  );
}

function Setup({ step, store }: { step: "token" | "store"; store: boolean }) {
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>Found · Insights</p>
        <h1>{step === "store" ? "No store connected" : "Not set up yet"}</h1>
      </header>
      <ol className={styles.setup}>
        {step === "token" ? (
          <li>
            In Vercel → the <b>found</b> project → Settings → Environment Variables, add <code>FOUND_STATS_TOKEN</code> with any
            long password, then redeploy. This page is then at <code>/insights?token=&lt;that password&gt;</code>.
          </li>
        ) : null}
        {!store && (
        <li>
          In Vercel → the <b>found</b> project → Storage, add an <b>Upstash Redis</b> database (the free plan is plenty) and
          connect it to Production. Its variables are picked up on the next deploy, and counting starts from then.
        </li>
        )}
      </ol>
    </main>
  );
}
