import styles from "./Arrow.module.css";

const PATH =
  "M4.481.005a6.65 6.65 0 0 1 6.46 4.659c.078.229.08.479-.003.706C10.302 7.105 8.318 10 4.48 10V8.39c.941.127 2.922-.257 4.442-2.603H0V4.208h8.938c-.756-1.229-2.216-2.78-4.457-2.78V.006Z";

/** The round arrow on everything that leads somewhere. It points right; `to` turns it. */
export default function Arrow({
  to = "right",
  tone = "white",
  small = false,
  className,
}: {
  to?: "right" | "left" | "down" | "up";
  tone?: "white" | "black";
  small?: boolean;
  className?: string;
}) {
  return (
    <span className={`${styles.round} ${className ?? ""}`} data-to={to} data-tone={tone} data-small={small || undefined}>
      <svg viewBox="0 0 11 10" fill="currentColor" aria-hidden="true">
        <path d={PATH} />
      </svg>
    </span>
  );
}
