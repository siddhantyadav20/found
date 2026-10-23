"use client";

/**
 * Ahead of the splash's markup: a visit that has already seen it opens
 * straight away. Sent as `text/plain` on the client so React never warns
 * about a script it won't run (the pattern SaveScript uses).
 */
const SEEN = "found:splash";

export default function SplashScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `try{if(sessionStorage.getItem("${SEEN}"))document.documentElement.setAttribute("data-splashed","");else sessionStorage.setItem("${SEEN}","1")}catch(e){}`,
      }}
    />
  );
}
