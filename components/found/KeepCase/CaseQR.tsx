"use client";

import { useEffect, useState } from "react";

import styles from "./KeepCase.module.css";

/** Quiet modules around the code, as the spec asks, so a phone can find its edges. */
const QUIET = 4;

/**
 * The restore link as a QR code, drawn as one SVG path in the label's ink on
 * the label's paper. The encoder is loaded only here, which is only on a
 * laptop: a phone has no one to show it to.
 */
export default function CaseQR({ url }: { url: string }) {
  const [qr, setQr] = useState<{ url: string; size: number; path: string } | null>(null);

  useEffect(() => {
    let live = true;
    import("qrcode-generator")
      .then(({ default: qrcode }) => {
        const code = qrcode(0, "M");
        code.addData(url);
        code.make();
        const size = code.getModuleCount();
        let path = "";
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) if (code.isDark(row, col)) path += `M${col} ${row}h1v1h-1z`;
        }
        if (live) setQr({ url, size, path });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [url]);

  if (!qr || qr.url !== url) return <span className={styles.qr} aria-hidden="true" />;
  const box = qr.size + QUIET * 2;
  return (
    <svg
      className={styles.qr}
      viewBox={`${-QUIET} ${-QUIET} ${box} ${box}`}
      role="img"
      aria-label="QR code of your case number's link"
      shapeRendering="crispEdges"
    >
      <rect x={-QUIET} y={-QUIET} width={box} height={box} fill="#f1ece2" />
      <path d={qr.path} fill="#1b1a18" />
    </svg>
  );
}
