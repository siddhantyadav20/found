"use client";

import dynamic from "next/dynamic";

/**
 * The root 404 is written into every route's payload whether it's shown or not,
 * so a server-side split doesn't help: without this, the site's whole chrome
 * ships with the game. Client-only, it loads when someone is actually lost.
 */
export default dynamic(() => import("./NotFoundPage"), { ssr: false });
