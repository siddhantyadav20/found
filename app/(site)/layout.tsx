import Chrome from "@/components/cinema/Chrome";

/** The site around the game: its nav and its page fades persist across these routes. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <Chrome>{children}</Chrome>;
}
