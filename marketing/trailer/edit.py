"""Writes edit.json: the trailer's cut, in seconds, read by trailer.html and sound.py.

    python3 marketing/trailer/edit.py

Raakh, v5: pictures, a score, and only as many words as it needs. No voices:
the story is the player's to hear in the game. It never says the twist.

The idea is a phone that isn't yours, and going into it. Out here it's a
vertical phone shot in a dark room; the hand opens a photo, the camera
pushes into the screen, and inside is the night itself, framed like cinema
(the bars come in). The wedding is hands, lights and fire, never a face;
then one shot, and what was done after; then the clock to seven.

A shot plays footage/<slot>.mp4 (cut by footage.py from Pexels footage, the
game's own pictures and clips, and the props in inserts.html), or, if that
clip is missing, a stand-in scene from scenes.js. Cards are words, on black
or over the picture; labels are small mono place-and-time lines; type is a
stamp or a typed line. Cues are sound. Shakes are the camera taking a hit,
flashes single white frames, whips a whip-pan across a cut, leaks a light
leak burning across one. Bars are the letterbox, in pixels, keyframed.
"""

import json
from pathlib import Path

shots, cards, labels, type_, cues, flashes, shakes, whips, leaks = [], [], [], [], [], [], [], [], []

# Each slot's grade: exposure, warmth, saturation, smog haze, anamorphic streak.
LOOK = {
    "phone_dark": (1.1, .2, .85, 0, .2), "parcel": (1.0, .7, .85, 0, 0), "enter": (1.0, .45, .85, 0, .15),
    "bokeh": (1.0, .7, .95, 0, .5), "lamp": (.95, .7, .9, 0, .2), "blur": (.95, .6, .9, 0, .5), "mehndi": (.9, .7, .85, 0, 0), "diyas": (1.0, .75, .9, 0, .3),
    "bangles": (.95, .65, .85, 0, 0), "sparkler": (.95, .7, .9, 0, .5), "havan": (.95, .7, .9, 0, .2),
    "fireworks": (1.05, .55, .9, 0, .4), "reel": (.85, .5, .8, 0, .5),
    "lawn": (.75, .25, .55, .1, .15), "gravel": (.9, .3, .7, 0, .1), "jerrycan": (.85, .45, .75, 0, 0),
    "fire": (.95, .6, .9, 0, .25), "ash": (.7, .55, .5, 0, 0), "clock": (.85, .45, .7, .1, .35),
    "m_glass": (.85, .3, .75, 0, .3), "m_car": (1.1, .3, .8, 0, .4), "m_aerial": (1.3, .4, .8, 0, .4), "m_note": (.95, .6, .8, 0, 0),
    "m_coals": (.9, .6, .9, 0, .2), "m_smoke": (.8, .2, .3, 0, 0), "m_fog": (.55, .3, .45, .2, 0), "m_pyre": (.95, .55, .85, 0, .2),
    "m_incense": (1.0, .4, .8, 0, 0), "m_embers": (.95, .6, .9, 0, .2), "m_traffic": (1.0, .4, .8, 0, .4),
    "m_rain": (.9, .4, .8, 0, .3),
    "title_embers": (.22, .6, .9, 0, .2),
}
DEFAULT = (.95, .55, .85, 0, .35)
# Which drawn scene stands in if a slot's footage is missing.
STAND_IN = {"phone_dark": "phone", "enter": "phone", "bokeh": "bulbs", "lawn": "dawn", "clock": "traffic", "m_glass": "rain",
            "m_rain": "rain", "m_traffic": "traffic", "m_car": "traffic", "title_embers": "embers", "m_embers": "embers",
            "fire": "fire", "m_pyre": "fire", "sparkler": "embers", "fireworks": "fireworks", "ash": "embers"}


def shot(t0, t1, slot, seed=0.0):
    e, w, s, haze, streak = LOOK.get(slot, DEFAULT)
    shots.append(dict(t0=round(t0, 3), t1=round(t1, 3), slot=slot, scene=STAND_IN.get(slot, "fire"), seed=seed,
                      exposure=e, warmth=w, sat=s, haze=haze, streak=streak))


def card(t0, t1, lines, style="card", over=False, pos="low"):
    """lines: [(text, kind)], kind 'main' (serif) or 'small' (grey) or 'ember'."""
    cards.append(dict(t0=t0, t1=t1, lines=lines, style=style, over=over, pos=pos))


def label(t0, t1, text):
    labels.append(dict(t0=t0, t1=t1, text=text))


# ============================================================ I. The phone (free time)
# A buzz in the dark; his phone on a table, waking. It came back to you in a parcel.
cues += [dict(t=.15, sfx="buzz"), dict(t=0, sfx="room", until=10.0)]
shot(.6, 3.6, "phone_dark")
card(1.0, 3.5, [("This phone isn't yours.", "main")], over=True, pos="mid")
cues += [dict(t=1.0, sfx="hook"), dict(t=1.65, sfx="buzz")]
shot(3.6, 5.2, "parcel")
cues += [dict(t=3.6, sfx="paper")]
# Your hand. The lock screen; a swipe; a photo from that night. Then in, through the glass.
enter = 10.0
shot(5.2, enter, "enter")
cues += [dict(t=5.2, sfx="motif"), dict(t=6.8, sfx="swipe"), dict(t=7.8, sfx="push", until=enter)]

# ============================================================ II. The night (100 bpm, from the downbeat at `enter`)
beat = .6
bar = 4 * beat
gun = enter + 6 * bar  # where the seventh bar would have landed: 24.4
cues += [dict(t=enter, sfx="entry"), dict(t=enter, sfx="wedding", until=gun, beat=beat)]
flashes.append(dict(t=enter, d=.034, k=.55))
leaks.append(dict(t=enter, d=.7, k=1.0))
shot(enter, enter + bar, "bokeh")
label(enter + .5, enter + 2.3, "SATURDAY 22 NOVEMBER · DELHI")
night = [("lamp", None), ("mehndi", "whip"), ("bangles", None), ("diyas", "whip"), ("sparkler", "leak"), ("havan", "whip"),
         ("fireworks", None), ("blur", "leak")]
t = enter + bar
for slot, tr in night:
    shot(t, t + 2 * beat, slot)
    if tr == "whip":
        whips.append(dict(t=round(t, 3), dir=1 if len(whips) % 2 == 0 else -1))
    elif tr == "leak":
        leaks.append(dict(t=round(t, 3), d=.6, k=.8))
    t += 2 * beat
# The back lawn, the light held up for the reel; the band stops a beat in. Then one shot.
shot(t, gun, "reel")
cues += [dict(t=round(t + beat, 3), sfx="stop", until=gun)]
cues += [dict(t=gun, sfx="gunshot")]
flashes.append(dict(t=gun, d=.067, k=1.0))
shakes.append(dict(t=gun, amp=1.0, decay=5.0))
after = gun + 1.2
shot(after, after + 2.0, "lawn")
cues += [dict(t=after, sfx="wind", until=after + 2.0)]

# ============================================================ III. After (120 bpm, from `dark`)
dark = after + 2.0  # 27.6
b3 = .5
cues += [dict(t=dark, sfx="ostinato", until=None, beat=b3)]
shot(dark, dark + 4 * b3, "gravel")
cues += [dict(t=dark, sfx="steps", until=dark + 4 * b3)]
shot(dark + 4 * b3, dark + 8 * b3, "jerrycan")
cues += [dict(t=dark + 4 * b3 + .3, sfx="slosh")]
shot(dark + 8 * b3, dark + 12 * b3, "fire")
cues += [dict(t=dark + 8 * b3, sfx="fire", until=dark + 16 * b3)]
shot(dark + 12 * b3, dark + 16 * b3, "ash")
turn = dark + 16 * b3  # 35.6
card(turn, turn + 2.4, [("Somebody edited", "main"), ("the night.", "ember")])
cues += [dict(t=turn, sfx="braam")]
shakes.append(dict(t=turn, amp=.5, decay=3.0))

# The montage: cuts on the beat, then the half beat, then faster, as it all comes apart.
m0 = turn + 2.4  # 38.0
m1 = 45.0
pool = [("m_glass", "11:52 PM"), ("m_car", None), ("m_aerial", None), ("m_note", None), ("m_pyre", "12:32 AM"), ("m_smoke", None),
        ("m_rain", None), ("m_coals", "1:52 AM"), ("m_incense", None), ("m_fog", "4:47 AM"), ("m_traffic", None), ("m_embers", None),
        ("parcel", None), ("m_glass", None), ("m_pyre", None), ("m_car", None), ("m_coals", None), ("m_smoke", None)]
t, d, i = m0, 2 * b3, 0
while t < m1 - .05:
    d1 = min(d, m1 - t)
    if m1 - (t + d1) < .1:
        d1 = m1 - t
    slot, text = pool[i % len(pool)]
    shot(t, t + d1, slot, seed=round(.37 * i, 2))
    if text:
        type_.append(dict(t0=round(t, 3), t1=round(t + d1, 3), text=text))
    if i % 3 == 2:
        whips.append(dict(t=round(t, 3), dir=1 if i % 2 else -1))
    if i > 8 and i % 2 == 0:
        flashes.append(dict(t=round(t, 3), d=.034, k=.6))
    cues.append(dict(t=round(t, 3), sfx="cut", n=i))
    t += d1
    d = b3 if t < m0 + 3 else max(.125, d * .8)
    i += 1
cues[[c["sfx"] for c in cues].index("ostinato")]["until"] = m1
cues += [dict(t=m0, sfx="rise", until=m1)]
# The list he left for M, stopping where he stopped. Then nothing.
hold = .9
shot(m1, m1 + hold, "phone_dark", seed=1.0)
type_.append(dict(t0=m1, t1=m1 + hold, text="4. Nitin —", kind="typed"))
cues += [dict(t=m1, sfx="typing", n=10)]
silence = [[m1 + hold, 47.0]]

# ============================================================ IV. Seven
card(47.0, 49.4, [("M? Tu hai?", "main"), ("M? Is that you?", "small")], "message")
cues += [dict(t=47.1, sfx="dots"), dict(t=47.8, sfx="ping")]
shot(49.4, 53.6, "clock")
card(49.9, 53.5, [("Before seven,", "main"), ("you'll have to choose.", "ember")], over=True)
cues += [dict(t=49.4, sfx="clock", until=53.6)]
title = 53.6
shot(title, 59.4, "title_embers", seed=3.0)
card(title, 59.4, [], "title")
cues += [dict(t=title, sfx="title"), dict(t=59.2, sfx="last_tick"), dict(t=59.55, sfx="end_buzz")]
shakes.append(dict(t=title, amp=.7, decay=2.5))

# The letterbox: none out here; it closes in as we go through the glass, and stays.
bars = [[0, 0], [enter - .15, 0], [enter + .5, 200], [99, 200]]

edit = dict(fps=30, duration=60.4, shots=shots, cards=cards, labels=labels, subs=[], type=type_, cues=cues,
            flashes=flashes, shakes=shakes, whips=whips, leaks=leaks, bars=bars, silence=silence)
Path(__file__).with_name("edit.json").write_text(json.dumps(edit, indent=1, ensure_ascii=False) + "\n")
print(f"{len(shots)} shots, {edit['duration']} s")
