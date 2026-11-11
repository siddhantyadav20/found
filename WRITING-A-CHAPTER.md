# Writing or rewriting a chapter

How to change a story in Found without breaking how it plays. The vocabulary is
`content/types.ts`; a chapter is a folder under `content/<case>/` that builds
one `Story`. Nothing in `lib/game/` knows any one story, and it should stay
that way: if a change needs the engine to know a name, it belongs in the data.

## The three checks that guard a rewrite

Run `npx vitest run`. Three suites exist so that a script change can't quietly
strand a player:

| Suite | What it catches |
| --- | --- |
| `tests/script.test.ts` (`lib/game/lint.ts`) | Ids that name nothing, two things sharing an id, a flag that's waited on and never set (a typo in `requires`), evidence nothing on the phone carries, proof that only arrives in a later episode or behind its own answer, a row that gives its answer away, an ending filed that doesn't exist, a lines question without a `scene`, a `misses` id that's missing or is the row's own route, a version claim without `against`. Runs on every chapter in `content/stories.ts`. |
| `tests/leads.test.ts` (`lib/game/lead.ts`) | A player who opens **only** what the hints point at, and replies only when told someone is waiting, still reaches an ending. If a question or a quiet stretch has nowhere to go, it fails and prints the last hints it followed. |
| `tests/raakh.test.ts` (and the chapter's own) | The branch routes, every ending reachable, the clock moving forward, the content rules of that chapter. |

A failure names what broke and where (`q5b.truth “whether Bhasin is watching”:
names evidence “bhasin-home”, which doesn't exist`). Fix the data, not the check.
If the game's own code starts setting a new flag, the checker reads it off the
source by itself (string literals, and `` `did:x-${id}` `` families).

## Help is worked out, not written

Players get stuck in a chapter's quiet stretches far more than in its
questions. All help after the first nudge is derived from the script by
`lib/game/lead.ts`, so a rewrite never leaves a hint pointing at something
that moved:

- **Hint 1** is the question's own `hints[0]`: a written nudge, in the story's voice.
- **Hint 2** names the app and what the row is about ("Look in WhatsApp: something there shows who sent the car"). A detective stops here.
- **Hint 3** names the thing and what stands in front of it ("Some chats are locked and hidden: type their secret code into WhatsApp's Search", then "Open the chat with Nitin in WhatsApp").
- **The idle nudge** (45 s without progress) says hint 2 for an open question, and, with nothing to answer, what the night is waiting for ("Nitin is waiting for your reply in WhatsApp"). It's counted as `nudge:<question>` / `nudge:waiting` on /insights, alongside `pin:` / `miss:` (right and wrong pins per question: aim for a median of about one wrong pin), `glow:` and `autopin:on|off`.
- **"Look in …"** on a lines question lists the apps still worth looking in, read off the rows that are waiting.

`hints[1]` and `hints[2]` are still used for a chapter without a lines case
file, and as the fallback when nothing can be worked out. Keep them true.

For the derivation to work, the data has to say how things are reached, which
it already must for the game to work: `requires` on evidence, messages and
threads; `after` on events, dark screens and moments; `sets` on reply options,
settings toggles and claims; `locked`, `downloadsAfter` and `knownAfter` on
notes; `offloaded` on home icons; `inCloud` and `hidden` on photos.

## Writing a question (lines case file)

A question's rows are its true line's `facts`. Each fact is one thing the line
claims, said three ways:

```ts
{ fact: "Nitin sent a car to the service gate",  // the row once it's shown
  what: "who sent the car",                       // the row while it waits: what it's about, never what it is
  by: ["car-message", ["gate-screenshot", "guard-log"]] } // routes: one id, or a set that has to go together
```

- `what` starts with who / what / where / when / whether / how / why. "that he's alive" prints the answer on a row the player hasn't earned; the checker refuses it.
- Give every fact **at least two routes** where the story allows, and at least one that nothing on the phone can delete.
- Every route has to be reachable **in the question's own episode**, and never behind the question's own answer.
- Sameer's account is a claim with `version: true`; it's offered as a line once its own `facts` (or `proof`) are shown.
- A hunch that would give the answer away printed as a button gets `unsaid: true`.
- The last question's lines are its endings (`ending`, `confirm`); each needs facts, or `free: true`.

### Pinning: what the player does with a row

With `filing: "lines"` a row doesn't fill itself. The player **pins a clue
they've seen** to it, and the game only checks it (`lib/game/pin.ts`). A
right pin is any one id from one of the fact's routes (a set route needs every
part seen; pinning one half says "That's part of it"). A wrong pin changes
nothing and the note says why. Three things in the data make that work:

- **`scene`** on the question (required for lines; the checker refuses one without it): `{ label: "1:14 – 2:04 AM · The service gate", at: "01:14", ask?: "What happened to Dilip after the shot?" }`. `label` is the note's eyebrow, `ask` a short question for the note and the Home Screen widget (it falls back to `ask`), and `at` is `"HH:MM"`, `"before"` or `"after"`: where the answer sits on "The night so far".
- **`misses`** on a fact: the near misses, clue id → what Sameer says when it's pinned there (`{ "not-speaking": "At 2:41 he'd stopped speaking. That isn't the same thing. Look earlier." }`). The tray offers one as its decoy, so the choice is real. Each id must exist and must not be one of the fact's own routes.
- **`against`** on a `version: true` claim: the lead facts its account can't stand next to. When the player calls his account with one of them pinned, the note says "Doesn't square with what you pinned: …". Every version claim needs it, naming facts of the question's true line.

The tray shows the latest right clue for each open row, then the latest of the
rest (three in all), plus one decoy; "Everything else you've found here"
lists the rest. **Story mode** ("Fill the lines for me", `did:autopin`, kept
across a restart) fills rows as before, for a player who wants the story
without the work.

Help shows before it tells: after a pause the clue that fits glows on the
tray, or, with none to hand, the app it's in glows on the Home Screen. The
pause is the player's own: 1.5× their median time per row, 15–60 s (20 s
before they've pinned two). The worded nudge comes at twice that, never
under 30 s. Hint 2 and 3 for a row that's shown but not pinned point at the
case file ("pin “…” to “…”").

## Writing evidence

- Register it in the chapter's `evidence` list, and put its id on the thing that carries it (`evidence:` on a message, photo, note, mail, memo, payment, call, search, setting row or profile). Evidence named as proof and carried by nothing is the most common rewrite bug; the checker catches it.
- `within: true` if it's found by opening the item, not just the app. `manual: true` if it's found by doing something (zooming in). `heard: true` if it counts once played past its `reveals` caption.
- An event id and an evidence id are different namespaces. A route names evidence, never an event.

## Flags

Every flag is one of `ep:`, `saw:`, `did:`, `ask:`, `claim:`, `link:`, `hint:`, `fired:`.
A flag in `requires` / `after` / `unless` / `needs` / `any` must be set by
something: a `sets`, an event (`fired:<id>`), evidence (`saw:<id>`), a
question (`ask:<id>`, `claim:<q>:<c>`), or the game's code. Misspell one and
`tests/script.test.ts` says which, and where.

## Before you push a rewrite

1. `npx vitest run`, `npx tsc --noEmit`, `npx eslint .` all clean.
2. Read the trail: in a scratch test, `play({ ...policy, follow: true, trail })` and print `trail` (the follow bot pins only when the help tells it to). That's the walkthrough a stuck player gets, question by question. If a line reads badly, the data behind it is unclear.
3. Play it by touch on a phone viewport, sound off.
