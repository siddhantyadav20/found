import { LOGO_PATH, LOGO_VIEWBOX } from "./logoPath";

/** The FOUND wordmark. It takes its colour from the text around it. */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={LOGO_VIEWBOX} fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d={LOGO_PATH} />
    </svg>
  );
}
