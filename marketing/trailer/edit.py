"""Writes edit.json: the trailer's cut, in seconds, read by trailer.html and sound.py.

    python3 marketing/trailer/edit.py

Raakh, as the game now plays it (CHAPTER1.md, "Seven o'clock" and "The final
cut"), in English. It never says the twist: no "alive", no nursing home, no
rescue. The voices are the game's own (public/voices/raakh), cut phrase by
phrase, each with its English subtitle; the sounds are the game's own where
it has them (public/sfx).

A shot plays footage/<slot>.mp4 (cut by footage.py from Pexels footage, the
game's own pictures and clips, and the props in inserts.html), or, if that
clip is missing, a stand-in scene from scenes.js. Cards are words, on black
or over the picture. Labels are small mono place-and-time lines. Cues are
sound; shakes are the camera taking a hit; flashes are single white frames.
"""

import json
from pathlib import Path

shots, cards, labels, subs, type_, cues, flashes, shakes = [], [], [], [], [], [], [], []

# Each slot's grade: exposure, warmth, saturation, smog haze, anamorphic streak.
LOOK = {
    "phone_dark": (1.15, .2, .85, 0, .25), "parcel": (1.0, .7, .85, 0, 0), "delhi_fog": (.6, .65, .38, .6, .1),
    "g_dhol": (.95, .75, .9, 0, .3), "g_baraat": (.95, .75, .9, 0, .3), "g_varmala": (.95, .75, .9, 0, .3),
    "w_sparkler": (.95, .7, .9, 0, .5), "g_portrait": (.95, .6, .85, 0, .25),
    "g_reel": (.95, .5, .85, 0, .3), "poster": (.95, .5, .8, 0, 0), "g_chhath": (.9, .7, .75, 0, 0),
    "g_lawn": (.85, .4, .7, .1, .2), "k_dance": (.72, .6, .9, 0, .15), "g_fire": (1.0, .6, .9, 0, .2), "rain_street": (.9, .5, .8, .15, .4),
    "call": (1.0, .3, .8, 0, 0), "m_gate": (.6, .6, .38, .55, .1), "m_note": (.95, .6, .8, 0, 0), "m_poster": (.9, .5, .8, 0, 0),
    "title_embers": (.22, .6, .9, 0, .2),
}
DEFAULT = (.95, .55, .85, 0, .35)
# Which drawn scene stands in if a slot's footage is missing.
STAND_IN = {"phone_dark": "phone", "delhi_fog": "gate", "m_gate": "gate", "g_lawn": "dawn", "rain_street": "traffic",
            "m_rain": "rain", "m_traffic": "traffic", "title_embers": "embers", "m_embers": "embers", "g_dhol": "bulbs",
            "g_fire": "fire", "m_fire": "fire", "w_sparkler": "embers", "k_dance": "fireworks"}


def shot(t0, t1, slot, seed=0.0):
    e, w, s, haze, streak = LOOK.get(slot, DEFAULT)
    shots.append(dict(t0=round(t0, 3), t1=round(t1, 3), slot=slot, scene=STAND_IN.get(slot, "fire"), seed=seed,
                      exposure=e, warmth=w, sat=s, haze=haze, streak=streak))


def card(t0, t1, lines, style="card", over=False, pos="low"):
    """lines: [(text, kind)], kind 'main' (serif) or 'small' (grey) or 'ember'."""
    cards.append(dict(t0=t0, t1=t1, lines=lines, style=style, over=over, pos=pos))


def label(t0, t1, text):
    labels.append(dict(t0=t0, t1=t1, text=text))


def voice(at, who, file, pieces, gain=1.0, gap=.22, pos="low"):
    """Lays a voice file's phrases back to back from `at`, each with its subtitle.
    pieces: [(from, until, english[, gain])]. Returns when the last phrase ends."""
    t = at
    for a, b, en, *g in pieces:
        cues.append(dict(t=round(t, 3), sfx="voice", file=file, start=a, until=b, gain=gain * (g[0] if g else 1)))
        subs.append(dict(t0=round(t, 3), t1=round(t + (b - a) + .25, 3), who=who, text=en, pos=pos))
        t += (b - a) + gap
    return t - gap


# ---- Hook: his phone, face up in the dark, buzzing. It isn't yours.
shot(0.0, 2.4, "phone_dark")
card(.45, 2.35, [("This phone isn't yours.", "main")], over=True, pos="mid")
cues += [dict(t=0, sfx="tick_start"), dict(t=.15, sfx="buzz"), dict(t=1.15, sfx="buzz"), dict(t=.45, sfx="hook_hit")]

# ---- The parcel that came back.
shot(2.4, 4.7, "parcel")
card(2.55, 4.6, [("It was meant for someone else.", "main")], over=True)
cues += [dict(t=2.4, sfx="paper")]

# ---- Delhi; the wedding, a week before.
shot(4.7, 6.4, "delhi_fog")
label(4.8, 6.35, "SATURDAY 22 NOVEMBER · DELHI")
cues += [dict(t=4.7, sfx="city", until=6.4)]
for t0, t1, slot in ((6.4, 7.3, "g_dhol"), (7.3, 8.1, "g_baraat"), (8.1, 8.9, "g_varmala"), (8.9, 9.6, "w_sparkler")):
    shot(t0, t1, slot)
shot(9.6, 10.9, "g_portrait")
label(9.7, 10.85, "9:48 PM")
shot(10.9, 12.3, "k_dance")
cues += [dict(t=10.9, sfx="dance_shots")]
cues += [dict(t=11.55, sfx="voice", file="clip-k-3", start=10.05, until=10.8, gain=.9)]
gun = 13.7
shot(12.3, gun, "g_reel")
label(12.4, gun, "THE BACK LAWN")
cues += [dict(t=4.7, sfx="band", open=6.4, until=12.3)]
voice(12.5, "", "cold-3", [(.15, .7, "Rolling, bro?")])
cues += [dict(t=gun, sfx="gunshot")]
flashes.append(dict(t=gun, d=.067, k=1.0))
shakes.append(dict(t=gun, amp=1.0, decay=5.0))

card(gun + .1, 15.6, [("One shot in the air.", "main")])

# ---- Dilip: the poster, and his own voice, practising his English for Mumbai.
shot(15.6, 19.9, "poster")
end = voice(15.75, "DILIP · VOICE NOTE", "voice-d-2c", [(.5, 1.4, "Bhaiya, listen…"), (2.3, 3.7, "“Sir, light is ready.”", 1.3), (4.7, 5.9, "“Sir, battery full.”", 2.2)], pos="foot")
shot(19.9, 23.9, "g_chhath")
voice(20.1, "DILIP · VOICE NOTE", "voice-d-2c", [(6.15, 7.15, "Did I say it right?", 1.6), (7.95, 10.25, "In Mumbai, I'll have to speak English.", 1.2)])
cues += [dict(t=15.6, sfx="harmonium", until=23.9), dict(t=15.6, sfx="tanpura", until=33.0), dict(t=15.6, sfx="soft_hit")]

# ---- Sameer's version: voice notes to M, one grey tick each.
shot(23.9, 27.9, "g_lawn")
voice(24.0, "SAMEER · VOICE NOTE TO M", "voice-m-1", [(7.25, 9.3, "Kunal was firing."), (11.1, 12.6, "A boy fell.")])
shot(27.9, 32.9, "g_fire")
label(28.0, 32.85, "SUNDAY · 4:47 AM")
voice(28.2, "SAMEER · VOICE NOTE TO M", "voice-m-3", [(.7, 3.1, "They burned him, M."), (4.6, 5.55, "I was there.", 1.8), (6.8, 7.8, "I saw.", 1.9)])
cues += [dict(t=27.9, sfx="fire", until=32.9), dict(t=23.9, sfx="wind", until=27.9)]

# ---- Tonight: a man at the gate, and Bhasin on the line.
shot(32.9, 38.2, "rain_street")
voice(33.05, "THE GUARD · GATE 2", "call-guard-calls-1", [(.25, 2.1, "There's a man at the gate."), (3.55, 4.55, "In a safari suit."), (5.55, 7.65, "He's asking for your flat number.")])
cues += [dict(t=32.9, sfx="street", until=38.2), dict(t=32.9, sfx="heart", until=44.6)]
shot(38.2, 40.4, "call")
cues += [dict(t=38.2, sfx="ring")]
voice(38.85, "BHASIN SEHGAL", "call-bhasin-calls-1", [(.1, 1.6, "You're not Sameer.")], pos="mid")
shot(40.4, 44.6, "m_gate")
voice(40.55, "BHASIN SEHGAL", "call-bhasin-calls-3", [(.2, 3.25, "Give it back to the courier by morning."), (4.5, 6.25, "We'll handle the rest.")])
cues += [dict(t=38.2, sfx="dread", until=44.6)]

turn = 44.7
card(turn, 47.4, [("Everything on it\nis true.", "main"), ("Somebody edited\nthe night.", "ember")])
cues += [dict(t=turn, sfx="braam")]
shakes.append(dict(t=turn, amp=.55, decay=3.0))

# ---- The montage: cuts that shorten as the drums speed up, then one held frame.
m0, m1, hold = 47.4, 54.3, .9
pool = [("m_rain", "11:52 PM"), ("m_gravel", None), ("m_note", None), ("m_kfire", "12:32 AM"), ("m_poster", None),
        ("m_jerrycan", None), ("m_fire", "1:52 AM"), ("m_pheras", None), ("m_reel3", None), ("m_gate", None),
        ("m_embers", "4:47 AM"), ("m_traffic", None), ("m_baraat", None), ("m_coals", None)]
t, d, i = m0, 1.15, 0
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
    d = max(.16, d * .84)
    i += 1
cues += [dict(t=m0, sfx="strings", until=m1 - hold), dict(t=m0, sfx="drums", until=m1 - hold),
         dict(t=m0, sfx="shepard", until=m1 - hold), dict(t=m0, sfx="tick_fast", until=m1 - hold)]
# The list he left for M, stopping where he stopped.
shot(m1 - hold, m1, "phone_dark", seed=1.0)
type_.append(dict(t0=round(m1 - hold, 3), t1=m1, text="4. Nitin —", kind="typed"))
cues += [dict(t=round(m1 - hold, 3), sfx="typing", n=10)]

# ---- Nothing. Then him. Then seven o'clock.
silence = [[m1, 55.3]]
card(55.3, 57.6, [("M? Tu hai?", "main"), ("M? Is that you?", "small")], "message")
cues += [dict(t=55.4, sfx="dots"), dict(t=56.1, sfx="ping")]
voice(57.8, "THE GUARD · GATE 2", "msg-g-2", [(.15, .75, "He's gone."), (1.75, 4.85, "Said he'll be back at seven.")], gap=.3)
cues += [dict(t=57.6, sfx="clock", until=63.6)]
card(61.5, 63.6, [("Before seven,", "main"), ("you'll have to choose.", "ember")])
title = 63.7
shot(title, 69.2, "title_embers", seed=3.0)
card(title, 69.2, [], "title")
cues += [dict(t=title, sfx="title_hit"), dict(t=title + .6, sfx="harmonium_end"), dict(t=68.6, sfx="last_tick"), dict(t=69.35, sfx="end_buzz")]
shakes.append(dict(t=title, amp=.7, decay=2.5))

edit = dict(fps=30, duration=70.2, shots=shots, cards=cards, labels=labels, subs=subs, type=type_, cues=cues,
            flashes=flashes, shakes=shakes, silence=silence)
Path(__file__).with_name("edit.json").write_text(json.dumps(edit, indent=1, ensure_ascii=False) + "\n")
print(f"{len(shots)} shots, {edit['duration']} s")
