"""The trailer's score and sound, cut to edit.json's cues.

    python3 sound.py edit.json out.wav

Everything is synthesised here with numpy except the buzz, which is the
game's own (public/sfx/found-buzz-1.m4a). D phrygian throughout, the half
step D–E♭ doing what it does in Bhairavi: piano on the cold open, a dhol
through a wall, one shot and the ringing after it, a string ostinato that
starts under the rain and drives the montage, braams on the words, a
shehnai over the name.

Phone speakers play almost nothing below 200 Hz, so every low thing here
also has a voice in the midrange: the braams are distorted, the toms click,
the heartbeat knocks. render.mjs loudness-normalises the result.
"""

import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
E = json.loads(Path(sys.argv[1]).read_text())
out = Path(sys.argv[2])
root = Path(__file__).resolve().parents[2]
rng = np.random.default_rng(2211)
N = int(E["duration"] * SR)
L = np.zeros(N)
R = np.zeros(N)


def cues(name):
    return [c for c in E["cues"] if c["sfx"] == name]


def cue(name):
    return cues(name)[0]


def T(sec):
    return np.arange(int(sec * SR)) / SR


def noise(sec):
    return rng.standard_normal(int(sec * SR))


def band(x, lo=0, hi=SR / 2, order=2):
    """Zero-phase band-pass in the frequency domain."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo > 0:
        g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order))
    if hi < SR / 2:
        g *= 1 / np.sqrt(1 + (f / hi) ** (2 * order))
    return np.fft.irfft(X * g, len(x))


def peak(x, fc, q, gain):
    """A resonant bump at fc (a formant), added to x."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = 1 + gain * np.exp(-((f - fc) / (fc / q)) ** 2)
    return np.fft.irfft(X * g, len(x))


def put(sig, at, gain=1.0, pan=0.0):
    i = int(round(at * SR))
    if i >= N or len(sig) == 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    j = min(N, i + len(sig))
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt((1 - pan) / 2) * 1.414
    R[i:j] += s * np.sqrt((1 + pan) / 2) * 1.414


IRS = {}


def reverb_ir(secs, tone, seed):
    key = (secs, tone, seed)
    if key not in IRS:
        r = np.random.default_rng(seed)
        t = T(secs)
        pair = []
        for _ in range(2):
            ir = r.standard_normal(len(t)) * np.exp(-t * 6.9 / secs)
            ir = band(ir, 120, tone)
            ir[: int(.015 * SR)] = 0
            pair.append(ir / np.sqrt((ir ** 2).sum()))
        IRS[key] = pair
    return IRS[key]


def put_wet(sig, at, gain=1.0, wet=.4, secs=2.5, tone=5000, seed=0, pan=0.0):
    put(sig, at, gain * (1 - wet), pan)
    i = int(round(at * SR))
    for ch, ir in zip((L, R), reverb_ir(secs, tone, seed)):
        n = len(sig) + len(ir)
        w = np.fft.irfft(np.fft.rfft(sig, n) * np.fft.rfft(ir, n), n) * gain * wet * 3
        j = min(N, i + len(w))
        if j > i:
            ch[i:j] += w[: j - i]


def env(n, a, d, s, r):
    e = np.full(n, s, float)
    A, Dd, Rr = int(a * SR), int(d * SR), max(1, int(r * SR))
    A = min(A, n)
    e[:A] = np.linspace(0, 1, A)
    k = min(n, A + Dd)
    e[A:k] = np.linspace(1, s, k - A)
    e[-Rr:] *= np.linspace(1, 0, min(Rr, n))[: len(e[-Rr:])]
    return e


def saw(freq, n):
    ph = np.cumsum(np.broadcast_to(np.asarray(freq, float), (n,))) / SR
    x = 2 * (ph % 1) - 1
    return x


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


def silent_at(t):
    return any(a <= t < b for a, b in E["silence"])


# ============================================================================ instruments

def piano(f, secs=5.0, vel=1.0):
    t = T(secs)
    x = np.zeros(len(t))
    for n in range(1, 15):
        fn = f * n * np.sqrt(1 + .00035 * n * n)
        if fn > 9000:
            break
        a = 1 / n ** 1.15 * (1 if n < 8 else .5)
        dec = .45 + .32 * n
        for det in (-.0004, .0004):
            x += a * np.sin(2 * np.pi * fn * (1 + det) * t + n) * np.exp(-t * dec)
    hammer = band(noise(.02), 800, 5000) * np.exp(-T(.02) * 300) * .4
    x[: len(hammer)] += hammer
    x *= env(len(t), .002, 0, 1, .3)
    return x * vel * .25


def string_note(f, secs, bright=2600):
    n = int(secs * SR)
    x = sum(saw(f * (1 + d), n) for d in (-.0035, 0, .004))
    x = band(x, 90, bright)
    return x * env(n, .005, .07, .35, .04) / 3


def pad(freqs, secs, hi=900):
    n = int(secs * SR)
    t = T(secs)
    x = sum(saw(f * (1 + .002 * np.sin(2 * np.pi * (.1 + .03 * k) * t)), n) for k, f in enumerate(freqs))
    return band(x, 50, hi) / len(freqs)


def tom(f0=95, click=.6):
    t = T(1.2)
    f = f0 * (1 + 1.2 * np.exp(-t * 30))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5)
    hit = band(noise(1.2), 900, 5000) * np.exp(-t * 60) * click
    return np.tanh((body + hit) * 1.4)


def dhol(bass=True):
    t = T(.6)
    if bass:
        f = 62 + 85 * np.exp(-t * 16)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6)
        x += np.sin(2 * np.pi * np.cumsum(f * 2.9) / SR) * np.exp(-t * 14) * .35  # the skin's overtone, for small speakers
        x += band(noise(.6), 200, 1500) * np.exp(-t * 50) * .5
        return np.tanh(x * 1.5)
    x = np.sin(2 * np.pi * 440 * t) * np.exp(-t * 30) * .6 + band(noise(.6), 1200, 6000) * np.exp(-t * 35)
    return x * .8


def braam(secs=5.0, root=38.89):
    """The brass-and-distortion blast: a stack on D, its filter thrown open
    then closing, driven hard so it growls in the midrange."""
    n = int(secs * SR)
    t = T(secs)
    v = sum(saw(f * (1 + d), n) for f in (root, root * 2, root * 3, root * 4, root * 4.76) for d in (-.005, 0, .006))
    opened = band(v, 30, 2400)
    closed = band(v, 30, 380)
    k = np.clip(np.exp(-t * 2.2) * 1.2, 0, 1)
    x = closed + (opened - closed) * k
    x = np.tanh(x * .9)
    x = peak(x, 520, 2.5, 1.2)
    x *= env(n, .015, .5, .7, 2.5)
    sub = np.sin(2 * np.pi * root * t) * np.exp(-t * .9)
    return x * .55 + sub * .5


def riser(secs):
    t = T(secs)
    x = band(noise(secs), 500, 9000) * (t / secs) ** 3
    sweep = np.sin(2 * np.pi * np.cumsum(300 + 1800 * (t / secs) ** 2) / SR) * (t / secs) ** 2 * .15
    return x * .5 + sweep


def whoosh(secs=.35):
    t = T(secs)
    x = noise(secs)
    lo = band(x, 200, 900)
    hi = band(x, 1500, 6000)
    k = t / secs
    shape = np.sin(np.pi * k) ** 2
    return (lo * (1 - k) + hi * k) * shape


def shehnai(phrase, secs):
    """A double-reed line with meend: notes as (midi, start, length), gliding
    into each other the way a shehnai does, nasal, with a slow vibrato."""
    n = int(secs * SR)
    t = T(secs)
    pitch = np.full(n, midi(phrase[0][0]))
    amp = np.zeros(n)
    for m, st, du in phrase:
        i, j = int(st * SR), min(n, int((st + du) * SR))
        g = min(int(.12 * SR), j - i)
        start = pitch[i - 1] if i > 0 else midi(m)
        pitch[i:i + g] = np.linspace(start, midi(m), g)
        pitch[i + g:j] = midi(m)
        if j < n:
            pitch[j:] = midi(m)
        amp[i:j] = np.maximum(amp[i:j], env(j - i, .08, .2, .85, .15))
    pitch *= 1 + .007 * np.sin(2 * np.pi * 5.3 * t) * np.clip(t * 2, 0, 1)
    ph = np.cumsum(pitch) / SR
    x = sum(np.sin(2 * np.pi * h * ph) * (1 / h ** .6) * (1.3 if h % 2 else .8) for h in range(1, 13))
    x += band(noise(secs), 2000, 6000) * .04  # breath
    x = band(x, 300, 5500)
    x = peak(peak(x, 1150, 3, 2.), 2700, 4, 1.2)
    return x * amp * .12


def tick(hi=True):
    t = T(.05)
    click = band(noise(.05), 2000, 9000) * np.exp(-t * 900)
    ping = np.sin(2 * np.pi * (5200 if hi else 4300) * t) * np.exp(-t * 220)
    return click * .7 + ping * .6


# ============================================================================ the cut

D3 = midi(50)

# ---- the watch: steady, then running away with the montage.
times, t, k = [], cue("tick_start")["t"], 0
m0, m1 = cue("tick_fast")["t"], cue("tick_fast")["until"]
while t < m1:
    times.append(t)
    t += .5 if t < m0 else .5 / (1 + 5 * (t - m0) / (m1 - m0))
for k, t in enumerate(times):
    if not silent_at(t) and not (10.4 <= t < 13.0):
        put(tick(k % 2 == 0), t, .5 if t < m0 else .4, pan=.2)
put(tick(True), cue("last_tick")["t"], .7)

# ---- the bed: low strings on D, a semitone creeping in after the shot.
bed_env = [(0, 0), (1.5, .5), (10.4, .6), (10.45, 0), (13.0, 0), (14.5, .5), (26.4, .6), (32.4, .8), (41.6, 1.), (41.61, 0), (45.6, 0), (46.5, .8), (51.5, .5), (52, 0)]
tt = T(E["duration"])
bed = pad([midi(38), midi(45), midi(50)], E["duration"], 700)
bed2 = pad([midi(39), midi(51)], E["duration"], 900)
e1 = np.interp(tt, *zip(*bed_env))
e2 = np.interp(tt, [0, 14, 17, 29.6, 41.6, 41.61, 52], [0, 0, .5, .7, 1, 0, 0])
put(band(bed * e1 * .3 + bed2 * e2 * .15, 70), 0)

# ---- piano: single notes, a long way apart.
for c in cues("piano"):
    f = D3 * (2 ** (c["note"] / 12))
    put_wet(piano(f, 5) + piano(f * 2, 5, .6) + piano(f / 2, 5, .5), c["t"], 1.5, wet=.45, secs=4.0, tone=6000, seed=1)

# ---- the buzz.
raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(root / "public/sfx/found-buzz-1.m4a"),
                      "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
buzz = np.frombuffer(raw, dtype=np.int16).astype(float) / 32768
buzz = band(buzz, 80, 4000)
for c in cues("buzz"):
    put_wet(buzz / max(1e-6, np.abs(buzz).max()), c["t"], .8, wet=.15, secs=.6, seed=2)

# ---- Delhi at night: a far rumble, and horns.
c = cue("city")
secs = c["until"] - c["t"]
rumble = band(noise(secs), 40, 300) * 1.5
fade = np.interp(T(secs), [0, .5, secs - .5, secs], [0, 1, 1, 0])
put(rumble * fade, c["t"], .25)
for i, at in enumerate([.3, .9, 1.25, 1.9, 2.4]):
    d = rng.uniform(.12, .4)
    f = rng.choice([392, 440, 466, 523])
    h = np.sign(np.sin(2 * np.pi * f * T(d))) * .5 + np.sign(np.sin(2 * np.pi * f * 1.26 * T(d))) * .5
    h = band(h, 300, 1800) * env(len(h), .01, 0, 1, .04)
    put_wet(h, c["t"] + at, .07, wet=.7, secs=2.0, tone=2500, seed=3, pan=rng.uniform(-.7, .7))

# ---- the wedding: dhol, crowd, shehnai; through the wall, then in the room.
c = cue("wedding")
a, opened, b = c["t"], c["open"], c["until"]
secs = b - a + .8
wed = np.zeros(int(secs * SR))
beat = 60 / 132 / 2
pattern = "B.tBt.tB" "B.tB.ttB"
s, i = 0.0, 0
while s < b - a:
    ch = pattern[i % len(pattern)]
    if ch != ".":
        j = int((s + rng.uniform(-.006, .006)) * SR)
        x = dhol(ch == "B") * (1 if ch == "B" else .6)
        seg_ = wed[j:j + len(x)]
        seg_ += x[: len(seg_)]
    s += beat
    i += 1
crowd = band(noise(secs), 300, 3000) * (1 + .6 * band(noise(secs), 0, 3))
crowd += band(noise(secs), 2000, 5000) * .3 * (band(noise(secs), 0, 6) > .5)  # whistles and shouts, roughly
mel = shehnai([(62, 0, .6), (63, .55, .4), (65, .9, .8), (67, 1.7, .5), (69, 2.2, 1.1), (67, 3.2, .5), (65, 3.7, .6)], secs)
mix = wed * .9 + crowd * .1 + mel * .9
k = a + np.arange(len(mix)) / SR
openness = np.clip((k - opened + .25) / .3, 0, 1)
wedding = band(mix, 40, 380) * 1.6 * (1 - openness) + mix * openness
wedding[int((b - a) * SR):] = 0
put_wet(wedding, a, .5, wet=.25, secs=1.2, tone=3500, seed=4)
# A rocket, and the crackle of the shells.
t = T(1.0)
rocket = np.sin(2 * np.pi * np.cumsum(900 + 1600 * t) / SR) * env(len(t), .05, 0, 1, .2) * .15 + band(noise(1.0), 2000, 7000) * .1 * t
put_wet(rocket, opened + .05, .4, wet=.4, secs=2.0, seed=5, pan=-.3)
for _ in range(60):
    at = rng.uniform(opened + .3, b - .05)
    p = band(noise(.03), 1500, 8000) * np.exp(-T(.03) * 150)
    put(p, at, rng.uniform(.05, .2), pan=rng.uniform(-.8, .8))

# ---- the shot: a crack, the echo off the buildings, then ringing.
gs = cue("gunshot")["t"]
t = T(.8)
crack = band(noise(.8), 600, 9000) * np.exp(-t * 70) * 1.4 + np.sin(2 * np.pi * 75 * t) * np.exp(-t * 10) + band(noise(.8), 150, 900) * np.exp(-t * 18)
crack = np.tanh(crack * 2)
put_wet(crack, gs, 1.0, wet=.35, secs=3.0, tone=3000, seed=6)
put_wet(band(crack, 200, 2500), gs + .42, .35, wet=.8, secs=3.5, tone=2000, seed=7, pan=.5)
put_wet(band(crack, 200, 1800), gs + .9, .15, wet=.9, secs=3.5, tone=1600, seed=8, pan=-.5)
t = T(2.6)
put(np.sin(2 * np.pi * 3300 * t) * np.interp(t, [0, .05, 1.6, 2.6], [0, 1, .5, 0]), gs + .05, .06)

# ---- hits.
for c in cues("hit"):
    put_wet(tom(70, .4) + tom(48, .2), c["t"], .8, wet=.45, secs=3.0, tone=2500, seed=9)

# ---- dawn: wind, and crows.
c = cue("wind")
secs = c["until"] - c["t"]
w = band(noise(secs), 150, 1200) * (1 + .7 * band(noise(secs), 0, 1.5) * 8)
put(w * np.interp(T(secs), [0, .6, secs - .4, secs], [0, 1, 1, 0]), c["t"], .08)
for at, pan in ((c["t"] + 1.3, -.6), (c["t"] + 1.75, -.55), (c["t"] + 3.0, .5)):
    t = T(.38)
    f0 = 620 * (1 - .25 * t / .38)
    caw = np.sign(np.sin(2 * np.pi * np.cumsum(f0) / SR)) + band(noise(.38), 800, 2500) * .6
    caw = peak(band(caw, 400, 3000), 1300, 2, 2) * env(len(t), .02, .1, .7, .1)
    put_wet(caw, at, .08, wet=.6, secs=2.5, tone=3000, seed=10, pan=pan)

# ---- the door: three knocks, footsteps going away.
t = T(.35)
knock = np.sin(2 * np.pi * 140 * t) * np.exp(-t * 28) + band(noise(.35), 300, 2200) * np.exp(-t * 60) * .9
for i, dt in enumerate((0, .3, .58)):
    put_wet(np.tanh(knock * 1.5), cue("knock")["t"] + dt, .8, wet=.3, secs=.9, tone=3000, seed=11)
for c in cues("step"):
    t = T(.25)
    st = band(noise(.25), 80, 700) * np.exp(-t * 30) + np.sin(2 * np.pi * 90 * t) * np.exp(-t * 25) * .6
    put_wet(st, c["t"], .5 * (1 - c["n"] * .16), wet=.4, secs=.8, tone=2000, seed=12, pan=.15 * c["n"])

# ---- heartbeat under the missed calls.
c = cue("heart")
t, beat = c["t"], 60 / 66
while t < c["until"]:
    for dt, g in ((0, 1), (.28, .6)):
        tb = T(.3)
        hb = np.sin(2 * np.pi * 52 * tb) * np.exp(-tb * 16) * .6 + band(noise(.3), 350, 1300) * np.exp(-tb * 30) * 1.6
        put(np.tanh(hb * 2), t + dt, .9 * g)
    t += beat

# ---- rain on the glass.
c = cue("rain")
secs = c["until"] - c["t"]
rain = band(noise(secs), 1200, 9000) * .3 + band(noise(secs), 200, 1200) * .2
drops = np.zeros(len(rain))
for _ in range(int(secs * 40)):
    j = rng.integers(0, len(rain) - 600)
    drops[j:j + 600] += band(noise(600 / SR), 2000, 8000) * np.exp(-np.arange(600) / 60) * rng.uniform(.2, 1)
put((rain + drops * .6) * np.interp(T(secs), [0, .4, secs - .3, secs], [0, 1, 1, 0]), c["t"], .42)

# ---- strings: an ostinato on D, quiet under the rain, driving the montage.
c = cue("strings")
s0, s1 = c["t"], c["until"]
step_ = 60 / 120 / 4
pat = [0, 0, 12, 0, 1, 0, 12, 0, 0, 0, 12, 0, 3, 1, 0, -2]
t, i = s0, 0
while t < s1 - step_ / 2:
    lvl = np.interp(t, [s0, 29.6, 32.4, s1], [.25, .45, .8, 1.2])
    note = D3 * 2 ** (pat[i % 16] / 12)
    x = string_note(note, step_ * 1.1, 2200 + 1800 * (t - s0) / (s1 - s0))
    put(x, t, lvl * .5, pan=-.25)
    if t > 36:  # violins an octave up, for the last of it
        put(string_note(note * 2, step_ * 1.1, 4000), t, lvl * .25, pan=.3)
    if i % 4 == 0:  # cellos on the beat
        put(string_note(D3 / 2 * 2 ** (pat[i % 16] % 12 / 12 if pat[i % 16] < 12 else 0), step_ * 3.5, 900), t, lvl * .4)
    t += step_
    i += 1

# ---- braams.
put(riser(1.5), cue("braam")["t"] - 1.5, .5)
put_wet(braam(4.5), cue("braam")["t"], .9, wet=.4, secs=4.0, tone=2500, seed=13)

# ---- the montage: a Shepard tone that keeps climbing; something hits on every cut.
c = cue("shepard")
a, b = c["t"], c["until"]
t = T(b - a)
sh = np.zeros(len(t))
for o in range(8):
    pos = (o + t / 5.0) % 8
    sh += np.exp(-((pos - 4) ** 2) / 3) * np.sin(2 * np.pi * np.cumsum(55 * 2 ** pos) / SR)
sh *= np.interp(t, [0, 1, t[-1] - .02, t[-1]], [0, 1, 1.5, 0])
put_wet(band(sh, 150, 6000), a, .2, wet=.3, secs=2.0, seed=14)
for c in cues("cut"):
    k = c["n"]
    put(whoosh(.3), c["t"] - .2, .25, pan=(-.4 if k % 2 else .4))
    put_wet(tom(95 if k % 2 else 70, .7), c["t"], .7, wet=.25, secs=1.5, tone=3000, seed=15)
    put(dhol(True), c["t"] + .06, .5)
    if k > 6:
        put(dhol(False), c["t"] + .1, .35)

# ---- the message.
t = T(1.5)
bell = (np.sin(2 * np.pi * 880 * t) + .35 * np.sin(2 * np.pi * 2640 * t) * np.exp(-t * 4)) * np.exp(-t * 3)
put_wet(bell, cue("ping")["t"], .3, wet=.5, secs=3.0, seed=16)

# ---- the name: the biggest braam, a taiko, a held chord, and the shehnai.
th = cue("title_hit")["t"]
put(riser(1.0), th - 1.0, .45)
put_wet(braam(6.0), th, 1.0, wet=.45, secs=5.0, tone=2500, seed=17)
put_wet(tom(45, .5) * 1.2, th, .9, wet=.5, secs=4.0, tone=2000, seed=18)
chord = pad([midi(50), midi(53), midi(57), midi(62)], 6.0, 1800) * env(int(6.0 * SR), 1.2, 1., .8, 2.5)
put_wet(chord, th + .4, .45, wet=.5, secs=4.0, seed=19)
line = shehnai([(62, 0, .9), (63, .8, .7), (62, 1.5, .5), (60, 2.0, .6), (62, 2.6, 2.0)], 4.8)
put_wet(line, th + 1.2, .75, wet=.5, secs=3.5, tone=6000, seed=20, pan=.1)

# ============================================================================ master
for a, b in E["silence"]:
    i, j = int(a * SR), int(b * SR)
    L[i:j] = 0
    R[i:j] = 0
fade = np.interp(np.arange(N) / SR, [0, .05, E["duration"] - .5, E["duration"]], [0, 1, 1, 0])
L *= fade
R *= fade

# A slow compressor so the quiet half survives a phone speaker next to the
# braams; render.mjs normalises loudness after.
pk = max(np.abs(L).max(), np.abs(R).max())
L, R = L / pk, R / pk
w = int(.06 * SR)
power = np.convolve((L ** 2 + R ** 2) / 2, np.ones(w) / w, mode="same")
level = 10 * np.log10(power + 1e-12)
gain = 10 ** (-np.maximum(0, level + 26) * (1 - 1 / 3.5) / 20)
L, R = np.tanh(L * gain * 2.2), np.tanh(R * gain * 2.2)
pk = max(np.abs(L).max(), np.abs(R).max())
L, R = L / pk * .9, R / pk * .9
with wave.open(str(out), "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes((np.stack([L, R], 1) * 32767).astype(np.int16).tobytes())
print(f"sound → {out}")
