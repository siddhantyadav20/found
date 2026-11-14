# Raakh — Motion audit: what would make it feel real

14 Nov 2026 · Read against build 0e9bcdf, the whole chapter walked in the browser pane at phone width, and every `.module.css` in `components/`.

**Status.** #1, the stage curtain, is built (`components/stage/Curtain.tsx`, `app/curtain.css`; every scene in `Stage.tsx` goes through it) with the plugged-in moment in `Charge.tsx`. The rest is not.

## 1. Where it stands

The product already has a motion system and it is good. One design-system block in `app/globals.css` (six curves, four lengths, 2026-11-05), 114 keyframes and 121 transitions across the stage and the phone, and 35 stylesheets that honour reduced motion. The phone's own gestures are the strongest part: an app zooms out of the icon it was tapped from and back into it, swipe-back follows the finger, the home bar pulls an app down to a card, Notification Centre comes down with the hand, a banner drops with the buzz and flicks away, icons sink under the thumb, glass swells when pressed. Inside the apps: bubbles arrive, typing dots, a wrong password shakes, a stamp lands on the case file, a photo can be pinched.

What it does not have is **motion between things**. Every full-screen scene brings its own entrance and nobody owns the exit, so the chapter is a sequence of well-animated cards joined by hard cuts. In the browser pass the cuts I watched were:

| From | To | What happens now |
|---|---|---|
| The note on the table ("Turn the phone over") | The lock screen | Instant swap from a photograph of a room to a full-bleed iOS lock screen |
| The lock screen, half lifted | Raju's call | The call replaces everything, with its own gradient behind it |
| The end of the call | The lock screen again | Instant |
| Any app | A dark screen (PG-DARK) | The phone vanishes; a black card fades from dark brown to black on its own |
| The charger ("Plug it in") | The Episode 2 title card | Instant |
| The Low Battery alert's OK | The phone dying | The real screen is replaced by a generic blue-grey gradient that then flickers |

A phone in a hand never cuts. It wakes, it is lifted, it dims, it dies. The single biggest step up is to make the seams physical, and that is one mechanism (section 3.1), not twenty.

The second gap is **the thing the player does most**: answering. A reply option is tapped, the options disappear, and 250 ms later a bubble fades in. On a real phone the words you chose *travel* into the conversation, and the ticks under them turn one by one. That motion is the sentence "I said that", and the whole reveal depends on the player feeling they said these things.

The third is **sound you can see**. The chapter is carried by voices (voice notes, calls, memos, the dark screens), and every waveform is a row of bars that switch on in blocks against a timer. None of them moves with the voice.

Everything below is specific about where, what, and how, and keeps to the house rules: only the six curves and four lengths, transform/opacity/filter only, no shake on a gunshot (RAAKH-V3 §16), restraint on the three dark screens, and every item cut to a fade under reduced motion.

## 2. The ten that matter most

In order of effect on "this feels real" against cost.

| # | Where | What to add | Cost |
|---|---|---|---|
| 1 | Every seam between scenes (`Stage.tsx`) | A curtain: the old scene leaves and the new arrives through one shared layer, with four named exits (wake, slide-over, dim, through-black) | 2–3 days |
| 2 | Replies in WhatsApp, Messages and on calls | The tapped option lifts into the thread and becomes the bubble; its ticks go grey → double → blue over the next seconds | 1 day |
| 3 | Swipe-back and pushed screens in every app | The screen underneath slides and un-dims with the one on top (iOS's parallax) | half a day |
| 4 | Phone death, the charger, and the desktop frame | The *real* screen flickers and dies; the charging bolt when the cable goes in; the screen's light on the table goes out and comes back | 1 day |
| 5 | Every waveform (chat voice notes, Voice Memos, DarkVoice, the reveal's voice note, calls) | One `Waveform` driven by the real audio's amplitude; a continuous playhead instead of blocks | 1 day |
| 6 | Photos | Thumbnail expands into the viewer and shrinks back; pinch gets rubber-band and spring-back; Recover animates | 1 day |
| 7 | The parcel and the envelope | The strip resists and buzzes as it tears; the envelope tilts in the hand before it turns | half a day |
| 8 | A ringing phone | The device itself shivers in time with the ring (desktop frame, and the second phone) | 2 hours |
| 9 | Idle and battery | The screen dims after a minute untouched and wakes on touch; the battery cell's fill animates, and reddens with a flash | half a day |
| 10 | Small OS fidelity set | Row highlight fade-out, alert dismiss, Control Centre scale-in, Notification Centre stagger, banner height on hold, badge re-pop on a new count, airplane morph | 1 day |

## 3. In detail, in the order the player meets them

### 3.1 The seams (Stage)

`Stage.tsx` returns a different component per `scene.kind` and React unmounts the old one on the same frame. Give the stage one transition layer and four exits.

**Mechanism.** React 19.2's `<ViewTransition>` is already in the project (the site's `found-phone` morph in `app/globals.css`; `react-canary.d.ts` carries the types). Wrap the `switch` output in `<ViewTransition name="stage" enter={kind} exit={prevKind}>` keyed on `scene.kind`, and style the pseudo-elements per kind. Where a browser has no view transitions (older Android WebView), fall back to the through-black fade. Timings from the tokens: `--t-short` for a cut through black, `--t-mid` for anything that moves a whole surface, `--ease-in-out` for surfaces, `--ease-in` for leaving, `--ease-out` for arriving.

| Seam | Exit / entrance | Notes |
|---|---|---|
| **Note → lock screen** (the phone turned over) | *Wake.* The still dims to 40%; the lock screen mounts scaled to about 0.55 at the phone's place in the photograph, black, and over 700 ms (`--ease-in-out`) scales to fill while its wallpaper brightens from 0 → 1 in the first 250 ms and the clock settles from `scale 1.04`. The buzz lands as it fills. | The lock screen's existing `stack` stagger on the notifications then reads as the phone catching up on what arrived. On a phone-sized screen the "phone's place" is the centre of the still; on desktop it is the device frame's rest position, so the device frame itself should be what scales up. |
| **Lock → home** | Keep what is there (the `.slide` lift, the `settle`). Add the unlock tick (`keyTap()` is close; a single softer tick) and let the notifications *collapse* into the clock rather than fade: `translate` toward the clock's centre with `--ease-in`. | Small. |
| **Anything → a call** | *Slide over.* The call screen slides down from the top over 400 ms `--ease-out` while the table stays mounted beneath it, dimmed to 55% and blurred 8 px. Ending the call reverses it: the call lifts away and the table un-dims. | This is what fixes both cuts around Raju. Today `Ringing` paints its own gradient and blurs the wallpaper; keep that look, but as a layer over the phone, not instead of it. On the lock screen iOS keeps the wallpaper; on an unlocked phone iOS 26 shows a compact call banner first. Full screen is right for this game, but it must arrive. |
| **Anything → a dark screen** (PG-DARK, three times) | *Dim.* The spec says "the phone UI dims to black over 1.2 s". Make it true: keep the table mounted, run `filter: brightness(1 → 0) blur(0 → 2px)` on `.surface` over 1.2 s `--ease-in`, and only then let `.black` hold. Coming back (`backToChat`), brightness 0 → 1 over 600 ms. | `.black`'s own `dim` keyframe (brown → black) becomes redundant; drop it so the black is black. No music, nothing else moving, exactly as the grammar demands. |
| **Charger → title card** | The cable in: the iOS plugged-in moment. The screen goes black, the big battery with its bolt fades in on black (`pop`, `--ease-spring-soft`), the fill rises green from the real level over 900 ms, the charging chime (a new two-note cue in `tones.ts`, quiet), hold 1.2 s, then through-black into the title card. | Everyone who has owned a phone knows this animation. It also *means* the thing the episode gate is about. |
| **Title cards, reels, Found so far, Previously** | *Through black.* 300 ms out, 300 ms in, `--ease-in-out`. | Television cuts are fine between shots inside a reel; between the full screens a breath of black is enough. |
| **Reveal step 3 → 4** (Meera's call → the camera) | The camera opens as an app does: zoom out of the "Open the camera" button with the existing `zoomOver` math. | Same function, a different origin. |
| **Reveal, any step → the next** | Through black, 400 ms. The montage's own `rise`s stay. | |
| **Ending → end card** | Through black, slower: `--t-long`. | |

### 3.2 The table (PG-TABLE)

**The parcel.** The strip follows the pointer, but with `transition: translate var(--t-quick)` left on while dragging, so it lags the hand. Set the transition to none while the pointer is down (as `Phone.tsx` does for every gesture), and restore it for the fly-off. Then give it resistance: `translate` by `pull^0.8` so the last third is harder, and let the phone inside answer the hand: `buzz()` at 0.3 and 0.55 of the pull, and `navigator.vibrate([8, 30, 8])` ramping with it where it exists. On the tear, the still's crossfade is right; add a 1% settle on `.parcel` (`scale 1.01 → 1`, `--ease-spring-soft`) as the box relaxes.

**The envelope.** The 3D flip is good. Before the flip it should be in a hand: on pointer move or hover, `rotateY ±8°` and `rotateX ±4°` toward the pointer on `.card`, with `transition: transform var(--t-short) var(--ease-out)`, and the drop shadow's offset moving the opposite way. On a phone, drive it from `deviceorientation` (±6°) where permission already exists, otherwise from the touch. The foil title could catch the lamp (a `linear-gradient` sheen whose position follows the tilt), but keep it to the tilt and the shadow first.

**The charger.** Two frames of the hand still nudging (`translate 0 2px → 0`, 120 ms) when "Plug it in" is pressed, under the chime from 3.1. Cheap, and the hand has done something.

**The desktop frame.** `.device` has a fixed shadow and a faint orange glow. Make the glow the screen's light: a `radial-gradient` under the device whose opacity and warmth follow a `data-light` attribute the Table sets per screen (lock: dim; home: medium; Photos viewer and Safari: bright; an alert: a flash), transitioning over `--t-mid`. It goes out at the death (3.4) and comes back on the charger. On a dark table this one gradient is most of "there is a lit phone in front of me."

### 3.3 The phone's OS

**Swipe-back and push parallax (#3).** iOS never moves one screen alone. When a screen is pushed (`.view[data-push]`), the parent should slide to `translate: -30% 0` and dim under a 20% scrim over the same 420 ms; when swiped back, the parent follows the finger from -30% toward 0 and un-dims as `dx` grows. The parent is still in the DOM under the child (the push "slides in over the app"), so this is a sibling rule plus two lines in `swipeBack`. Players do this a hundred times a night.

**Replies (#2).** In `Conversation` (Chat.tsx) and `Ringing`, when an option is tapped: FLIP it. Measure the option button's rect, render the new owner bubble at once, measure its rect, set the bubble's `translate`/`scale` to the option's box, and release over 350 ms `--ease-out` while the options row drops away (`translate 0 24px`, opacity 0, `--ease-in`, 200 ms). Then the ticks: a just-sent message starts on one grey tick, goes to two at +900 ms and, for anyone whose read state the story says is "read", to blue between +2 and +4 s (jittered). M's four voice notes stay on one grey tick for ever, which is the clue, so the progression must be driven by `m.ticks`, never by time alone. The `sent()` swoop already plays; it now has something to go with.

**Typing.** The dots exist; the header's "typing…" should crossfade with the sub-line (200 ms) rather than swap, and "online" should appear for two seconds after their message lands before falling back to the last-seen text. That is how WhatsApp tells you somebody is *there*.

**Waveforms (#5).** One component, `components/owner/ios/Waveform.tsx`, replacing the four hand-rolled bar rows (Chat's `Voice`, VoiceMemos' `Player`, `DarkVoice`, the reveal's `VoiceNote`). Playhead: a `--p` custom property transitioned linearly over the clip's length, with the lit part a mask, instead of bars switching in blocks every 120 ms. Life: `lib/found/voice.ts` owns the one audio element; give it an `AnalyserNode` and a `useAmplitude()` hook that writes `--amp` (0–1) to the waveform's container at animation-frame rate. Bars near the playhead scale `1 + 0.35 * amp` in `scaleY`. No new audio, just the audio already playing, seen. On the dark screens this is the only thing moving, which is exactly right.

**Calls.** Lines in `.lines` pop in with no motion; give them the thread's `arrive`. Replace the three "Listening…" dots with a small live meter from `useAmplitude()`. And the caller's name jumps from high on the screen to the top the moment the call is answered because `justify-content` changes: move it with `translate` instead (`--t-short`, `--ease-in-out`).

**Photos (#6).** Opening a photo should expand the thumbnail into the viewer (the `zoomOver` math from an element rect, as apps do) and closing should shrink it back; today the viewer scales from 0.94 in place. Pull-down to dismiss should shrink the image with the finger and fade the black (the drag helper is there; make the image follow). Pinch: clamp with a rubber band (`scale` past the limits at a third of the rate) and spring back on release (`--ease-spring-soft`); double-tap should zoom to the tapped point, not the centre. In Recently Deleted, Recover should collapse the row (`grid-template-rows: 1fr → 0fr`, 300 ms) rather than vanish.

**Notes.** The shake is right. On a correct password, raise the padlock's shackle (a 150 ms `translate` on the top path) and reveal the note from a blur (`filter: blur(6px) → 0` with opacity, 400 ms `--ease-out`).

**Lists.** `.row:active` goes grey and snaps back. iOS holds the grey and fades it out after the finger lifts. One global rule: `transition: background-color 0s` on press, `0.3s` on release (`button.row { transition: background-color var(--t-short) } button.row:active { transition: none }`).

**Alerts.** They pop in and unmount instantly. Add a 150 ms dismiss (`scale 0.96`, opacity 0) by holding the alert mounted until `animationend`.

**Control Centre.** Opacity only. Add `scale 0.92 → 1` on `.ccGrid` (`--t-short`, `--ease-out`) and a 20 ms stagger per module. The airplane toggle should spring (`--ease-spring`), and in the status bar the signal and Wi-Fi should crossfade into the plane (200 ms) rather than swap.

**Notification Centre.** Already follows the hand. Stagger the notices as the lock screen does (`stack`), and let the shade rubber-band a little past open.

**Banners.** When held open, the body jumps to its full height; transition it (`grid-template-rows 0fr → 1fr`, or `interpolate-size: allow-keywords` where supported, 300 ms). When a badge's number changes (47 → 48 missed calls), key the badge on its count so `pop` runs again.

**Battery and status bar (#9).** The fill width changes by text; `transition: width var(--t-mid)` on `.fill`, and when it crosses into red, two frames of brighter red (`steps(1)`), as iOS does. On the charger, the bolt should appear and the fill climb from the real level. The number itself does not animate on iOS; leave it.

**Idle dim (#9).** After 60 s without a pointer or key, `.screen` dims to 50% over 500 ms (`--ease-in-out`); any input brings it back in 200 ms. Do not lock. Episode 1 is about a phone running out, and a screen that dims when you stop touching it is the body language of that. Suspend it during media, calls and the case file.

**Home screen alive.** Between beats the phone is still. The lock-screen and home wallpaper should drift with the device: `deviceorientation` on a phone (±6 px), the pointer on desktop, over `--t-long`. The icons stay put (iOS's depth effect moves the wallpaper only). Barely visible, and the phone stops being a picture.

### 3.4 The battery dying (PG-DEATH)

`PhoneDeath` puts a generic radial gradient on screen and flickers *that*. The table is rendered beneath it in `review` mode, so flicker the real thing: run the `flicker` keyframe on `.surface`'s brightness with one frame of cold green tint (`hue-rotate(60deg) saturate(2)`, 40 ms), two frames of the screen's last image, then black; then the eight-frame silhouette in the glass as now; then a true hold, 1.4 s of nothing, before the Charge scene fades up from black over `--t-long`, lamp first (the still at 0 → 1 with `brightness(0.6 → 1)`). On desktop the glow under the device goes out with the screen (3.2) and that darkness is the beat. The vibrate stays.

### 3.5 The reveal and the endings

The reveal is already the best-directed stretch (the case file's `turn`, the stamp, the camera's breath and tremor, the split frame). Three additions:

- **The shutter.** When the shutter is pressed: the viewfinder goes black for 80 ms (the iris), then the existing flash, then the still shrinks into the thumbnail at the bottom left with the `zoomOver` math (350 ms, `--ease-in`). The photo has been *taken*.
- **The montage's message ticks.** Each of the player's lines arrives "with a soft message tick" (PG-MONTAGE). `sent()` plays; let the line also arrive as a sent bubble does (`arrive` + the ticks turning, from 3.3), so the player recognises their own messages before they read them.
- **The second phone's ring.** When `YourPhoneOverlay` rings, the phone frame should shiver in time with `ringtone()`'s vibrate pattern ([400, 200, 400]): `translate ±1px` in 50 ms steps for 400 ms, pause 200, again. The same `shiver` on the desktop `.device` when his phone rings on the table. The parcel's `shiver` keyframe is the start of it.

**The endings on a lock screen.** Notices drop in with the buzz, which is right. When a line moves the clock (4:40 → 6:05), roll the digits (each digit a stacked column translated by its value, 600 ms `--ease-in-out`) instead of swapping the text; a lock screen whose clock jumps silently reads as an edit, a clock that rolls reads as time passing. Let the wallpaper `drift` as the media stills do.

## 4. Mechanisms to build once

| Piece | Where | Used by |
|---|---|---|
| The stage curtain (`<ViewTransition>` per `scene.kind`, four exits, through-black fallback) | `components/stage/Stage.tsx`, `Stage.module.css` | Every seam in 3.1 |
| `flip(from: DOMRect, el: HTMLElement, ms, ease)` | `components/stage/flip.ts` | Reply → bubble, thumbnail → viewer, shutter → thumb, Recover |
| `useAmplitude()` on the one voice element | `lib/found/voice.ts` | `Waveform`, the call meter |
| `Waveform` | `components/owner/ios/Waveform.tsx` | Chat voice notes, Voice Memos, DarkVoice, the reveal's voice note |
| `data-light` on `.surface`, the glow under `.device` | `components/stage/Table.tsx`, `Screen.module.css` | Desktop table, the death, the charger |
| `useIdleDim()` | `components/owner/Phone.tsx` | The idle dim |
| `shiver` as a shared keyframe with a vibrate-pattern timing | `app/ios.css` | Ringing device, your phone, the parcel |

## 5. Rules for all of it

- **Only the tokens.** Six curves, four lengths. A number that isn't one of them is choreography (a flicker, a roll), and it is written as a keyframe with a comment saying why.
- **Transform, opacity, filter.** Nothing animates layout. Height changes go through `grid-template-rows` or a measured FLIP.
- **Blur is expensive on the phones this is for.** Animate the opacity of a layer that is already blurred, never `backdrop-filter`'s radius. The stage curtain's dim uses `filter: brightness()` on the surface and a fixed 2 px blur, not a blur ramp.
- **Reduced motion.** Every item here degrades to a fade of `--t-short` or to nothing, under the existing global clamp. The strip's resistance and the envelope tilt turn off; the shiver turns off and the sound carries it.
- **Fair play and the grammar.** The three dark screens get the dim and the waveform and nothing else. No shake on a gunshot. The clock never animates to a time earlier than a delivered message.
- **Nothing waits on motion.** Every transition is interruptible by the next tap, as the app close and swipe-back already are. Autosave happens on the state change, never at the end of an animation.

## 6. What I looked at

- `app/globals.css` (motion tokens, the view-transition morph), `app/ios.css` (glass, press).
- The phone: `components/owner/Phone.tsx`, `Home.tsx`, `LockScreen.tsx`, `AppView.tsx`, every `ios/*.module.css`, `apps/Chat.tsx`, `Photos.tsx`, `VoiceMemos.tsx`, `Notes.tsx`, `Camera.tsx`, `ios/Clip.tsx`, `ios/Alert.tsx`, `ios/StatusBar.tsx`.
- The stage: `Stage.tsx`, `Table.tsx`, `Parcel`, `Note`, `Charge`, `Ringing`, `ColdOpen`, `TitleCard`, `Moment`, `CaseFile.module.css`, `drag.ts`, and the v3 screens (`DarkScreen`, `PhoneDeath`, `RevealDirector`, `Reel`, `LockscreenEnding`, `YourPhone`, `BeforeEnding`, `FoundSoFar`, `UnopenedScene`, `EndCardV3`).
- Sound: `lib/found/buzz.ts`, `tones.ts`, `nightSound.ts`, `voice.ts`.
- RAAKH-V3 §6 (presentation grammar), §16 (media direction), §17 (phone UI rules); PLAYER-JOURNEY's laws.
- In the browser at 375 × 812: the content note, the cold open, the parcel, the envelope, the lock screen, Raju's call, the home screen, WhatsApp (list and Mummy's chat), Photos (the 12:29 photo), the case file, Notification Centre, the Low Battery alert.
