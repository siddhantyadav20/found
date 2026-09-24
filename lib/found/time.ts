/* ===========================================================================
   How the found phone writes the time. An iPhone in India is on the 12-hour
   clock: "12:32" on the lock screen and in the status bar, "11:48 PM" on a
   message. The story keeps 24-hour "HH:MM" everywhere, because it sorts and
   compares; these turn it into what the screen would say.
   =========================================================================== */

const HHMM = /^(\d{1,2}):(\d{2})$/;

/** "00:32" → "12:32". */
export function phoneClock(hhmm: string): string {
  const m = HHMM.exec(hhmm);
  if (!m) return hhmm;
  return `${Number(m[1]) % 12 || 12}:${m[2]}`;
}

/** "23:48" → "11:48 PM". Anything that isn't a time passes through untouched. */
export function stamp(hhmm: string | undefined): string {
  if (!hhmm) return "";
  const m = HHMM.exec(hhmm);
  if (!m) return hhmm;
  const h = Number(m[1]);
  return `${h % 12 || 12}:${m[2]} ${h < 12 ? "AM" : "PM"}`;
}

const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * How recent something is, for sorting newest first: minutes since the start
 * of the week before `today`. A day is a weekday name within the last week, or
 * a date ("22/11") for anything older, which sorts below all of them.
 */
export function recency(day: string | undefined, at: string | undefined, today: string): number {
  const m = HHMM.exec(at ?? "");
  const minutes = m ? Number(m[1]) * 60 + Number(m[2]) : 0;
  const d = WEEK.indexOf(day ?? today);
  const t = WEEK.indexOf(today);
  if (d < 0 || t < 0) return minutes - 8 * 1440;
  const back = (t - d + 7) % 7;
  return (7 - back) * 1440 + minutes;
}
