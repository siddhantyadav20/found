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
        // On Raakh's own pages the series line stays off the splash (RAAKH-V3 §20): that phone turns out to be yours.
        __html: `try{if(/raakh/.test(location.pathname))document.documentElement.setAttribute("data-chapter","raakh");if(sessionStorage.getItem("${SEEN}"))document.documentElement.setAttribute("data-splashed","");else sessionStorage.setItem("${SEEN}","1")}catch(e){}`,
      }}
    />
  );
}
