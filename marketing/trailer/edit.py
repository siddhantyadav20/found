"""Writes edit.json: the trailer's cut, in seconds, read by trailer.html and sound.py.

    python3 marketing/trailer/edit.py

A shot plays one of the scenes in scenes.js (or footage/<slot>.mp4, if that
exists). Cards are words: on black, or over the picture. Cues are sound.
"""

import json
from pathlib import Path

shots, cards, type_, cues, flashes = [], [], [], [], []

# How each scene sits in the grade: exposure, warmth, saturation.
LOOK = {
    "phone": (1.3, .2, .7), "gate": (1.3, .7, .8), "bulbs": (1.15, .8, .9), "fireworks": (1.15, .7, .9),
    "dawn": (1.1, 0., .4), "door": (1.25, .6, .8), "screen": (1.2, .4, .8), "rain": (1.25, .3, .9),
    "fire": (1.0, .6, .95), "traffic": (1.2, .5, .85), "embers": (1.1, .6, .9),
}


def shot(t0, t1, scene, slot, seed=0.0):
    e, w, s = LOOK[scene]
    shots.append(dict(t0=round(t0, 3), t1=round(t1, 3), scene=scene, slot=slot, seed=seed, exposure=e, warmth=w, sat=s))


def card(t0, t1, lines, style="line", over=False):
    cards.append(dict(t0=t0, t1=t1, lines=lines, style=style, over=over))


# Cold open: a phone face-down in the dark, buzzing. A watch starts.
shot(0.0, 3.2, "phone", "phone_dark")
cues += [dict(t=0.0, sfx="tick_start"), dict(t=.0, sfx="piano", note=0)]
cues += [dict(t=x, sfx="buzz") for x in (.6, 1.6, 2.6)]

# Delhi, in smog.
shot(3.2, 6.2, "gate", "delhi_fog")
card(3.6, 6.0, ["22 NOVEMBER", "NEW DELHI"], "place", over=True)
cues += [dict(t=3.2, sfx="city", until=6.2), dict(t=4.0, sfx="piano", note=0)]

# The wedding, heard through a wall, then in the room.
shot(6.2, 8.2, "bulbs", "wedding_lights")
shot(8.2, 10.4, "fireworks", "baraat_fireworks")
cues += [dict(t=6.2, sfx="wedding", open=8.2, until=10.4), dict(t=10.4, sfx="gunshot")]
flashes.append(dict(t=10.4, d=.07))

# One shot. Then the ringing.
card(10.9, 13.0, ["ONE SHOT IN THE AIR."])
shot(13.0, 17.2, "dawn", "dawn_smoke")
card(13.6, 16.9, ["ONE BOY", "NEVER WENT HOME."], over=True)
cues += [dict(t=13.0, sfx="hit"), dict(t=13.0, sfx="wind", until=17.2), dict(t=13.6, sfx="piano", note=1), dict(t=15.6, sfx="piano", note=0)]

# Five days later: a knock, and someone walking away.
shot(17.2, 21.4, "door", "parcel_door")
card(17.4, 19.2, ["FIVE DAYS LATER"], "place", over=True)
cues += [dict(t=17.9, sfx="knock")] + [dict(t=x, sfx="step", n=i) for i, x in enumerate((18.7, 19.15, 19.6, 20.05, 20.5))]
card(21.4, 23.6, ["HIS PHONE", "ARRIVED AT YOUR DOOR."])
cues += [dict(t=21.4, sfx="hit")]

# 47 missed calls. A heartbeat under it.
shot(23.6, 26.4, "screen", "phone_hand")
cues += [dict(t=23.7, sfx="buzz"), dict(t=24.7, sfx="buzz"), dict(t=23.6, sfx="heart", until=29.6)]

# Rain on the glass. The strings start.
shot(26.4, 29.4, "rain", "rain_glass")
card(26.8, 29.2, ["EVERYTHING ON IT", "IS TRUE."], over=True)
cues += [dict(t=26.4, sfx="rain", until=29.4), dict(t=26.4, sfx="strings", until=41.6)]
card(29.6, 32.4, ["NOT EVERYTHING IS", "IN THE RIGHT ORDER."])
cues += [dict(t=29.6, sfx="braam")]

# The montage: cuts that shorten as the clock speeds up.
m0, m1 = 32.4, 41.6
pool = [
    ("rain", "rain_glass", "11:52 PM"),
    ("fire", "fire", None),
    ("traffic", "night_road", "LOCAL THANE\nMAT LE JAANA."),
    ("embers", "smoke", None),
    ("gate", "delhi_fog", "1:53 AM"),
    ("fireworks", "baraat_fireworks", None),
    ("fire", "fire", "LAPATA"),
    ("bulbs", "wedding_lights", None),
    ("traffic", "night_road", "4:47 AM"),
    ("dawn", "dawn_smoke", None),
    ("phone", "phone_dark", "4. NITIN —"),
]
t, d, i = m0, 1.2, 0
while t < m1 - .05:
    d1 = min(d, m1 - t)
    scene, slot, text = pool[i % len(pool)]
    shot(t, t + d1, scene, slot, seed=round(.37 * i, 2))
    if text and d1 > .3:
        type_.append(dict(t0=round(t, 3), t1=round(t + d1, 3), text=text))
    if d1 < .45:
        flashes.append(dict(t=round(t, 3), d=.035))
    cues.append(dict(t=round(t, 3), sfx="cut", n=i))
    t += d1
    d = max(.14, d * .82)
    i += 1
cues += [dict(t=m0, sfx="shepard", until=m1), dict(t=m0, sfx="tick_fast", until=m1)]

# Cut to nothing. Then the message, then the name.
silence = [[m1, 42.8]]
card(42.8, 45.4, ["M? Tu hai?"], "message")
cues += [dict(t=43.0, sfx="ping")]
shot(45.6, 52.0, "embers", "title_embers", seed=3.0)
shots[-1]["exposure"] = .45
card(45.6, 52.0, [], "title")
cues += [dict(t=45.6, sfx="title_hit"), dict(t=46.4, sfx="piano", note=1), dict(t=48.4, sfx="piano", note=0), dict(t=51.4, sfx="last_tick")]

edit = dict(fps=30, duration=52.0, shots=shots, cards=cards, type=type_, cues=cues, flashes=flashes, silence=silence)
Path(__file__).with_name("edit.json").write_text(json.dumps(edit, indent=1) + "\n")
print(f"{len(shots)} shots, {edit['duration']} s")
