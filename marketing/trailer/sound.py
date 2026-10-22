"""The trailer's sound, cut to edit.json's cues.

    python3 sound.py edit.json out.wav

All of it synthesised here, numpy only, except the buzz, which is the game's
own (public/sfx/found-buzz-1.m4a). The grammar is the modern trailer's: a
watch ticking under everything, a wedding heard through a wall, one shot and
the ringing after it, braams on the words, a Shepard tone that never stops
rising, and a cut to silence before the name.
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
rng = np.random.default_rng(1122)
N = int(E["duration"] * SR)
L = np.zeros(N)
R = np.zeros(N)
cue = {c["sfx"]: c for c in E["cues"]}


def T(sec):
    return np.arange(int(sec * SR)) / SR


def band(x, lo=0, hi=SR / 2, slope=1.0):
    """Zero-phase band-pass in the frequency domain, with soft edges."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo > 0:
        g *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** (4 * slope))
    if hi < SR / 2:
        g *= 1 / (1 + (f / hi) ** (4 * slope))
    return np.fft.irfft(X * g, len(x))


def put(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    j = min(N, i + len(sig))
    s = sig[: j - i] * gain
    L[i:j] += s * np.sqrt((1 - pan) / 2) * 1.414
    R[i:j] += s * np.sqrt((1 + pan) / 2) * 1.414


def reverb(x, secs=3.0, tone=4000, seed=0):
    """A synthetic hall: decaying, darkening noise, convolved by FFT. Returns L, R."""
    r = np.random.default_rng(seed)
    t = T(secs)
    outs = []
    for _ in range(2):
        ir = r.standard_normal(len(t)) * np.exp(-t * 6.9 / secs)
        ir = band(ir, 80, tone)
        ir[: int(.012 * SR)] = 0  # pre-delay
        ir /= np.sqrt((ir ** 2).sum())
        n = len(x) + len(ir)
        outs.append(np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[: len(x) + len(ir) - 1])
    return outs


def put_wet(sig, at, gain, wet=.5, secs=3.0, tone=4000, seed=0):
    put(sig, at, gain * (1 - wet))
    wl, wr = reverb(sig, secs, tone, seed)
    i = int(at * SR)
    for ch, w in ((L, wl), (R, wr)):
        j = min(N, i + len(w))
        if j > i:
            ch[i:j] += w[: j - i] * gain * wet * 6


def adsr(n, a, d, s, r):
    e = np.ones(n) * s
    A, D, Rr = int(a * SR), int(d * SR), int(r * SR)
    e[:A] = np.linspace(0, 1, A)
    e[A:A + D] = np.linspace(1, s, len(e[A:A + D]))
    e[-Rr:] *= np.linspace(1, 0, Rr)
    return e


def saw(freq, t):
    ph = np.cumsum(np.broadcast_to(freq, t.shape)) / SR
    return 2 * (ph % 1) - 1


# ---- the watch -------------------------------------------------------------
def tick(hi):
    t = T(.04)
    click = rng.standard_normal(len(t)) * np.exp(-t * 900)
    ping = np.sin(2 * np.pi * (5200 if hi else 4300) * t) * np.exp(-t * 260)
    return band(click, 1500) * .6 + ping * .5


ticks = []
t, k = cue["tick_start"]["t"], 0
m0, m1 = cue["tick_fast"]["t"], cue["tick_fast"]["until"]
while t < m1:
    ticks.append(t)
    if t < m0:
        t += .5
    else:  # the clock runs away with the montage
        p = (t - m0) / (m1 - m0)
        t += .5 / (1 + p * 5)
for k, t in enumerate(ticks):
    if not any(a <= t < b for a, b in E["silence"]):
        put(tick(k % 2), t, .32, pan=.15)
put(tick(1), E["duration"] - .6, .35)  # one last tick, alone, under the name

# ---- the bed: a low string, and later a second one a semitone away ---------
t = T(E["duration"])
bed = band(saw(55 * (1 + .002 * np.sin(2 * np.pi * .1 * t)), t) + saw(55.3, t), 30, 260)
bed2 = band(saw(58.27, t) + saw(116.5 * 1.003, t) * .5, 30, 320)
env1 = np.interp(t, [0, 2, 10.4, 10.45, 13.8, 31.6, 42.6, 42.61, 46.6, 50, 53], [0, .5, .6, 0, .5, .8, 1, 0, .8, .6, 0])
env2 = np.interp(t, [0, 13.8, 16, 31.6, 42.6, 42.61, 53], [0, 0, .35, .6, .9, 0, 0])
put(bed * env1 * .16 + bed2 * env2 * .12, 0)
air = band(rng.standard_normal(N), 60, 500) * np.interp(t, [0, 16.4, 17, 19, 19.2, 53], [0, 0, 1, 1, 0, 0])
put(air, 0, .35)  # dawn wind

# ---- the buzz -----------------------------------------------------------------
raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(root / "public/sfx/found-buzz-1.m4a"),
                      "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
buzz = np.frombuffer(raw, dtype=np.int16).astype(float) / 32768
for c in E["cues"]:
    if c["sfx"] == "buzz":
        put(band(buzz, 60, 3000), c["t"], .9)

# ---- the wedding, through a wall, then in the room ---------------------------
def dhol(bass=True):
    t = T(.5)
    if bass:
        f = 58 + 70 * np.exp(-t * 18)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) + band(rng.standard_normal(len(t)), 100, 900) * np.exp(-t * 60) * .4
    return (np.sin(2 * np.pi * 420 * t) * .5 + band(rng.standard_normal(len(t)), 900, 4000)) * np.exp(-t * 28)


a, b = cue["dhol_in"]["t"], cue["gunshot"]["t"]
wed = np.zeros(int((b - a + .6) * SR))
beat = 60 / 132 / 2
pattern = "B.tBt.tB" "B.tB.ttB"  # a bhangra-ish chaal, loose
i, s = 0, 0.0
while s < b - a:
    ch = pattern[i % len(pattern)]
    if ch != ".":
        j = max(0, int((s + rng.uniform(-.008, .008)) * SR))
        x = dhol(ch == "B") * (1.0 if ch == "B" else .55)
        seg = wed[j:j + len(x)]
        seg += x[: len(seg)]
    s += beat
    i += 1
# A crowd, and a shehnai somewhere far off: Bhairavi on D, slow.
tw = T(len(wed) / SR)
crowd = band(rng.standard_normal(len(wed)), 300, 2500) * (1 + .5 * band(rng.standard_normal(len(wed)), 0, 4))
notes = [(293.7, .0, .7), (311.1, .7, .5), (349.2, 1.2, .9), (392.0, 2.1, .6), (440.0, 2.7, 1.2), (392.0, 3.9, .5)]
reed = np.zeros(len(wed))
for f0, st, du in notes:
    tt = T(du)
    vib = 1 + .006 * np.sin(2 * np.pi * 5.5 * tt)
    ph = np.cumsum(f0 * vib) / SR
    tone = sum(np.sin(2 * np.pi * h * ph) / h ** .7 for h in range(1, 9))
    seg = tone * adsr(len(tt), .06, .1, .8, .12)
    j = int(st * SR)
    dst = reed[j:j + len(seg)]
    dst += seg[: len(dst)]
reed = band(reed, 500, 3200)
mix = wed * .8 + crowd * .06 + reed * .05
# Through the wall until we're in the room (the dhol shot), then open.
k = (np.arange(len(wed)) / SR) + a
muffled = band(mix, 40, 450)
openness = np.clip((k - 7.4) / .3, 0, 1)
wedding = muffled * (1 - openness) * 1.4 + mix * openness
wedding[int((b - a) * SR):] = 0  # the shot ends the party
put_wet(wedding, a, .32, wet=.3, secs=1.4, tone=3000, seed=1)

# ---- the shot, and the ringing after it --------------------------------------
t = T(.6)
crack = band(rng.standard_normal(len(t)), 700) * np.exp(-t * 90) + np.sin(2 * np.pi * 70 * t) * np.exp(-t * 12) * 1.2
put_wet(crack, cue["gunshot"]["t"], .9, wet=.55, secs=3.5, tone=2500, seed=2)
put_wet(crack, cue["gunshot"]["t"] + .38, .25, wet=.8, secs=3.0, tone=1800, seed=3)  # back off the buildings
t = T(3.4)
put(np.sin(2 * np.pi * 3900 * t) * np.interp(t, [0, .1, 2.2, 3.4], [0, 1, .6, 0]), cue["gunshot"]["t"] + .05, .05)


# ---- hits and braams ------------------------------------------------------------
def boom(secs=2.5, f0=44):
    t = T(secs)
    f = f0 + 30 * np.exp(-t * 9)
    return np.tanh(1.6 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 1.7) + band(rng.standard_normal(len(t)), 40, 300) * np.exp(-t * 4) * .8


def braam(secs=4.0):
    t = T(secs)
    v = sum(saw(f * (1 + d), t) for f in (41.2, 82.4, 123.5, 61.7) for d in (-.004, 0, .005))
    cutoff_env = np.interp(t, [0, .12, secs], [1, 0.0, 0])
    lo = band(v, 25, 220)
    hi = band(v, 25, 1800)
    x = lo + (hi - lo) * np.clip(cutoff_env * 1.5 + .25 * np.exp(-t * 1.2), 0, 1)
    return np.tanh(x * .35) * adsr(len(t), .02, .4, .7, 2.0) + boom(secs, 38) * .7


def riser(secs=1.2):
    """A reversed swell into the hit."""
    t = T(secs)
    x = band(rng.standard_normal(len(t)), 200, 6000)
    wl, _ = reverb(x * np.exp(-t * 8), secs * 1.5, 5000, 9)
    return wl[: len(t)][::-1] * 4


put_wet(boom(), cue["hit"]["t"], .6, wet=.4, secs=3.0, tone=1200, seed=4)
put(riser(1.4), cue["braam"]["t"] - 1.4, .25)
put_wet(braam(4.5), cue["braam"]["t"], .7, wet=.45, secs=4.0, tone=2000, seed=5)
put(riser(1.6), cue["title_hit"]["t"] - 1.6, .3)
put_wet(braam(6.0), cue["title_hit"]["t"], .9, wet=.5, secs=5.0, tone=2200, seed=6)

# ---- the montage: a Shepard tone that keeps climbing, and dhol on every cut ----
a, b = cue["shepard"]["t"], cue["shepard"]["until"]
t = T(b - a)
rate = 1 / 6.0  # octaves per second
sh = np.zeros(len(t))
for o in range(8):
    pos = (o + t * rate) % 8
    f = 40 * 2 ** pos
    amp = np.exp(-((pos - 4) ** 2) / 3)
    sh += amp * np.sin(2 * np.pi * np.cumsum(f) / SR)
trem = 1 - .35 * (np.sin(2 * np.pi * (6 + t * 2) * t) > 0)
sh *= np.interp(t, [0, 1.5, len(t) / SR - .02, len(t) / SR], [0, 1, 1.4, 0]) * trem
put_wet(band(sh, 60, 5000), a, .12, wet=.35, secs=2.0, seed=7)
for s in E["shots"]:
    if a <= s["t0"] < b:
        put(dhol(True), s["t0"], .45)
        if s["t1"] - s["t0"] < .5:
            put(dhol(False), s["t0"] + (s["t1"] - s["t0"]) / 2, .25)

# ---- the knock, the message, the end --------------------------------------------
t = T(.3)
knock = np.sin(2 * np.pi * 150 * t) * np.exp(-t * 30) + band(rng.standard_normal(len(t)), 200, 1800) * np.exp(-t * 70) * .6
for k in (0, .32, .62):
    put_wet(knock, cue["knock"]["t"] + k, .45, wet=.35, secs=.8, tone=2500, seed=8)
t = T(1.2)
ping = (np.sin(2 * np.pi * 880 * t) + .4 * np.sin(2 * np.pi * 1320 * t)) * np.exp(-t * 6)
put_wet(ping, cue["ping"]["t"], .12, wet=.5, secs=2.5, seed=10)

# Hard silence where the edit asks for it.
for a, b in E["silence"]:
    i, j = int(a * SR), int(b * SR)
    L[i:j] = 0
    R[i:j] = 0
fade = np.interp(np.arange(N) / SR, [0, E["duration"] - .4, E["duration"]], [1, 1, 0])
L *= fade
R *= fade

# A slow compressor, so the quiet half survives a phone speaker next to the
# braams, then a soft limit.
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak, R / peak
w = int(.08 * SR)
power = np.convolve((L ** 2 + R ** 2) / 2, np.ones(w) / w, mode="same")
level = 10 * np.log10(power + 1e-12)
gain = 10 ** (-np.maximum(0, level + 30) * (1 - 1 / 4) / 20)
L, R = np.tanh(L * gain * 1.6), np.tanh(R * gain * 1.6)
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * .93, R / peak * .93
with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.stack([L, R], 1) * 32767).astype(np.int16).tobytes())
print(f"sound → {out}")
