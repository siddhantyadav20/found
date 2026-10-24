"""Writes edit.json: the trailer's cut, in seconds, read by trailer.html and sound.py.

    python3 marketing/trailer/edit.py

Raakh, v6. Pictures and a score, with a few small typed lines. No voices,
no faces, and nothing composited: every phone, hand, flame and clock is
really there. It never says the twist.

It's cut the way the references are cut. A slow, teal-dark open where one
practical light does all the work: a bulb dies, and on a table of letters a
phone that isn't yours lights up. Then a burst of close, tactile inserts of
the wedding (hands, matches, mehndi, flame) on the beat, faster and faster,
until one shot. After it, long held shots in the dark: someone searching
with a torch, the gravel, the jerrycan, the fire, a candle going out. Then
you putting it together, the clock, and three frames at once. Then the name.

A shot plays footage/<slot>.mp4 (cut by footage.py), or, if that clip is
missing, a stand-in scene from scenes.js. A typed card is one or two lines
typed out on the beat of the keys, small, in mono; a label is the same, at
the top, over the picture. Cues are sound. Shakes are the camera taking a
hit, flashes single white frames, whips a whip-pan across a cut, leaks a
light leak burning across one.
"""

import json
from pathlib import Path

shots, cards, labels, cues, flashes, shakes, whips, leaks = [], [], [], [], [], [], [], []

# Each slot's grade: exposure, warmth, saturation, smog haze, anamorphic streak, cool (teal in the shadows and mids).
LOOK = {
    "bulb": (1.0, .7, .9, 0, .4, 0), "phone": (.68, .2, .7, 0, .1, .85), "parcel": (.85, .4, .7, 0, 0, .5),
    "match": (1.0, .7, .95, 0, .3, 0), "mehndi": (.9, .7, .9, 0, 0, 0), "lamp": (.95, .7, .9, 0, .2, 0),
    "bangles": (.95, .65, .85, 0, 0, 0), "lighter": (1.3, .7, .9, 0, .4, 0), "sparkler": (.95, .7, .9, 0, .5, 0),
    "havan": (.95, .7, .9, 0, .2, 0), "diyas": (1.0, .75, .9, 0, .3, 0), "fireworks": (1.05, .55, .9, 0, .4, 0),
    "bokeh": (1.0, .7, .95, 0, .5, 0), "reel": (.85, .5, .8, 0, .5, .3),
    "torch": (1.2, .2, .8, 0, .5, .8), "gravel": (.95, .3, .7, 0, .1, .7), "jerrycan": (.85, .4, .75, 0, 0, .6),
    "fire": (.95, .6, .9, 0, .25, .6), "candle": (1.1, .6, .9, 0, .2, .7), "smoke": (1.0, .5, .8, 0, 0, .7),
    "board": (.9, .4, .75, 0, 0, .6), "back": (.85, .35, .7, 0, 0, .6), "alarm": (1.0, .3, .8, 0, .2, .7),
    "seconds": (.9, .3, .6, 0, 0, .6), "glass": (.85, .3, .75, 0, .3, .5), "note": (.9, .5, .8, 0, 0, .4),
    "poster": (.9, .4, .7, 0, 0, .5), "three": (.95, .4, .75, 0, .1, .55),
    "title_embers": (.22, .6, .9, 0, .2, .2),
}
DEFAULT = (.95, .55, .85, 0, .35, 0)
STAND_IN = {"bulb": "embers", "phone": "phone", "torch": "traffic", "fire": "fire", "candle": "embers", "title_embers": "embers",
            "sparkler": "embers", "fireworks": "fireworks", "bokeh": "bulbs"}


def shot(t0, t1, slot, seed=0.0):
    e, w, s, haze, streak, cool = LOOK.get(slot, DEFAULT)
    shots.append(dict(t0=round(t0, 3), t1=round(t1, 3), slot=slot, scene=STAND_IN.get(slot, "fire"), seed=seed,
                      exposure=e, warmth=w, sat=s, haze=haze, streak=streak, cool=cool))


def typed(t0, t1, lines, pos="mid", over=False, cps=.055):
    """Lines typed out one key at a time from t0, a beat between lines; returns each key's time, for the sound."""
    keys, t = [], t0 + .15
    for line in lines:
        for ch in line:
            keys.append(round(t, 3))
            t += cps if ch != " " else cps * 1.6
        t += .35
    cards.append(dict(t0=t0, t1=t1, lines=[[ln, "typed"] for ln in lines], style="typed", over=over, pos=pos, keys=keys))
    return keys


def label(t0, t1, text, cps=.04):
    keys = [round(t0 + .1 + k * cps, 3) for k in range(len(text))]
    labels.append(dict(t0=t0, t1=t1, text=text, keys=keys))
    return keys


# ============================================================ I. Lights out (free time)
cues += [dict(t=0, sfx="room", until=8.8)]
shot(.4, 2.6, "bulb")
cues += [dict(t=.4, sfx="hum", until=2.3), dict(t=2.3, sfx="click")]
# A beat of nothing. Then, on a table of letters, a phone lights up.
shot(3.0, 7.2, "phone")
cues += [dict(t=4.4, sfx="buzz"), dict(t=5.45, sfx="buzz"), dict(t=4.4, sfx="glow", until=8.8)]
cues += [dict(t=4.9, sfx="keys", times=typed(4.9, 7.15, ["This phone isn't yours."], pos="low", over=True))]
shot(7.2, 8.8, "parcel")
cues += [dict(t=7.2, sfx="paper")]

# ============================================================ II. The night (100 bpm from `night`)
night, beat = 8.8, .6
cues += [dict(t=night, sfx="wedding", beat=beat, double=night + 11 * beat, until=night + 16 * beat)]
shot(night, night + 2 * beat, "match")
cues += [dict(t=night + .35, sfx="strike")]
cues += [dict(t=night + .2, sfx="keys", times=label(night + .2, night + 2.4, "SATURDAY, 22 NOVEMBER"), soft=True)]
t = night + 2 * beat
for k, slot in enumerate(["mehndi", "lamp", "bangles", "lighter", "sparkler", "havan", "diyas", "fireworks", "bokeh"]):
    shot(t, t + beat, slot)
    if slot in ("sparkler", "fireworks"):
        leaks.append(dict(t=round(t, 3), d=.5, k=.8))
    elif k % 3 == 1:
        whips.append(dict(t=round(t, 3), dir=1 if k % 2 else -1))
    t += beat
# Double time: the same night, faster.
for k, slot in enumerate(["mehndi", "sparkler", "havan", "fireworks", "match", "lamp", "bangles", "diyas", "lighter", "bokeh"]):
    shot(t, t + beat / 2, slot, seed=1.0)
    t += beat / 2
# The back lawn, out of focus, a light held up; the band stops. One shot.
reel = t
gun = reel + 2 * beat
shot(reel, gun, "reel")
cues += [dict(t=round(reel, 3), sfx="stop", until=gun), dict(t=gun, sfx="gunshot")]
flashes.append(dict(t=gun, d=.067, k=1.0))
shakes.append(dict(t=gun, amp=1.0, decay=5.0))

# ============================================================ III. After (slow; long holds in the dark)
a0 = gun + 1.2
cues += [dict(t=a0, sfx="after", until=33.0)]
shot(a0, a0 + 2.4, "torch")
cues += [dict(t=a0, sfx="sweep")]
shot(a0 + 2.4, a0 + 4.4, "gravel")
cues += [dict(t=a0 + 2.4, sfx="steps", until=a0 + 4.4)]
shot(a0 + 4.4, a0 + 6.2, "jerrycan")
cues += [dict(t=a0 + 4.7, sfx="slosh")]
shot(a0 + 6.2, a0 + 8.6, "fire")
cues += [dict(t=a0 + 6.2, sfx="fire", until=a0 + 8.6)]
shot(a0 + 8.6, a0 + 10.4, "candle")
cues += [dict(t=a0 + 8.6 + 1.6, sfx="puff")]
shot(a0 + 10.4, 33.0, "smoke")
turn = 33.0
cues += [dict(t=turn, sfx="turn"), dict(t=turn + .2, sfx="keys", times=typed(turn + .2, 35.5, ["Somebody edited", "the night."]))]

# ============================================================ IV. You, putting it together (120 bpm from 35.6)
p0, b4 = 35.6, .5
cues += [dict(t=p0, sfx="clockwork", beat=b4, until=45.0)]
for t0, t1, slot in ((p0, 37.2, "board"), (37.2, 38.6, "back"), (38.6, 39.6, "alarm"), (39.6, 40.4, "seconds"),
                     (40.4, 40.6, "glass"), (40.6, 40.8, "note"), (40.8, 41.0, "poster")):
    shot(t0, t1, slot)
    cues.append(dict(t=t0, sfx="cut"))
# Three at once: the clock, his phone, the poster.
shot(41.0, 45.0, "three")
cues += [dict(t=41.0, sfx="three", until=45.0)]
cues += [dict(t=45.2, sfx="keys", times=typed(45.2, 47.8, ["Before seven,", "you'll have to choose."]))]

# ============================================================ V. The name
title = 48.0
shot(title, 54.0, "title_embers", seed=3.0)
cards.append(dict(t0=title, t1=54.0, lines=[], style="title"))
cues += [dict(t=title, sfx="title"), dict(t=53.8, sfx="last_tick"), dict(t=54.15, sfx="end_buzz")]
shakes.append(dict(t=title, amp=.6, decay=2.5))

edit = dict(fps=30, duration=54.8, shots=shots, cards=cards, labels=labels, subs=[], type=[], cues=cues,
            flashes=flashes, shakes=shakes, whips=whips, leaks=leaks, bars=[[0, 0]], silence=[])
Path(__file__).with_name("edit.json").write_text(json.dumps(edit, indent=1, ensure_ascii=False) + "\n")
print(f"{len(shots)} shots, {edit['duration']} s")
