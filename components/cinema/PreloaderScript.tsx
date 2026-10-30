"use client";

import { ENTERED_EVENT, ENTERED_KEY } from "./entered";

/**
 * Ahead of the preloader's markup, so it never needs React: a visit within the
 * hour opens straight away, ENTER is wired on the document, and anywhere that
 * isn't the site (a phone being played, say) dissolves on its own, because a
 * player mid-story shouldn't be asked to press ENTER. Sent as `text/plain` on
 * the client so React never warns about a script it won't run.
 */
const SITE = /^\/(chapters|about|contact|privacy|terms|cookies)?(\/|$)/;

const source = `(function(){
var d=document.documentElement,w=window,seen=0,site=${SITE}.test(location.pathname);
function enter(){if(w.__foundEntered)return;w.__foundEntered=true;try{localStorage.setItem("${ENTERED_KEY}",String(Date.now()))}catch(e){}d.setAttribute("data-entered","");w.dispatchEvent(new Event("${ENTERED_EVENT}"))}
try{seen=Number(localStorage.getItem("${ENTERED_KEY}"))||0}catch(e){}
if(Date.now()-seen<36e5){w.__foundEntered=true;d.setAttribute("data-entered","");return}
if(!site){d.setAttribute("data-route","game");setTimeout(enter,3600)}
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
