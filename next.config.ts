import type { NextConfig } from "next";

/* Carried over from the portfolio (sidbuilds.in), minus everything that only
   existed for the portfolio's own cards: remote album art, the FPL headshots,
   and the /dev/responsive frame relaxation. */
const nextConfig: NextConfig = {
  /* Tells a visitor nothing and tells everyone else which advisories to try. */
  poweredByHeader: false,

  // Keeps the dev overlay out of screenshots.
  devIndicators: false,

  /* `next dev` binds 0.0.0.0, so a phone on the same Wi-Fi can reach the
     machine by LAN IP — which is how Found should be played while building
     it. Next blocks the dev-only endpoints (HMR, the error overlay) for any
     origin it wasn't started on, so without these the page loads and then
     sits there dead. Dev-only; never consulted by `next build`. */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],

  images: {
    formats: ["image/avif", "image/webp"],
    /* A year. `/_next/image` keys on the source path, so when a photo's
       content changes, give the new file a new name. */
    minimumCacheTTL: 31_536_000,
  },

  /* The boring four. No CSP yet: a useful one needs a nonce and a real pass. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
