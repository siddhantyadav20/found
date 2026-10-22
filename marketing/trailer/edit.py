"""Writes edit.json: the trailer's cut, in seconds, read by trailer.html and sound.py.

    python3 marketing/trailer/edit.py

A shot names a footage slot (see SHOTLIST.md) and a still that stands in for
it until footage/<slot>.mp4 exists. Cards are words on black. Cues are sound.
"""

import json
from pathlib import Path

P = "../../public/found/"
shots, cards, type_, cues, flashes = [], [], [], [], []


def shot(t0, t1, slot, still=None, motion="in", grade="night", fx=None):
    shots.append(dict(t0=round(t0, 3), t1=round(t1, 3), slot=slot, still=still, motion=motion, grade=grade, fx=fx))


def card(t0, t1, lines, style="line"):
    cards.append(dict(t0=t0, t1=t1, lines=lines, style=style))


# Cold open: a phone face-down in the dark, buzzing, and a watch ticking.
shot(0.0, 3.2, "phone_dark", None, "in", "night", "phone")
cues += [dict(t=0.0, sfx="tick_start"), dict(t=.6, sfx="buzz"), dict(t=1.6, sfx="buzz"), dict(t=2.6, sfx="buzz")]
card(3.2, 5.6, ["22 NOVEMBER", "CHHATTARPUR · NEW DELHI"], "place")

# The wedding, heard through walls before it's seen.
shot(5.6, 7.6, "wedding_lights", P + "shagun/reel-take.jpg", "in", "warm")
shot(7.6, 9.2, "dhol", P + "shagun/w-14.jpg", "left", "warm")
shot(9.2, 10.4, "crowd", P + "shagun/w-dance.jpg", "in", "warm")
cues += [dict(t=5.6, sfx="dhol_in"), dict(t=10.4, sfx="gunshot")]
flashes.append(dict(t=10.4, d=.07))

# Silence, and the ringing in your ears.
card(10.9, 13.4, ["ONE SHOT IN THE AIR."])
card(13.8, 16.4, ["ONE BOY", "NEVER WENT HOME."])
cues += [dict(t=13.8, sfx="hit")]
shot(16.4, 19.0, "dawn_smoke", P + "shagun/fire.jpg", "up", "dawn")
card(19.0, 21.0, ["FIVE DAYS LATER"], "place")
shot(21.0, 23.4, "parcel_door", None, "in", "night", "door")
cues += [dict(t=21.4, sfx="knock")]
card(23.4, 25.8, ["HIS PHONE", "ARRIVED AT YOUR DOOR."])
shot(25.8, 28.0, "phone_hand", P + "shagun-wallpaper.jpg", "in", "screen", "missed")
cues += [dict(t=25.9, sfx="buzz"), dict(t=26.9, sfx="buzz")]
card(28.4, 30.8, ["EVERYTHING ON IT", "IS TRUE."])
card(31.6, 34.2, ["NOT EVERYTHING IS", "IN THE RIGHT ORDER."])
cues += [dict(t=31.6, sfx="braam")]

# The montage: cuts that shorten as the clock speeds up.
m0, m1 = 34.2, 42.6
pool = [
    ("night_road", P + "shagun/w-11.jpg", "cool", "11:52 PM"),
    ("fire", P + "shagun/fire.jpg", "fire", None),
    ("mehendi_hands", P + "shagun/w-1.jpg", "warm", "LOCAL THANE\nMAT LE JAANA."),
    ("rain_glass", P + "shagun/w-blur.jpg", "cool", None),
    ("smoke", P + "shagun/w-8.jpg", "fire", "1:53 AM"),
    ("hands_phone", P + "shagun/w-dance.jpg", "night", None),
    ("delhi_fog", P + "shagun/w-pheras.jpg", "dawn", "LAPATA"),
    ("fire", P + "shagun/fire.jpg", "fire", "4:47 AM"),
    ("crowd", P + "shagun/w-14.jpg", "warm", None),
    ("night_road", P + "shagun/w-11.jpg", "cool", "4. NITIN —"),
]
motions = ["in", "left", "out", "right", "up"]
t, d, i = m0, 1.1, 0
while t < m1 - .05:
    d1 = min(d, m1 - t)
    slot, still, grade, text = pool[i % len(pool)]
    shot(t, t + d1, slot, still, motions[i % 5], grade)
    if text and d1 > .3:
        type_.append(dict(t0=round(t, 3), t1=round(t + d1, 3), text=text))
    if d1 < .5:
        flashes.append(dict(t=round(t, 3), d=.04))
    t += d1
    d = max(.13, d * .8)
    i += 1
cues += [dict(t=m0, sfx="shepard", until=m1), dict(t=m0, sfx="tick_fast", until=m1)]

# Cut to nothing. Then the message, then the name.
card(43.8, 46.4, ["M? Tu hai?"], "message")
cues += [dict(t=44.0, sfx="ping")]
card(46.6, 53.0, [], "title")
cues += [dict(t=46.6, sfx="title_hit")]

edit = dict(fps=30, duration=53.0, shots=shots, cards=cards, type=type_, cues=cues, flashes=flashes, silence=[[42.6, 43.8]])
Path(__file__).with_name("edit.json").write_text(json.dumps(edit, indent=1) + "\n")
print(f"{len(shots)} shots, {edit['duration']} s")
