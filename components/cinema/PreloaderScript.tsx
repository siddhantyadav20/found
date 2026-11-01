"use client";

import { ENTERED_EVENT, ENTERED_KEY, HEARD_KEY } from "./entered";

import { SOUND_KEY } from "@/lib/sound";

/**
 * Ahead of the preloader's markup, so it never needs React: any page within the
 * hour, or reloaded in this tab, opens straight away, ENTER is wired on the
 * document, and anywhere that isn't the site (a phone being played, say)
 * dissolves on its own, because a player mid-story shouldn't be asked to press
 * ENTER. The film runs at once unless the sound mark is still to be heard, when
 * intro.ts takes over; it gets a few seconds to turn up, and the film runs
 * without it if it doesn't. Sent as `text/plain` on the client so React never
 * warns about a script it won't run.
 */
const SITE = /^\/(chapters|about|contact|privacy|terms|cookies)?(\/|$)/;

const source = `(function(){
var d=document.documentElement,w=window,seen=0,tab=0,done=0,site=${SITE}.test(location.pathname);
function run(){d.setAttribute("data-run","")}
function enter(){if(w.__foundEntered)return;w.__foundEntered=true;try{localStorage.setItem("${ENTERED_KEY}",String(Date.now()));sessionStorage.setItem("${ENTERED_KEY}","1")}catch(e){}d.setAttribute("data-entered","");w.dispatchEvent(new Event("${ENTERED_EVENT}"))}
try{seen=Number(localStorage.getItem("${ENTERED_KEY}"))||0;tab=sessionStorage.getItem("${ENTERED_KEY}");done=localStorage.getItem("${HEARD_KEY}")||localStorage.getItem("${SOUND_KEY}")==="off"}catch(e){}
if(tab||Date.now()-seen<36e5){w.__foundEntered=true;d.setAttribute("data-entered","");return}
if(!site){d.setAttribute("data-route","game");run();setTimeout(enter,3600)}
else if(done||matchMedia("(prefers-reduced-motion: reduce)").matches)run()
else setTimeout(function(){w.__foundArmed||run()},4e3)
document.addEventListener("click",function(e){var t=e.target;if(t&&t.closest&&(t.closest("[data-enter]")||(!site&&t.closest("[data-preloader]"))))enter()})
})()`;

export default function PreloaderScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: source }}
    />
  );
}
