"""The trailer's score and sound, cut to edit.json's cues.

    python3 sound.py edit.json out.wav

Everything is synthesised here with numpy except the buzz, which is the
game's own (public/sfx/found-buzz-1.m4a).

The spine is one tune. A baraat's band baaja plays it in Khamaj, bright and
a little out of tune, over dhol and jhanj, until the shot cuts it dead. After,
it comes back slow on a harmonium in Bhairavi (the same notes, flattened)
over a tanpura, and its last phrase ends the trailer under the name. Between:
a watch, a heartbeat, rain, a dhol-tasha that runs away with the montage,
braams on the turns, silence before the message.

Phone speakers play almost nothing below 200 Hz, so every low thing here
also has a voice in the midrange. render.mjs loudness-normalises the result.
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
    return np.fft.irfft(X * (1 + gain * np.exp(-((f - fc) / (fc / q)) ** 2)), len(x))


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


def mixin(buf, x, at, gain=1.0):
    """Adds x into buf at `at` seconds, clipped to buf."""
    j = int(at * SR)
    if 0 <= j < len(buf):
        dst = buf[j:j + len(x)]
        dst += x[: len(dst)] * gain


def env(n, a, d, s, r):
    e = np.full(n, s, float)
    A, Dd, Rr = min(int(a * SR), n), int(d * SR), max(1, min(int(r * SR), n))
    e[:A] = np.linspace(0, 1, A)
    k = min(n, A + Dd)
    e[A:k] = np.linspace(1, s, k - A)
    e[-Rr:] *= np.linspace(1, 0, Rr)
    return e


def saw(freq, n):
    ph = np.cumsum(np.broadcast_to(np.asarray(freq, float), (n,))) / SR
    return 2 * (ph % 1) - 1


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


def silent_at(t):
    return any(a <= t < b for a, b in E["silence"])


# ============================================================================ instruments

def brass(f, secs, vel=1.0, detune=0.0):
    """A band-baaja trumpet: scoops up into the note, brighter as it's blown
    harder, a late vibrato, and breath."""
    t = T(secs)
    e = env(len(t), .03, .08, .8, .06) * vel
    pitch = f * 2 ** (detune / 1200) * (1 - .035 * np.exp(-t * 22)) * (1 + .006 * np.sin(2 * np.pi * 5.6 * t) * np.clip(t * 3 - .3, 0, 1))
    ph = np.cumsum(pitch) / SR
    x = sum(np.sin(2 * np.pi * h * ph) * e ** (1 + .22 * h) / h ** .7 for h in range(1, 18) if f * h < 9000)
    x += band(noise(secs), 1200, 5000) * e * .02
    return np.tanh(x * .8)


def clarinet(f, secs, vel=1.0):
    t = T(secs)
    e = env(len(t), .02, .05, .85, .05) * vel
    ph = np.cumsum(f * (1 + .004 * np.sin(2 * np.pi * 5 * t))) / SR
    return sum(np.sin(2 * np.pi * h * ph) * (1 / h if h % 2 else .15 / h) for h in range(1, 14)) * e


def tuba(f, secs):
    t = T(secs)
    e = env(len(t), .015, .1, .5, .05)
    ph = f * t
    return sum(np.sin(2 * np.pi * h * ph) * e ** (1 + .3 * h) / h for h in range(1, 9))


def harmonium(f, secs, vel=1.0):
    """Two reeds a little apart, bellows breathing, the nasal middle of it."""
    t = T(secs)
    e = env(len(t), .09, .1, .9, .18) * vel * (1 + .03 * np.sin(2 * np.pi * 4.7 * t))
    x = np.zeros(len(t))
    for det in (0, 2.6):
        ph = f * 2 ** (det / 1200) * t
        x += sum(np.sin(2 * np.pi * h * ph + h) / h ** .85 for h in range(1, 22) if f * h < 11000)
    return peak(band(x * e, 120, 7000), 1400, 2.5, 1.2) * .5


def tanpura(f, secs=3.4):
    """A plucked drone string; the jawari makes its upper partials bloom after the pluck."""
    t = T(secs)
    x = np.zeros(len(t))
    for h in range(1, 30):
        if f * h > 10000:
            break
        bloom = 1 + 2.5 * (1 - np.exp(-t * 2.5)) * (1 / (1 + np.exp(-(h - 7))))
        x += np.sin(2 * np.pi * f * h * t * (1 + .0004 * h) + h * 1.7) / h * np.exp(-t * (.45 + .04 * h)) * bloom
    x[:200] *= np.linspace(0, 1, 200)
    return x * .15


def piano(f, secs=5.0, vel=1.0):
    t = T(secs)
    x = np.zeros(len(t))
    for n in range(1, 15):
        fn = f * n * np.sqrt(1 + .00035 * n * n)
        if fn > 9000:
            break
        for det in (-.0004, .0004):
            x += (1 / n ** 1.15) * np.sin(2 * np.pi * fn * (1 + det) * t + n) * np.exp(-t * (.45 + .32 * n))
    x[: int(.02 * SR)] += band(noise(.02), 800, 5000) * np.exp(-T(.02) * 300) * .4
    return x * env(len(t), .002, 0, 1, .3) * vel * .25


def string_note(f, secs, bright=2600):
    n = int(secs * SR)
    x = sum(saw(f * (1 + d), n) for d in (-.0035, 0, .004))
    return band(x, 90, bright) * env(n, .005, .07, .35, .04) / 3


def string_pad(freqs, secs, bright=1800):
    n = int(secs * SR)
    t = T(secs)
    x = sum(saw(f * (1 + d) * (1 + .003 * np.sin(2 * np.pi * 5 * t + k)), n) for k, f in enumerate(freqs) for d in (-.003, .003))
    return band(x, 120, bright) / (2 * len(freqs))


def tom(f0=95, click=.6):
    t = T(1.2)
    f = f0 * (1 + 1.2 * np.exp(-t * 30))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5)
    return np.tanh((body + band(noise(1.2), 900, 5000) * np.exp(-t * 60) * click) * 1.4)


def dhol(bass=True):
    t = T(.6)
    if bass:
        f = 62 + 85 * np.exp(-t * 16)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6)
        x += np.sin(2 * np.pi * np.cumsum(f * 2.9) / SR) * np.exp(-t * 14) * .35
        x += band(noise(.6), 200, 1500) * np.exp(-t * 50) * .5
        return np.tanh(x * 1.5)
    return (np.sin(2 * np.pi * 440 * t) * np.exp(-t * 30) * .6 + band(noise(.6), 1200, 6000) * np.exp(-t * 35)) * .8


def tasha():
    """The tasha's crack: a tight, high skin."""
    t = T(.18)
    return (band(noise(.18), 1800, 7000) * np.exp(-t * 45) + np.sin(2 * np.pi * 620 * t) * np.exp(-t * 60) * .5) * .7


def jhanj():
    t = T(.35)
    return band(noise(.35), 5000, 14000) * np.exp(-t * 14) * .5


def braam(secs=5.0, root=38.89):
    n = int(secs * SR)
    t = T(secs)
    v = sum(saw(f * (1 + d), n) for f in (root, root * 2, root * 3, root * 4, root * 4.76) for d in (-.005, 0, .006))
    opened, closed = band(v, 30, 2400), band(v, 30, 380)
    x = closed + (opened - closed) * np.clip(np.exp(-t * 2.2) * 1.2, 0, 1)
    x = peak(np.tanh(x * .9), 520, 2.5, 1.2) * env(n, .015, .5, .7, 2.5)
    return x * .55 + np.sin(2 * np.pi * root * t) * np.exp(-t * .9) * .5


def riser(secs):
    t = T(secs)
    x = band(noise(secs), 500, 9000) * (t / secs) ** 3
    return x * .5 + np.sin(2 * np.pi * np.cumsum(300 + 1800 * (t / secs) ** 2) / SR) * (t / secs) ** 2 * .15


def whoosh(secs=.35):
    t = T(secs)
    x = noise(secs)
    k = t / secs
    return (band(x, 200, 900) * (1 - k) + band(x, 1500, 6000) * k) * np.sin(np.pi * k) ** 2


def tick(hi=True):
    t = T(.05)
    return band(noise(.05), 2000, 9000) * np.exp(-t * 900) * .7 + np.sin(2 * np.pi * (5200 if hi else 4300) * t) * np.exp(-t * 220) * .6


def hit(big=1.0):
    """A trailer hit: sub, a body you can hear on a phone, a crack on top."""
    t = T(2.5)
    f = 46 + 40 * np.exp(-t * 9)
    x = np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 1.8)
    x += band(noise(2.5), 150, 900) * np.exp(-t * 7) * .9 + band(noise(2.5), 2000, 8000) * np.exp(-t * 40) * .5
    return x * big


# ============================================================================ the tune
# Semitones from D4 and beats. Khamaj at the wedding; Bhairavi after.
TUNE = [(7, .5), (7, .5), (9, .5), (7, .5), (5, 1), (4, .5), (2, .5), (4, 1), (5, .5), (5, .5), (7, .5), (5, .5), (4, 1), (2, .5), (0, 1.5)]
BHAIRAVI = {9: 8, 4: 3, 2: 1, 11: 10}
D4 = 62

# ============================================================================ the cut

raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(root / "public/sfx/found-buzz-1.m4a"),
                      "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
buzz = band(np.frombuffer(raw, dtype=np.int16).astype(float) / 32768, 80, 4000)
buzz /= max(1e-6, np.abs(buzz).max())

# ---- the watch: steady through the quiet parts, running away with the montage.
m0, m1 = cue("tick_fast")["t"], cue("tick_fast")["until"]
band_cue = cue("band")
after = cues("hit")[0]["t"]
times, t = [], 0.0
while t < m1:
    times.append(t)
    t += .5 if t < m0 else .5 / (1 + 5 * (t - m0) / (m1 - m0))
for k, t in enumerate(times):
    if not silent_at(t) and not (band_cue["t"] <= t < after):
        put(tick(k % 2 == 0), t, .5 if t < m0 else .4, pan=.2)
put(tick(True), cue("last_tick")["t"], .7)

# ---- the buzz, and the hook landing.
for c in cues("buzz"):
    put_wet(buzz, c["t"], 1.6, wet=.12, secs=.6, seed=2)
h = cue("hook_hit")["t"]
put(riser(.4), h - .4, .35)
put_wet(hit(.8), h, 1.3, wet=.35, secs=2.5, tone=3000, seed=3)
put_wet(piano(midi(50), 4) + piano(midi(62), 4, .6), h, 1.4, wet=.45, secs=4.0, tone=6000, seed=1)

# ---- Delhi, and the street: far traffic, horns; rain on the road.
for c in cues("city") + cues("street"):
    secs = c["until"] - c["t"]
    rumble = band(noise(secs), 40, 300) * 1.5 + band(noise(secs), 300, 2500) * .3
    put(rumble * np.interp(T(secs), [0, .4, secs - .4, secs], [0, 1, 1, 0]), c["t"], .28)
    ats = np.arange(.25, secs - .25, .5)
    for at in ats + rng.uniform(-.15, .15, len(ats)):
        d = rng.uniform(.12, .45)
        f = rng.choice([392, 440, 466, 523, 587])
        hn = np.sign(np.sin(2 * np.pi * f * T(d))) * .5 + np.sign(np.sin(2 * np.pi * f * 1.26 * T(d))) * .5
        put_wet(band(hn, 300, 2200) * env(len(hn), .01, 0, 1, .04), c["t"] + at, .09, wet=.6, secs=2.0, tone=2500, seed=4, pan=rng.uniform(-.7, .7))
    if c["sfx"] == "street":
        put(band(noise(secs), 1500, 9000) * .35 * np.interp(T(secs), [0, .3, secs - .2, secs], [0, 1, 1, 0]), c["t"], .4)

# ---- the baraat: band baaja, through a wall under Delhi, then in the street. The shot ends it.
a, opened, gun = band_cue["t"], band_cue["open"], band_cue["until"]
beat = 60 / 132
secs = gun - a
nb = int(secs * SR)
lead = np.zeros(nb)
t = 0.0
while t < secs:
    for semi, b in TUNE:
        if t >= secs:
            break
        f = midi(D4 + semi)
        d = b * beat
        for det, g in ((0, 1.0), (16, .8)):  # two trumpets, never quite together
            mixin(lead, brass(f, d * .95, 1.0, det), t + rng.uniform(0, .015), g)
        mixin(lead, clarinet(f * 2, d * .9, .35), t)
        t += d
rhythm = np.zeros(nb)
k, t = 0, 0.0
while t < secs:
    bass = midi(38) if (k // 2) % 2 == 0 else midi(33)
    mixin(rhythm, tuba(bass, beat * .45), t, .9)
    mixin(rhythm, dhol(True), t, 1.0)
    mixin(rhythm, dhol(False), t + beat / 2, .7)
    mixin(rhythm, jhanj(), t + beat / 2, .6)
    if k % 4 == 3:
        mixin(rhythm, dhol(False), t + beat * .75, .5)
    t += beat
    k += 1
crowd = band(noise(secs), 300, 3000) * (1 + .6 * band(noise(secs), 0, 3))
bandmix = lead * .28 + rhythm * .55 + crowd * .06
tt = a + np.arange(nb) / SR
openness = np.clip((tt - opened + .15) / .25, 0, 1)
bandmix = band(bandmix, 60, 500) * .65 * (1 - openness) + bandmix * openness
put_wet(bandmix, a, 2.6, wet=.2, secs=1.5, tone=4000, seed=5)
# Fireworks: a whump and crackle over the last of it.
cr = cue("crackle")
for _ in range(70):
    put(band(noise(.03), 1500, 8000) * np.exp(-T(.03) * 150), rng.uniform(cr["t"], cr["until"] - .03), rng.uniform(.08, .3), pan=rng.uniform(-.8, .8))
put_wet(band(noise(.6), 300, 2000) * np.exp(-T(.6) * 6) + np.sin(2 * np.pi * 70 * T(.6)) * np.exp(-T(.6) * 8), cr["t"] + .05, .5, wet=.5, secs=2.5, seed=6)

# ---- the shot: a crack, the echo off the buildings, then only ringing.
t = T(.8)
crack = np.tanh((band(noise(.8), 600, 9000) * np.exp(-t * 70) * 1.4 + np.sin(2 * np.pi * 75 * t) * np.exp(-t * 10) + band(noise(.8), 150, 900) * np.exp(-t * 18)) * 2.2)
put_wet(crack, gun, 1.0, wet=.35, secs=3.0, tone=3000, seed=7)
put_wet(band(crack, 200, 2500), gun + .42, .35, wet=.8, secs=3.5, tone=2000, seed=8, pan=.5)
put_wet(band(crack, 200, 1800), gun + .9, .15, wet=.9, secs=3.5, tone=1600, seed=9, pan=-.5)
t = T(2.4)
put(np.sin(2 * np.pi * 3300 * t) * np.interp(t, [0, .05, 1.5, 2.4], [0, 1, .5, 0]), gun + .05, .07)

# ---- hits.
for c in cues("hit"):
    put_wet(hit(), c["t"], .85, wet=.4, secs=3.0, tone=2500, seed=10)
for c in cues("soft_hit"):
    put_wet(hit(.5), c["t"], .6, wet=.5, secs=3.0, tone=2000, seed=11)

# ---- morning: wind, the tanpura, and the tune again on a harmonium, in Bhairavi.
c = cue("wind")
secs = c["until"] - c["t"]
put(band(noise(secs), 150, 1200) * (1 + .7 * band(noise(secs), 0, 1.5) * 8) * np.interp(T(secs), [0, .6, secs - .4, secs], [0, 1, 1, 0]), c["t"], .07)
c = cue("tanpura")
t, k = c["t"], 0
cycle = [(midi(45), .3), (midi(50), .25), (midi(50), .25), (midi(38), .35)]
while t < c["until"] - .5:
    f, g = cycle[k % 4]
    put_wet(tanpura(f), t, g * .5, wet=.4, secs=3.0, tone=5000, seed=12, pan=-.2)
    t += 1.05
    k += 1
c = cue("harmonium")
beat = 60 / 66
t = c["t"] + .2
for semi, b in TUNE:
    d = b * beat
    if t + d > c["until"]:
        break
    put_wet(harmonium(midi(D4 + BHAIRAVI.get(semi, semi)), d * 1.02, .9), t, .2, wet=.45, secs=3.0, tone=6000, seed=13, pan=.15)
    t += d
dur = c["until"] - c["t"]
put_wet(harmonium(midi(50), dur, .5) + harmonium(midi(57), dur, .4), c["t"], .08, wet=.4, secs=3.0, seed=14)

# ---- the door.
t = T(.35)
knock = np.tanh((np.sin(2 * np.pi * 140 * t) * np.exp(-t * 28) + band(noise(.35), 300, 2200) * np.exp(-t * 60) * .9) * 1.5)
for dt in (0, .28, .54):
    put_wet(knock, cue("knock")["t"] + dt, .9, wet=.3, secs=.9, tone=3000, seed=15)

# ---- the heartbeat.
c = cue("heart")
t = c["t"]
while t < c["until"]:
    for dt, g in ((0, 1), (.28, .6)):
        tb = T(.3)
        hb = np.sin(2 * np.pi * 52 * tb) * np.exp(-tb * 16) * .6 + band(noise(.3), 350, 1300) * np.exp(-tb * 30) * 1.6
        put(np.tanh(hb * 2), t + dt, 1.2 * g)
    t += 60 / 70

# ---- rain on the glass, and the strings drawing breath under it.
c = cue("rain")
secs = c["until"] - c["t"]
rain = band(noise(secs), 1200, 9000) * .3 + band(noise(secs), 200, 1200) * .2
drops = np.zeros(len(rain))
for _ in range(int(secs * 40)):
    mixin(drops, band(noise(600 / SR), 2000, 8000) * np.exp(-np.arange(600) / 60), rng.uniform(0, secs - .02), rng.uniform(.2, 1))
put((rain + drops * .6) * np.interp(T(secs), [0, .4, secs - .3, secs], [0, 1, 1, 0]), c["t"], .6)
put(string_pad([midi(50), midi(51), midi(57)], secs + .3) * np.interp(T(secs + .3), [0, secs, secs + .3], [0, 1, 0]), c["t"], .5)

# ---- the turn.
b0 = cue("braam")["t"]
put(riser(1.2), b0 - 1.2, .5)
put_wet(braam(4.5), b0, .95, wet=.4, secs=4.0, tone=2500, seed=16)

# ---- the montage: strings, a Shepard tone, and a dhol-tasha that keeps speeding up.
c = cue("strings")
s0, s1 = c["t"], c["until"]
step_ = 60 / 120 / 4
pat = [0, 0, 12, 0, 1, 0, 12, 0, 0, 0, 12, 0, 3, 1, 0, -2]
t, i = s0, 0
D3 = midi(50)
while t < s1 - step_ / 2:
    lvl = np.interp(t, [s0, s1], [.7, 1.2])
    note = D3 * 2 ** (pat[i % 16] / 12)
    put(string_note(note, step_ * 1.1, 2400 + 1800 * (t - s0) / (s1 - s0)), t, lvl * .5, pan=-.25)
    if t > s0 + 3:
        put(string_note(note * 2, step_ * 1.1, 4000), t, lvl * .25, pan=.3)
    if i % 4 == 0:
        put(string_note(D3 / 2, step_ * 3.5, 900), t, lvl * .4)
    t += step_
    i += 1
c = cue("shepard")
a, b = c["t"], c["until"]
t = T(b - a)
sh = np.zeros(len(t))
for o in range(8):
    pos = (o + t / 5.0) % 8
    sh += np.exp(-((pos - 4) ** 2) / 3) * np.sin(2 * np.pi * np.cumsum(55 * 2 ** pos) / SR)
sh *= np.interp(t, [0, 1, t[-1] - .02, t[-1]], [0, 1, 1.5, 0])
put_wet(band(sh, 150, 6000), a, .18, wet=.3, secs=2.0, seed=17)
c = cue("drums")
a, b = c["t"], c["until"]
t, k = a, 0
while t < b:
    p = (t - a) / (b - a)
    if k % 4 == 0:
        put(dhol(True), t, .7)
    elif k % 4 == 2:
        put(dhol(False), t, .5)
    put(tasha(), t, (.25 + .35 * p) * (1 if k % 2 == 0 else .6), pan=.3)
    t += (60 / (110 + 110 * p)) / 4
    k += 1
for c in cues("cut"):
    put(whoosh(.3), c["t"] - .2, .25, pan=(-.4 if c["n"] % 2 else .4))
    put_wet(tom(95 if c["n"] % 2 else 70, .7), c["t"], .7, wet=.25, secs=1.5, tone=3000, seed=18)

# ---- "4. Nitin —", typed; everything else has stopped but one high note.
c = cue("typing")
for k in range(c["n"]):
    put(band(noise(.03), 1500, 6000) * np.exp(-T(.03) * 200), c["t"] + k * .045 + rng.uniform(0, .01), .35)
put(string_note(midi(81), 1.0, 6000) * np.linspace(1, 0, int(1.0 * SR)) * 3, c["t"], .2)

# ---- the message.
t = T(1.5)
bell = (np.sin(2 * np.pi * 880 * t) + .35 * np.sin(2 * np.pi * 2640 * t) * np.exp(-t * 4)) * np.exp(-t * 3)
put_wet(bell, cue("ping")["t"], .35, wet=.5, secs=3.0, seed=19)

# ---- the name: the biggest hit, a taiko, and the tune's last phrase on the harmonium.
th = cue("title_hit")["t"]
put(riser(1.0), th - 1.0, .45)
put_wet(braam(6.0), th, 1.0, wet=.45, secs=5.0, tone=2500, seed=20)
put_wet(tom(45, .5) * 1.2, th, .9, wet=.5, secs=4.0, tone=2000, seed=21)
put(dhol(True), th, .9)
t0 = t = cue("harmonium_end")["t"]
for semi, b in ((7, 1), (5, .5), (3, .5), (1, 1), (0, 2.6)):
    put_wet(harmonium(midi(D4 + semi), b * .95 * 1.02, .9), t, .3, wet=.5, secs=3.5, tone=6000, seed=22)
    t += b * .95
put_wet(harmonium(midi(50), 5.0, .5) + tanpura(midi(38), 5.0), t0, .12, wet=.5, secs=3.5, seed=23)
put_wet(buzz, cue("end_buzz")["t"], 1.0, wet=.3, secs=1.2, seed=24)

# ============================================================================ master
for a, b in E["silence"]:
    i, j = int(a * SR), int(b * SR)
    L[i:j] = 0
    R[i:j] = 0
fade = np.interp(np.arange(N) / SR, [0, .03, E["duration"] - .3, E["duration"]], [0, 1, 1, 0])
L *= fade
R *= fade

# A slow compressor so the quiet half survives a phone speaker; a soft limit.
pk = max(np.abs(L).max(), np.abs(R).max())
L, R = L / pk, R / pk
w = int(.06 * SR)
power = np.convolve((L ** 2 + R ** 2) / 2, np.ones(w) / w, mode="same")
level = 10 * np.log10(power + 1e-12)
gain = 10 ** (-np.maximum(0, level + 24) * (1 - 1 / 3) / 20)
L, R = np.tanh(L * gain * 2.0), np.tanh(R * gain * 2.0)
pk = max(np.abs(L).max(), np.abs(R).max())
L, R = L / pk * .9, R / pk * .9
with wave.open(str(out), "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes((np.stack([L, R], 1) * 32767).astype(np.int16).tobytes())
print(f"sound → {out}")
