/** Set by PreloaderScript the moment the preloader lets go. */
export const ENTERED_KEY = "found:entered";
export const ENTERED_EVENT = "found:entered";
/** Set once the sound mark has played, which it does once a browser. */
export const HEARD_KEY = "found:sound-mark";

declare global {
  interface Window {
    __foundEntered?: boolean;
    /** intro.ts has the film in hand, so the script needn't start it. */
    __foundArmed?: boolean;
  }
}
