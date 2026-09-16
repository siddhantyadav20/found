import SoundToggle from "../SoundToggle";
import DeskPhone from "./DeskPhone";
import YourCases from "./YourCases";
import styles from "./Desk.module.css";

/**
 * The homepage: a desk at night with things people left behind on it.
 *
 * The phone is the one live object. New, it buzzes as its lock screen fills
 * up; once you've played, it's your phone as you left it (DeskPhone). The
 * shapes around it are other found things, deliberately unnamed until their
 * cases exist.
 *
 * The room is server-rendered, and the buzzing and the arriving notifications
 * are CSS. What only this browser knows (your phone's state, your cases, the
 * case number) is drawn once it can be read. A passed-on link never comes
 * here; it goes straight to its envelope (`/d/[code]`).
 */
export default function Desk({ minutes }: { minutes?: number }) {
  return (
    <main className={styles.room} id="main">
      <SoundToggle className={styles.sound} />

      <header className={styles.head}>
        <h1 className={styles.brand}>Found</h1>
        <p className={styles.tagline}>Mysteries played on the missing person&apos;s phone.</p>
      </header>

      <DeskPhone minutes={minutes} />

      <YourCases />
    </main>
  );
}
