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
const DDMM = /^(\d{1,2})\/(\d{1,2})$/;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "Saturday", "29/11" → "Saturday 29 November", as the Lock Screen writes the day. */
export function longDay(day: string, date: string): string {
  const m = DDMM.exec(date);
  return m ? `${day} ${Number(m[1])} ${MONTHS[Number(m[2]) - 1]}` : day;
}
const DAY_MS = 86_400_000;

/** A date as a day number: any fixed year will do, since only differences are used. */
const dayNumber = (ddmm: string): number | undefined => {
  const m = DDMM.exec(ddmm);
  return m ? Date.UTC(2001, Number(m[2]) - 1, Number(m[1])) / DAY_MS : undefined;
};

const minutesOf = (at: string | undefined): number => {
  const m = HHMM.exec(at ?? "");
  return m ? Number(m[1]) * 60 + Number(m[2]) : 0;
};

/**
 * The phone's calendar. A story writes a day either as a date ("22/11") or
 * as a weekday name, which means that weekday in the week ending on the
 * chapter's first night (`first`: its weekday and its date). Then the phone
 * says it the way iOS does, from wherever the story is now (`today`, a date):
 * the time for today, "Yesterday", a weekday within the week, a date before
 * that.
 */
export type Calendar = {
  /** Where a day falls, as a day number. */
  readonly dayOf: (day: string | undefined) => number;
  /** How the phone labels a day: "Today", "Yesterday", "Monday", "22/11". */
  readonly label: (day: string | undefined) => string;
  readonly isToday: (day: string | undefined) => boolean;
  /** For sorting newest first: minutes since the phone's epoch. */
  readonly when: (day: string | undefined, at: string | undefined) => number;
};

export function calendar(first: { readonly day: string; readonly date: string }, today: string): Calendar {
  const anchor = dayNumber(first.date) ?? 0;
  const anchorWeekday = WEEK.indexOf(first.day);
  const now = dayNumber(today) ?? anchor;
  const dayOf = (day: string | undefined): number => {
    if (!day) return now;
    const date = dayNumber(day);
    if (date !== undefined) return date;
    const w = WEEK.indexOf(day);
    return w < 0 ? now : anchor - ((anchorWeekday - w + 7) % 7);
  };
  const label = (day: string | undefined): string => {
    const d = dayOf(day);
    const back = now - d;
    if (back === 0) return "Today";
    if (back === 1) return "Yesterday";
    if (back > 1 && back < 7) return WEEK[(((anchorWeekday - (anchor - d)) % 7) + 7) % 7];
    const date = new Date(d * DAY_MS);
    return `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  };
  return {
    dayOf,
    label,
    isToday: (day) => dayOf(day) === now,
    when: (day, at) => dayOf(day) * 1440 + minutesOf(at),
  };
}

/**
 * A time's place in one night, for ordering: the small hours come after the
 * evening before them, so 11:52 PM sorts ahead of 12:29 AM. The night turns
 * at noon.
 */
export function nightly(at: string): number {
  const m = HHMM.exec(at);
  if (!m) return 0;
  const h = Number(m[1]);
  return (h < 12 ? h + 24 : h) * 60 + Number(m[2]);
}
