"""Writes edit.json: the trailer's cut, in seconds, read by trailer.html and sound.py.

    python3 marketing/trailer/edit.py

A shot plays footage/<slot>.mp4 (cut by footage.py from Pexels footage and
the props in inserts.html), or, if that clip is missing, a stand-in scene
from scenes.js. Cards are words, Hindi first with the English under it: on
black, or over the picture. Cues are sound; shakes are the camera taking a
hit; flashes are single white frames.
"""

import json
from pathlib import Path

shots, cards, type_, cues, flashes, shakes = [], [], [], [], [], []

# Each slot's grade: exposure, warmth, saturation, smog haze, anamorphic streak.
LOOK = {
    "phone_dark": (1.15, .2, .85, 0, .25), "delhi_fog": (.6, .65, .38, .6, .1),
    "w_diyas": (.95, .8, .95, 0, .4), "w_mehndi": (.85, .7, .85, 0, .1), "w_hands": (.9, .7, .9, 0, .1),
    "w_sparkler": (.95, .7, .9, 0, .5), "w_fireworks": (1.0, .7, .9, 0, .45),
    "fog_road": (.72, 0., .28, .3, 0), "poster": (.95, .5, .8, 0, 0), "rain_street": (.9, .5, .8, .15, .4),
    "phone_hand": (1.1, .3, .85, 0, .2), "rain_glass": (.95, .3, .9, 0, .3),
    "m_gate": (.6, .6, .38, .55, .1), "m_note": (.95, .6, .8, 0, 0), "m_poster": (.9, .5, .8, 0, 0),
    "title_embers": (.22, .6, .9, 0, .2),
}
DEFAULT = (.95, .55, .85, 0, .35)
# Which drawn scene stands in if a slot's footage is missing.
STAND_IN = {"phone_dark": "phone", "phone_hand": "screen", "delhi_fog": "gate", "m_gate": "gate", "fog_road": "dawn",
            "rain_glass": "rain", "m_rain": "rain", "rain_street": "traffic", "m_street": "traffic", "m_traffic": "traffic",
            "m_bikes": "traffic", "w_fireworks": "fireworks", "m_fireworks": "fireworks", "w_sparkler": "embers",
            "title_embers": "embers", "m_embers": "embers", "m_incense": "embers", "w_diyas": "bulbs"}


def shot(t0, t1, slot, seed=0.0):
    e, w, s, haze, streak = LOOK.get(slot, DEFAULT)
    shots.append(dict(t0=round(t0, 3), t1=round(t1, 3), slot=slot, scene=STAND_IN.get(slot, "fire"), seed=seed,
                      exposure=e, warmth=w, sat=s, haze=haze, streak=streak))


def card(t0, t1, hi, en="", style="bi", over=False):
    cards.append(dict(t0=t0, t1=t1, hi=hi, en=en, style=style, over=over))


# ---- Hook: his phone wakes in the dark, buzzing, and it isn't yours.
shot(0.0, 2.4, "phone_dark")
card(.45, 2.35, "ये फ़ोन आपका नहीं है।", "THIS PHONE ISN'T YOURS.", over=True)
cues += [dict(t=0, sfx="tick_start"), dict(t=.15, sfx="buzz"), dict(t=1.15, sfx="buzz"), dict(t=.45, sfx="hook_hit")]

# ---- Delhi in smog; a band somewhere.
shot(2.4, 4.6, "delhi_fog")
card(2.6, 4.5, "22 नवंबर · नई दिल्ली", "22 NOVEMBER · NEW DELHI", "place", over=True)
cues += [dict(t=2.4, sfx="city", until=4.6)]

# ---- The wedding: band baaja and dhol, quick cuts, fireworks slowing down. Then the shot.
for t0, t1, slot in ((4.6, 5.5, "w_diyas"), (5.5, 6.5, "w_mehndi"), (6.5, 7.3, "w_hands"), (7.3, 8.0, "w_sparkler"), (8.0, 9.2, "w_fireworks")):
    shot(t0, t1, slot)
gun = 9.2
cues += [dict(t=2.4, sfx="band", open=4.6, until=gun), dict(t=8.0, sfx="crackle", until=gun), dict(t=gun, sfx="gunshot")]
flashes.append(dict(t=gun, d=.067, k=1.0))
shakes.append(dict(t=gun, amp=1.0, decay=5.0))

card(9.35, 11.4, "एक गोली हवा में।", "ONE SHOT IN THE AIR.")

# ---- The morning after: fog, the tune again on a harmonium, the poster.
shot(11.4, 14.2, "fog_road")
card(11.7, 14.05, "एक लड़का, जो कभी घर नहीं लौटा।", "ONE BOY NEVER WENT HOME.", over=True)
cues += [dict(t=11.4, sfx="hit"), dict(t=11.4, sfx="wind", until=14.2), dict(t=11.4, sfx="harmonium", until=20.6), dict(t=11.4, sfx="tanpura", until=25.9)]
shakes.append(dict(t=11.4, amp=.25, decay=6.0))
shot(14.2, 15.8, "poster")
cues += [dict(t=14.2, sfx="soft_hit")]

# ---- Five days later. A street in the rain, then a knock.
shot(15.8, 18.6, "rain_street")
card(16.0, 18.3, "पाँच दिन बाद", "FIVE DAYS LATER", "place", over=True)
cues += [dict(t=15.8, sfx="street", until=18.6), dict(t=18.0, sfx="knock")]
card(18.6, 20.6, "उसका फ़ोन आपके दरवाज़े तक पहुँचा।", "HIS PHONE ARRIVED AT YOUR DOOR.")
cues += [dict(t=18.6, sfx="hit")]
shakes.append(dict(t=18.6, amp=.25, decay=6.0))

# ---- 47 missed calls, under a thumb. A heartbeat.
shot(20.6, 23.2, "phone_hand")
cues += [dict(t=20.75, sfx="buzz"), dict(t=21.75, sfx="buzz"), dict(t=20.6, sfx="heart", until=25.9)]

# ---- Rain on the glass. Then the turn.
shot(23.2, 25.8, "rain_glass")
card(23.4, 25.65, "इसमें सब सच है।", "EVERYTHING ON IT IS TRUE.", over=True)
cues += [dict(t=23.2, sfx="rain", until=25.8)]
turn = 25.9
card(turn, 28.2, "पर सब कुछ सही क्रम में नहीं है।", "NOT EVERYTHING IS IN THE RIGHT ORDER.")
cues += [dict(t=turn, sfx="braam")]
shakes.append(dict(t=turn, amp=.55, decay=3.0))

# ---- The montage: cuts that shorten as the dhol speeds up, then one held frame.
m0, m1, hold = 28.2, 37.1, .9
pool = [("m_rain", "11:52 PM"), ("m_havan", None), ("m_note", None), ("m_street", "1:53 AM"), ("m_poster", None),
        ("m_fire", None), ("m_bikes", "4:47 AM"), ("m_incense", None), ("m_gate", None), ("m_embers", None),
        ("m_fireworks", None), ("m_traffic", None), ("m_coals", None), ("m_fire3", None)]
t, d, i = m0, 1.3, 0
while t < m1 - hold - .05:
    d1 = min(d, m1 - hold - t)
    if m1 - hold - (t + d1) < .12:  # no sliver of a shot at the end
        d1 = m1 - hold - t
    slot, text = pool[i % len(pool)]
    shot(t, t + d1, slot, seed=round(.37 * i, 2))
    if text:
        type_.append(dict(t0=round(t, 3), t1=round(t + d1, 3), text=text))
    if i % 3 == 2 and d1 < .5:
        flashes.append(dict(t=round(t, 3), d=.034, k=.8))
    cues.append(dict(t=round(t, 3), sfx="cut", n=i))
    t += d1
    d = max(.16, d * .85)
    i += 1
cues += [dict(t=m0, sfx="strings", until=m1 - hold), dict(t=m0, sfx="drums", until=m1 - hold),
         dict(t=m0, sfx="shepard", until=m1 - hold), dict(t=m0, sfx="tick_fast", until=m1 - hold)]
# The list he left for M, stopping where he stopped.
shot(m1 - hold, m1, "phone_dark", seed=1.0)
type_.append(dict(t0=round(m1 - hold, 3), t1=m1, text="4. Nitin —", kind="typed"))
cues += [dict(t=round(m1 - hold, 3), sfx="typing", n=10)]

# ---- Nothing. Then the message. Then the name.
silence = [[m1, 38.2]]
card(38.2, 40.6, "M? Tu hai?", "", "message")
cues += [dict(t=38.3, sfx="dots"), dict(t=39.0, sfx="ping")]
title = 40.6
shot(title, 46.0, "title_embers", seed=3.0)
card(title, 46.0, "", "", "title")
cues += [dict(t=title, sfx="title_hit"), dict(t=title + .6, sfx="harmonium_end"), dict(t=45.4, sfx="last_tick"), dict(t=46.1, sfx="end_buzz")]
shakes.append(dict(t=title, amp=.7, decay=2.5))

edit = dict(fps=30, duration=47.0, shots=shots, cards=cards, type=type_, cues=cues, flashes=flashes, shakes=shakes, silence=silence)
Path(__file__).with_name("edit.json").write_text(json.dumps(edit, indent=1, ensure_ascii=False) + "\n")
print(f"{len(shots)} shots, {edit['duration']} s")
