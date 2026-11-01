/* The site's three icons, on the menu and the footer. */

export default function Socials({ className }: { className?: string }) {
  // No public accounts yet: the icons hold their place and go nowhere.
  return (
    <ul className={className} aria-hidden="true">
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </svg>
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12.2c0-1.2-1-2.2-2.2-2.2-.6 0-1.1.2-1.5.6-1.5-1-3.4-1.6-5.5-1.7l1-4.5 3.1.7a1.6 1.6 0 1 0 .2-1l-3.6-.8c-.3 0-.5.1-.6.4l-1.1 5.2c-2.1.1-4.1.7-5.6 1.7a2.2 2.2 0 1 0-2.5 3.6l-.1.8c0 3.3 3.9 6 8.7 6s8.7-2.7 8.7-6l-.1-.8c.7-.4 1.2-1.2 1.2-2ZM7.5 13.8a1.6 1.6 0 1 1 3.2 0 1.6 1.6 0 0 1-3.2 0Zm8.9 4.2c-1 .9-2.6 1-4.4 1s-3.4-.1-4.4-1a.5.5 0 0 1 .7-.7c.7.6 2 .8 3.7.8s3-.2 3.7-.8a.5.5 0 0 1 .7.7Zm-.3-2.6a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Z" />
        </svg>
      </li>
      <li>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.6 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L1.7 3h6.5l4.4 5.9L17.6 3Zm-1.1 16.2h1.7L7.1 4.7H5.3l11.2 14.5Z" />
        </svg>
      </li>
    </ul>
  );
}
