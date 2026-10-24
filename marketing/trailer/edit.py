"""Writes edit.json: the trailer's cut, in seconds, read by trailer.html and sound.py.

    python3 marketing/trailer/edit.py

Raakh, v7. Pictures and a score, a few small typed lines, no voices, no
faces. It never says the twist. Every shot is real footage, Indian wherever a
place shows (footage.py).

Cold open: Delhi in fog; a phone that isn't yours lights up; the parcel, and
a band somewhere far off. The wedding, on the band and the dhol: the pheras,
the havan, sparklers, fireworks, faster and faster, until a gun comes out, an
arm goes up, and one shot. After: cold and slow, a field in the morning fog, a
torch, a corridor, the jerrycan, the fire, smoke. Then the
build, cuts that halve and halve with the night's times typed over them,
running into silence. Nothing. Then a message: M? Tu hai? Dawn, the clock,
and the name.

A shot plays footage/<slot>.mp4, or, if that clip is missing, a stand-in
scene from scenes.js. A typed card is one or two lines typed out a key at a
time, small, in mono; a label is the same, at the top, over the picture; a
stamp is a time over the build. Cues are sound. Shakes are the camera taking
a hit, flashes white frames, whips a whip-pan across a cut, leaks a light leak
burning across one. Silence is black and nothing at all.
"""

import json
from pathlib import Path

shots, cards, labels, stamps, cues, flashes, shakes, whips, leaks = [], [], [], [], [], [], [], [], []

# Each slot's grade: exposure, warmth, saturation, smog haze, anamorphic streak, cool (teal in the shadows and mids).
WED = (1.0, .7, .95, 0, .35, 0)
NIGHT = (.92, .3, .75, 0, .15, .75)
LOOK = {
    "o_city": (.85, .55, .7, .1, .35, .45), "o_phone": (.7, .2, .7, 0, .1, .85), "o_parcel": (.85, .4, .7, 0, 0, .5),
    "w_diya": WED, "w_dhol": WED, "w_pheras": WED, "w_rice": WED, "w_sparkler": (1.0, .6, .9, 0, .45, 0), "w_chunni": WED,
    "w_sparklers": WED, "w_feet": WED, "w_fireworks": (1.05, .6, .95, 0, .45, 0), "w_havan": WED, "w_anar": (1.0, .65, .9, 0, .45, 0),
    "w_mehndi": WED, "w_gun": (.55, .35, .6, 0, .2, .55), "w_raise": (.8, .45, .75, 0, .4, .35),
    "a_field": (.6, .2, .55, .1, 0, .85), "a_torch": (1.15, .2, .8, 0, .5, .8), "a_door": (.75, .2, .65, 0, .1, .85),
    "a_jerrycan": (.88, .35, .75, 0, 0, .7), "a_fire": (1.0, .6, .9, 0, .25, .6), "a_ash": (.7, .3, .6, 0, 0, .8),
    "m_rider": NIGHT, "m_poster": (.9, .35, .7, 0, 0, .6), "m_auto": (.95, .35, .85, 0, .35, .6), "m_car": NIGHT,
    "m_cracker": (1.0, .55, .9, 0, .4, .3), "m_trails": NIGHT, "m_aarti": (.95, .6, .9, 0, .2, .4), "m_clock": (.9, .3, .65, 0, 0, .65),
    "m_road": NIGHT, "m_city": (1.6, .4, .85, 0, .4, .6),
    "s_dawn": (.7, .3, .6, .3, .1, .6), "title_ash": (.3, .6, .9, 0, .2, .2),
}
DEFAULT = (.95, .55, .85, 0, .35, 0)
STAND_IN = {"o_city": "traffic", "o_phone": "phone", "w_diya": "bulbs", "w_fireworks": "fireworks", "w_sparklers": "embers",
            "a_torch": "traffic", "a_fire": "fire", "a_ash": "embers", "m_auto": "rain", "m_car": "traffic", "s_dawn": "dawn",
            "title_ash": "embers"}


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


# ============================================================ I. Cold open (free time)
cues += [dict(t=0, sfx="room", until=7.8)]
shot(.3, 2.8, "o_city")
cues += [dict(t=.3, sfx="city", until=2.9)]
# A phone that isn't yours, lighting up in the dark.
shot(2.8, 6.2, "o_phone")
cues += [dict(t=3.5, sfx="buzz"), dict(t=4.55, sfx="buzz"), dict(t=3.5, sfx="glow", until=7.8)]
cues += [dict(t=4.0, sfx="keys", times=typed(4.0, 6.15, ["This phone isn't yours."], pos="low", over=True))]
# The parcel; a band somewhere, through the walls.
shot(6.2, 7.8, "o_parcel")
cues += [dict(t=6.2, sfx="paper")]

# ============================================================ II. The wedding (120 bpm from `night`)
night, beat = 7.8, .5
t = night
shot(t, t + 2 * beat, "w_diya")
cues += [dict(t=night + .1, sfx="keys", times=label(night + .1, night + 2.2, "SATURDAY, 22 NOVEMBER"), soft=True)]
t += 2 * beat
for k, slot in enumerate(["w_dhol", "w_pheras", "w_sparkler", "w_chunni", "w_anar", "w_feet", "w_sparklers", "w_fireworks", "w_havan"]):
    shot(t, t + beat, slot)
    if slot in ("w_fireworks", "w_anar"):
        leaks.append(dict(t=round(t, 3), d=.45, k=.8))
    elif k % 3 == 2:
        whips.append(dict(t=round(t, 3), dir=1 if k % 2 else -1))
    t += beat
double = t
# Double time: the same night, faster.
for k, slot in enumerate(["w_mehndi", "w_fireworks", "w_rice", "w_sparkler", "w_pheras", "w_anar", "w_chunni", "w_havan"]):
    shot(t, t + beat / 2, slot, seed=1.0)
    t += beat / 2
# The party goes far away: a gun comes out. Then an arm goes up, everything stops, and one shot.
rev = t
shot(rev, rev + 3 * beat, "w_gun")
raise_ = rev + 3 * beat
gun = raise_ + 2 * beat
shot(raise_, gun, "w_raise")
cues += [dict(t=night, sfx="wedding", beat=beat, double=double, muffle=rev, stop=raise_, until=gun)]
cues += [dict(t=gun, sfx="gunshot")]
flashes.append(dict(t=gun, d=.067, k=1.0))
shakes.append(dict(t=gun, amp=1.0, decay=5.0))

# ============================================================ III. After (slow, cold; fire the only warm thing)
a0 = gun + 1.2
t = a0
for slot, d in (("a_field", 2.4), ("a_torch", 2.0), ("a_door", 1.4), ("a_jerrycan", 1.6), ("a_fire", 2.4), ("a_ash", 2.2)):
    shot(t, t + d, slot)
    cues.append(dict(t=round(t, 3), sfx="pulse", slot=slot))
    t += d
turn = t
cues += [dict(t=a0, sfx="after", until=turn), dict(t=a0 + 2.4, sfx="sweep"), dict(t=a0 + 5.8 + .3, sfx="slosh"),
         dict(t=a0 + 7.4, sfx="fire", until=a0 + 9.8)]
cues += [dict(t=turn, sfx="turn"), dict(t=turn + .2, sfx="keys", times=typed(turn + .2, turn + 2.5, ["Somebody edited", "the night."]))]

# ============================================================ IV. The build: cuts that halve and halve, into nothing
m0 = turn + 2.6
m1 = m0 + 9.6
pool = [("m_rider", "11:52 PM"), ("m_auto", None), ("m_poster", None), ("w_raise", None), ("m_cracker", "12:32 AM"), ("m_car", None),
        ("a_fire", None), ("a_door", None), ("m_trails", "1:52 AM"), ("m_clock", None), ("w_gun", None), ("m_road", "4:47 AM"),
        ("m_aarti", None), ("m_poster", None), ("o_phone", None), ("a_field", None), ("w_chunni", None), ("m_clock", None),
        ("m_city", None), ("m_auto", None), ("w_pheras", None), ("m_poster", None), ("a_fire", None), ("m_clock", None)]
t, d, i = m0, 1.0, 0
while t < m1 - .05:
    d1 = min(d, m1 - t)
    if m1 - (t + d1) < .1:  # no sliver of a shot at the end
        d1 = m1 - t
    slot, text = pool[i % len(pool)]
    shot(t, t + d1, slot, seed=round(.37 * i, 2))
    if text:
        stamps.append(dict(t0=round(t, 3), t1=round(t + d1, 3), text=text))
    if i % 3 == 2:
        whips.append(dict(t=round(t, 3), dir=1 if i % 2 else -1))
    if i > 8 and i % 2 == 0:
        flashes.append(dict(t=round(t, 3), d=.034, k=.6))
    cues.append(dict(t=round(t, 3), sfx="cut", n=i))
    t += d1
    d = 1.0 if t < m0 + 2.5 else max(.12, d * .8)
    i += 1
cues += [dict(t=m0, sfx="build", until=m1)]
# Nothing. Black and silent.
quiet = m1 + 1.1
silence = [[m1, quiet]]

# ============================================================ V. A message; seven; the name
cards.append(dict(t0=quiet, t1=quiet + 2.6, lines=[["M? Tu hai?", "main"], ["M? Is that you?", "small"]], style="message"))
cues += [dict(t=quiet + .1, sfx="dots"), dict(t=quiet + .8, sfx="ping")]
dawn = quiet + 2.6
title = dawn + 4.2
shot(dawn, title, "s_dawn")
cues += [dict(t=dawn, sfx="seven", until=title)]
cues += [dict(t=dawn + .5, sfx="keys", times=typed(dawn + .5, title - .1, ["Before seven,", "you'll have to choose."], pos="low", over=True))]
end = title + 5.8
shot(title, end, "title_ash", seed=3.0)
cards.append(dict(t0=title, t1=end, lines=[], style="title"))
cues += [dict(t=title, sfx="title"), dict(t=end - .2, sfx="last_tick"), dict(t=end + .15, sfx="end_buzz")]
shakes.append(dict(t=title, amp=.6, decay=2.5))

edit = dict(fps=30, duration=round(end + .8, 3), shots=shots, cards=cards, labels=labels, subs=[], type=stamps, cues=cues,
            flashes=flashes, shakes=shakes, whips=whips, leaks=leaks, bars=[[0, 0]], silence=silence)
Path(__file__).with_name("edit.json").write_text(json.dumps(edit, indent=1, ensure_ascii=False) + "\n")
print(f"{len(shots)} shots, {edit['duration']} s; build {m0:.1f}-{m1:.1f}, silence to {quiet:.1f}, title {title:.1f}")
