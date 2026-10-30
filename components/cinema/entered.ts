/** Set by PreloaderScript the moment the preloader lets go. */
export const ENTERED_KEY = "found:entered";
export const ENTERED_EVENT = "found:entered";

declare global {
  interface Window {
    __foundEntered?: boolean;
  }
}
