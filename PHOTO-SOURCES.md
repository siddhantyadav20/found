# Where each photograph came from

Every photograph that ships in `public/found/`. The rule (PROJECT.md) is **CC0
or the equivalent**, approved slot by slot before download, so nothing here
needs crediting in the game itself — this file is the record, not a credits
screen.

Everything is run through `node scripts/prep-photos.mjs`, which drops all
metadata (a phone photo carries where it was taken), sizes it for a phone
screen, and blurs anything the story shouldn't show. `--check` proves it.

## Sourced

Nothing yet.

## Downloaded and rejected

Kept here so nobody spends the search twice.

| Slot | Candidate | Why not |
|---|---|---|
| **street** | [City-lights-night-street (24326520255).jpg](https://commons.wikimedia.org/wiki/File:City-lights-night-street_(24326520255).jpg), CC0 1.0, Pixel.la via Flickr — approved on its description, 2026-09-16 | Looked at, and it isn't the shot. Commons calls it motion-blurred; the photograph is **defocus bokeh** — round out-of-focus lights, no streaks — at dusk rather than 22:41, and a red double-decker bus makes it read European. The slot wants handheld smear from someone walking fast. Deleted; the placeholder stays. |

## Siddhant's own

None handed over yet. They go in `~/Desktop/Found photos/` named by slot, and
`npm run photos` prepares them: **locker, van, cake, story, shoes, letterbox,
fuel**. See PHOTOS.md for what each one has to show.

## Carried over from the pilot, still to replace

`cinema`, `balcony`, and the lock-screen `wallpaper` are the pilot's stock
photographs, moved across with the app on 2026-09-15.

- **cinema** and **balcony**: no CC0 photograph exists that fits. Commons'
  Indian cinemas are named businesses (Regal, Metro, Eros) under CC BY-SA,
  which breaks both our licence rule and the rule that no real business plays
  a part in a story with an arson in it; the string-light photographs are
  Glasgow, Paris and New York. **Decided 2026-09-16: they stay as placeholders
  and are revisited at launch.**
- **wallpaper**: Marine Drive at dusk, the Nariman Point skyline across the
  water — already the right city, so it stays (PHOTOS.md called for replacing
  it only if it wasn't Mumbai).

**Their provenance isn't recorded in this repository.** They were chosen under
the pilot's CC0-only rule, but the file names and licence pages didn't come
across with them. Before Found goes public (S15), either find the sources
again and add them here, or replace all three.
