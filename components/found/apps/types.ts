import type { AppId } from "@/content/found/types";
import type { CaseState } from "@/lib/found/engine";

/**
 * How an app moves the phone: open another app (with an argument), or go
 * home. `from` is the box it was opened from (an icon, a widget), which the
 * app zooms out of and shrinks back into.
 */
export type Nav = {
  go: (app: AppId, arg?: string, from?: DOMRect) => void;
  home: () => void;
};

export type AppProps = {
  state: CaseState;
  nav: Nav;
  /** Where to open: a thread id for Messages, `pin:<question>` for Maps. */
  arg?: string;
};
