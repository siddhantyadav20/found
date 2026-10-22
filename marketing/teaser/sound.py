"""The teaser's sound, cut to teaser.html's scene list.

    python3 sound.py '<{"SCENES": ..., "DURATION": ...}>' out.wav

Everything is synthesised here except the buzz, which is the game's own
(public/sfx/found-buzz-1.m4a). Quiet on purpose: dread is made of timestamps,
not stings, so nothing here is louder than a phone on a table.
"""

import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
cfg = json.loads(sys.argv[1])
S, DUR = cfg["SCENES"], cfg["DURATION"]
out = Path(sys.argv[2])
root = Path(__file__).resolve().parents[2]
rng = np.random.default_rng(22)

n = int(DUR * SR)
t = np.arange(n) / SR
mix = np.zeros(n)


def env(start, attack, hold, release):
    """0 → 1 over attack, held, → 0 over release, from start (seconds)."""
    e = np.interp(t, [start, start + attack, start + attack + hold, start + attack + hold + release], [0, 1, 1, 0], left=0, right=0)
    return e


def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def place(sig, at, gain=1.0):
    i = int(at * SR)
    j = min(n, i + len(sig))
    if j > i:
        mix[i:j] += sig[: j - i] * gain


# The drone: two low tones a fifth apart, breathing, swelling toward the
# last message, gone for the dip before the title.
swell = np.interp(t, [0, 1.5, S["fire"][0], S["msg"][1] - .4, S["msg"][1], S["title"][0], DUR - 1.2, DUR],
                  [0, .55, .7, 1.0, 0, .5, .45, 0])
breath = .8 + .2 * np.sin(2 * np.pi * .23 * t)
drone = (np.sin(2 * np.pi * 55 * t) + .6 * np.sin(2 * np.pi * 82.4 * t) + .25 * np.sin(2 * np.pi * 110.3 * t)) * breath
air = lowpass(rng.standard_normal(n), 380) * 1.2
mix += (drone * .16 + air * .10) * swell

# The buzz, three rings while the call is up.
wav = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(root / "public/sfx/found-buzz-1.m4a"),
                      "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
buzz = np.frombuffer(wav, dtype=np.int16).astype(float) / 32768
for k in range(3):
    place(buzz, 3.0 + k, .9)

# The stamp: a thump on the table.
st = S["label"][0] + 1.0
k = np.arange(int(.5 * SR)) / SR
thump = np.sin(2 * np.pi * (70 - 30 * k) * k) * np.exp(-k * 11) + lowpass(rng.standard_normal(len(k)), 1800) * np.exp(-k * 40) * 1.5
place(thump, st, .8)

# Pen on paper while the note writes itself.
a = S["env"][0] + .3
scratch = lowpass(rng.standard_normal(int(2.5 * SR)), 2600) - lowpass(rng.standard_normal(int(2.5 * SR)), 900)
grain = (np.abs(np.sin(np.arange(len(scratch)) / SR * 2 * np.pi * 5.5)) ** 3)
place(scratch * grain, a, .05)

# A shutter on each frame of the album.
each = (S["album"][1] - S["album"][0]) / 4
k = np.arange(int(.07 * SR)) / SR
click = rng.standard_normal(len(k)) * np.exp(-k * 120)
for i in range(4):
    place(click, S["album"][0] + i * each, .35)
    place(click, S["album"][0] + i * each + .045, .25)

# Fire: crackle and a low roar, under "Jaldi karo."
a, b = S["fire"]
m = int((b - a) * SR)
roar = lowpass(rng.standard_normal(m), 260) * 2.2
pops = np.zeros(m)
for p in rng.integers(0, m - 2000, 70):
    L = rng.integers(200, 1400)
    pops[p:p + L] += rng.standard_normal(L) * np.exp(-np.arange(L) / (L / 5)) * rng.uniform(.2, 1)
fade = np.interp(np.arange(m), [0, .2 * SR, m - .3 * SR, m], [0, 1, 1, 0])
place((roar * .35 + pops * .25) * fade, a)

# Keys, while "For M" types itself out to "4. Nitin —".
a = S["note"][0] + .5
k = np.arange(int(.03 * SR)) / SR
key = lowpass(rng.standard_normal(len(k)), 3000) * np.exp(-k * 250)
for i in range(70):
    place(key, a + i * 1.9 / 70 + rng.uniform(-.008, .008), .25)

# Two messages arriving: a soft, generic tick, not any app's sound.
k = np.arange(int(.18 * SR)) / SR
tick = np.sin(2 * np.pi * 1320 * k) * np.exp(-k * 30)
place(tick, S["msg"][0] + .2, .12)
place(tick, S["msg"][0] + 1.0, .12)

# The title lands.
k = np.arange(int(3 * SR)) / SR
boom = np.sin(2 * np.pi * (48 - 8 * k) * k) * np.exp(-k * 1.6) + lowpass(rng.standard_normal(len(k)), 200) * np.exp(-k * 3) * 1.5
place(boom, S["title"][0] + .1, .55)

mix /= max(1e-9, np.abs(mix).max()) / .89
with wave.open(str(out), "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print(f"sound → {out}")
