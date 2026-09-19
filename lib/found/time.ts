/* ===========================================================================
   How her phone writes the time. An iPhone in India is on the 12-hour clock:
   "1:11" on the lock screen and in the status bar, "11:48 PM" on a message.
   The story keeps 24-hour "HH:MM" everywhere, because it sorts and compares;
   these turn it into what the screen would say (PLAYTEST.md #8, #19).
   =========================================================================== */

const HHMM = /^(\d{1,2}):(\d{2})$/;

/** "01:11" → "1:11". */
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
