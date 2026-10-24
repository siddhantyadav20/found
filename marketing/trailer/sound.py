"""The trailer's score and sound, cut to edit.json's cues.

    python3 sound.py edit.json out.wav

No voices: the score carries it, and changes with the picture, on one
four-note motif (A, D, F, E).

  I.   Lights out. Room tone; a bulb's hum, then its switch. A phone buzzes on
       a table of letters and a felt piano plays the motif alone over a cold
       drone. Typewriter keys under the words.
  II.  The night. 100 bpm on a match strike: a shehnai takes the motif over a
       dhol, claps and strings, in D Bhairavi, going double time with the
       cuts. It stops dead for the reel; one shot; ringing.
  III. After. No tempo: long held notes, the piano slower, wind, a torch
       clicking on, footsteps on gravel, a jerrycan, the game's fire, a candle
       blown out. A low braam on the words.
  IV.  Putting it together. 120 bpm: a clock, a cello ostinato and taikos,
       a heartbeat under the three frames, rising; then one tick under the
       last words, and the whole orchestra on the name.

The game's own buzz, gunshot and fire (public/sfx) are used where they
happen; everything else is synthesised here with numpy, and sent to three
convolution reverbs (a room, a hall, a cathedral) rendered once at the end.
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
BUS = {k: (np.zeros(N), np.zeros(N)) for k in ("room", "hall", "cathedral")}


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
    if len(x) == 0:
        return x
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo > 0:
        g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order))
    if hi < SR / 2:
        g *= 1 / np.sqrt(1 + (f / hi) ** (2 * order))
    return np.fft.irfft(X * g, len(x))


def peak(x, fc, q, gain):
    """A resonant bump at fc (a formant, a body), added to x."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X * (1 + gain * np.exp(-((f - fc) / (fc / q)) ** 2)), len(x))


def put(sig, at, gain=1.0, pan=0.0, bus=None, wet=.3, dry=1.0):
    """Into the mix at `at` seconds, panned, and `wet` of it into a reverb."""
    i = int(round(at * SR))
    if i >= N or len(sig) == 0:
        return
    if i < 0:
        sig, i = sig[-i:], 0
    j = min(N, i + len(sig))
    s = sig[: j - i] * gain
    gl, gr = np.sqrt((1 - pan) / 2) * 1.414, np.sqrt((1 + pan) / 2) * 1.414
    L[i:j] += s * gl * dry
    R[i:j] += s * gr * dry
    if bus:
        BUS[bus][0][i:j] += s * gl * wet
        BUS[bus][1][i:j] += s * gr * wet


def mixin(buf, x, at, gain=1.0):
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


def fade(n, a, r):
    """An envelope that rises over a seconds and falls over the last r."""
    t = np.arange(n) / SR
    return np.clip(t / max(a, 1e-3), 0, 1) * np.clip((n / SR - t) / max(r, 1e-3), 0, 1)


def saw(freq, n, phase=0.0):
    ph = np.cumsum(np.broadcast_to(np.asarray(freq, float), (n,))) / SR + phase
    return 2 * (ph % 1) - 1


def midi(m):
    return 440 * 2 ** ((m - 69) / 12)


def load(path):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(path), "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(float) / 32768


def sample(name, k=1):
    return load(root / "public/sfx" / f"found-{name}-{k}.m4a")


# ============================================================================ instruments

def piano(f, secs=6.0, vel=.7, felt=.6):
    """A felt piano: three strings a hair apart, partials stretched as a real
    string's are, the hammer's position notching them, the felt taking the top
    off; a fast first decay and a long aftersound."""
    t = T(secs)
    x = np.zeros(len(t))
    B = .00028
    slow = (262 / f) ** .45
    for n in range(1, 26):
        fn = f * n * np.sqrt(1 + B * n * n)
        if fn > 11000:
            break
        a = abs(np.sin(np.pi * n * .12)) / n ** .9 * np.exp(-n * felt * .28 * (1.25 - vel))
        dec = (.55 + .2 * n ** 1.15) / slow
        shape = .72 * np.exp(-t * dec * 1.5) + .28 * np.exp(-t * dec * .22)
        for det in (-.00018, 0, .00022):
            x += a / 3 * np.sin(2 * np.pi * fn * (1 + det) * t + rng.uniform(0, 6.28)) * shape
    k = int(.04 * SR)
    x[:k] += band(noise(.04), 60, 700) * np.exp(-T(.04) * 120) * .25 * vel
    return x * env(len(t), .004, 0, 1, .25) * vel * .32


def strings(freqs, secs, att=.8, rel=1.2, bright=2600, vib=1.0, voices=5, lo=80):
    """A string section: each note several players, each a little out of tune
    and with their own vibrato, coming in late; then the section's body."""
    n = int(secs * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for _ in range(voices):
            det = 2 ** (rng.uniform(-7, 7) / 1200)
            rate, ph = rng.uniform(4.6, 5.8), rng.uniform(0, 6.28)
            depth = 2 ** (vib * 9 / 1200 * np.sin(2 * np.pi * rate * t + ph) * np.clip(t / .6, 0, 1)) - 1
            x += saw(f * det * (1 + depth), n, rng.uniform(0, 1))
    x = band(x, lo, bright)
    x = peak(peak(peak(x, 320, 2.5, .6), 1100, 3, .35), 2900, 3, .4)
    return x * fade(n, att, rel) / (len(freqs) * voices) ** .5 * .35


def cello(f, secs, vel=1.0, bright=1900):
    """One spiccato stroke: bite, then the string ringing off."""
    n = int(secs * SR)
    x = sum(saw(f * 2 ** (d / 1200), n, rng.uniform(0, 1)) for d in (-6, 0, 7)) / 3
    x = band(x, 55, bright * (.6 + .5 * vel))
    x = peak(x, 250, 2, .7)
    x += band(noise(secs), 1500, 6000) * np.exp(-T(secs) * 60) * .08
    return x * env(n, .006, .1, .45, .05) * vel


def choir(freqs, secs, att=1.2, rel=1.5):
    """Voices on "aah": saw stacks through the vowel's formants."""
    n = int(secs * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for _ in range(4):
            vib = 2 ** (6 / 1200 * np.sin(2 * np.pi * rng.uniform(4.5, 5.5) * t + rng.uniform(0, 6))) * 2 ** (rng.uniform(-9, 9) / 1200)
            x += saw(f * vib, n, rng.uniform(0, 1))
    x = band(x, 150, 4500)
    x = peak(peak(peak(x, 760, 4, 3.5), 1180, 5, 2.2), 2700, 6, 1.5)
    return x * fade(n, att, rel) / (len(freqs) * 4) ** .5 * .12


def shehnai(notes, beat):
    """A shehnai phrase, all one breath: each note glides in from the last
    (meend), a grace note above some (kan), vibrato that blooms as it's held;
    a reed's buzz through its bell's formants."""
    total = sum(b for _, b, *_ in notes) * beat
    n = int(total * SR) + int(.3 * SR)
    f = np.zeros(n)
    a = np.zeros(n)
    t0, prev = 0.0, None
    for m, b, *opt in notes:
        d = b * beat
        i0, i1 = int(t0 * SR), int((t0 + d) * SR)
        tt = np.arange(i1 - i0) / SR
        target = midi(m)
        cents = 17 * np.clip((tt - .2) / .35, 0, 1) * np.sin(2 * np.pi * 6.1 * tt)
        p = np.full(len(tt), target)
        if "kan" in opt:
            p[: int(.06 * SR)] = midi(m + 2)
        if prev is not None:
            g = min(len(tt), int(.075 * SR))
            p[:g] = prev * (target / prev) ** np.linspace(0, 1, g) ** .7
        f[i0:i1] = p * 2 ** (cents / 1200)
        art = np.clip(tt / .03, .55, 1) * (1 - .25 * np.clip((tt - d + .04) / .04, 0, 1))
        a[i0:i1] = art * (1 - .12 * np.clip(tt / max(d, .1), 0, 1))
        t0, prev = t0 + d, target
    f[int(total * SR):] = f[int(total * SR) - 1]
    a[int(total * SR):] = 0
    a[-int(.3 * SR):] = 0
    a = np.convolve(a, np.ones(240) / 240, mode="same")
    ph = np.cumsum(f) / SR
    x = np.zeros(n)
    for h in range(1, 32):
        lim = (f * h < 9500).astype(float)
        x += np.sin(2 * np.pi * h * ph) / h ** .55 * lim
    x = peak(peak(band(x, 280, 7000), 1150, 3, 2.6), 2700, 4, 1.6)
    x = np.tanh(x * a * .9) + band(noise(n / SR), 1600, 6000) * a * .025
    return x * .55


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


def dhol_bass(vel=1.0):
    """The dhol's big side, struck with the bent stick: a pitch that falls, two
    rings above it, and the thump of the stick."""
    t = T(.7)
    f = 68 + 42 * np.exp(-t * 22)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    x += np.sin(2 * np.pi * np.cumsum(f * 1.59) / SR) * np.exp(-t * 11) * .45
    x += np.sin(2 * np.pi * np.cumsum(f * 2.31) / SR) * np.exp(-t * 16) * .25
    x += band(noise(.7), 100, 900) * np.exp(-t * 45) * .7
    return np.tanh(x * 1.6) * vel


def dhol_treble(vel=1.0):
    """The thin side, a cane switch: a crack and a short ring."""
    t = T(.3)
    x = sum(np.sin(2 * np.pi * fm * t + rng.uniform(0, 6)) * np.exp(-t * dm) * am
            for fm, dm, am in ((430, 28, .6), (690, 34, .45), (1060, 40, .3), (1710, 55, .2)))
    x += band(noise(.3), 2000, 9000) * np.exp(-t * 90) * .9
    return x * vel * .8


def clap(vel=1.0):
    """A handful of people clapping, never quite together."""
    x = np.zeros(int(.25 * SR))
    for _ in range(6):
        k = int(rng.uniform(0, .018) * SR)
        b = band(noise(.12), 700, 5000) * np.exp(-T(.12) * rng.uniform(45, 70))
        mixin(x, b, k / SR, rng.uniform(.5, 1))
    return x * vel * .5


def jhanj(vel=1.0):
    t = T(.35)
    return band(noise(.35), 5000, 14000) * np.exp(-t * 16) * .4 * vel


def taiko(big=1.0):
    """A big drum: the skin's fall in pitch, its body, the stick."""
    t = T(2.2)
    f = 44 + 30 * np.exp(-t * 14)
    x = np.tanh(1.6 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 3.2)
    x += np.sin(2 * np.pi * np.cumsum(f * 2.7) / SR) * np.exp(-t * 9) * .3
    x += band(noise(2.2), 120, 1100) * np.exp(-t * 18) * .8 + band(noise(2.2), 1800, 7000) * np.exp(-t * 70) * .25
    return x * big


def sub_drop(secs=2.0, f0=70, f1=32):
    t = T(secs)
    f = f1 + (f0 - f1) * np.exp(-t * 3)
    return np.tanh(1.5 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 1.6) + band(noise(secs), 150, 700) * np.exp(-t * 9) * .5


def braam(secs=5.0, rootf=36.71):
    """Low brass, everyone at once, the filter opening on the blow then closing."""
    n = int(secs * SR)
    t = T(secs)
    v = sum(saw(f * 2 ** (d / 1200), n, rng.uniform(0, 1)) for f in (rootf, rootf * 2, rootf * 3, rootf * 4, rootf * 4.76) for d in (-8, 0, 9))
    opened, closed = band(v, 30, 2600), band(v, 30, 420)
    x = closed + (opened - closed) * np.clip(np.exp(-t * 2.0) * 1.2, 0, 1)
    x = peak(np.tanh(x * .9), 520, 2.5, 1.2) * env(n, .02, .5, .7, 2.5)
    return x * .5 + np.sin(2 * np.pi * rootf * t) * np.exp(-t * .9) * .45


def riser(secs, top=9000):
    t = T(secs)
    k = t / secs
    x = band(noise(secs), 400, top) * k ** 3
    return x * .5 + np.sin(2 * np.pi * np.cumsum(220 + 1600 * k ** 2) / SR) * k ** 2 * .12


def whoosh(secs=.35, lo=200, hi=6000):
    t = T(secs)
    x = noise(secs)
    k = t / secs
    return (band(x, lo, lo * 4) * (1 - k) + band(x, hi / 4, hi) * k) * np.sin(np.pi * k) ** 2


def tick(hi=True):
    t = T(.05)
    return band(noise(.05), 2000, 9000) * np.exp(-t * 900) * .7 + np.sin(2 * np.pi * (5200 if hi else 4300) * t) * np.exp(-t * 220) * .6


def reverse_swell(freqs, secs):
    """A chord's reverb tail, played backwards: the breath before a hit."""
    x = sum(piano(f, secs, .8, .3) for f in freqs)
    x = np.convolve(x, ir(3.0, 6000, 99)[0][: int(2.5 * SR)], mode="full")[: int(secs * SR)]
    x = x[::-1].copy()
    x /= np.abs(x).max() + 1e-9
    return x * np.linspace(0, 1, len(x)) ** 1.5


IRS = {}


def ir(secs, tone, seed):
    """A stereo room: early reflections, then a tail whose top dies first."""
    key = (secs, tone, seed)
    if key not in IRS:
        r = np.random.default_rng(seed)
        t = T(secs)
        pair = []
        for ch in range(2):
            lo = band(r.standard_normal(len(t)), 80, 1500) * np.exp(-t * 6.9 / secs)
            hi = band(r.standard_normal(len(t)), 1500, tone) * np.exp(-t * 6.9 / (secs * .45))
            x = lo + hi * .8
            x[: int(.012 * SR)] = 0
            for k in range(8):
                d = int(r.uniform(.008, .07) * SR)
                x[d] += r.uniform(-1, 1) * .6 * np.exp(-d / SR * 20)
            pair.append(x / np.sqrt((x ** 2).sum()))
        IRS[key] = pair
    return IRS[key]


# ============================================================================ sounds of things

def key_click(soft=False):
    """A typewriter key: the strike, the type bar's thock, a little ring."""
    t = T(.12)
    x = band(noise(.12), 1800, 8000) * np.exp(-t * 300) * .8
    x += np.sin(2 * np.pi * rng.uniform(170, 210) * t) * np.exp(-t * 60) * .6
    x += np.sin(2 * np.pi * rng.uniform(2400, 2900) * t) * np.exp(-t * 90) * .15
    return x * (.5 if soft else 1.0) * rng.uniform(.8, 1.1)


def switch_click():
    t = T(.2)
    return band(noise(.2), 900, 9000) * np.exp(-t * 400) * 1.2 + np.sin(2 * np.pi * 140 * t) * np.exp(-t * 50) * .5


def match_strike():
    """The head dragged across the strip, then the flare catching."""
    a = band(noise(.22), 1500, 9000) * np.interp(T(.22), [0, .05, .18, .22], [0, 1, .8, 0])
    t = T(1.2)
    flare = band(noise(1.2), 300, 5000) * np.exp(-t * 4) * (1 - np.exp(-t * 60)) * .9
    flare += band(noise(1.2), 80, 400) * np.exp(-t * 3) * .5
    x = np.zeros(int(1.45 * SR))
    mixin(x, a, 0, .7)
    mixin(x, flare, .2, 1.0)
    return x


def footsteps_gravel():
    x = np.zeros(int(.3 * SR))
    for _ in range(45):
        g = band(noise(rng.uniform(.002, .006)), 1200, 7000)
        mixin(x, g * np.hanning(len(g)), rng.uniform(0, .17), rng.uniform(.2, 1))
    mixin(x, band(noise(.1), 80, 400) * np.exp(-T(.1) * 40), 0, .6)
    return x


def heartbeat():
    tb = T(.3)
    hb = np.sin(2 * np.pi * 50 * tb) * np.exp(-tb * 14) * .7 + band(noise(.3), 300, 1100) * np.exp(-tb * 28) * 1.4
    return np.tanh(hb * 2)


MOTIF = [69, 74, 77, 76]  # A, D, F, E
buzz = band(sample("buzz"), 70, 5000)
buzz /= max(1e-6, np.abs(buzz).max())
for c in cues("keys"):
    for k in c["times"]:
        put(key_click(c.get("soft", False)), k, .32, pan=rng.uniform(-.15, .15), bus="room", wet=.25)

# ============================================================================ I. Lights out
c = cue("room")
secs = c["until"] - c["t"]
air = band(noise(secs), 40, 1600) * .05 + band(noise(secs), 2000, 9000) * .006
put(air * fade(len(air), .2, .6), c["t"], 1.0)
c = cue("hum")
secs = c["until"] - c["t"]
tt = T(secs)
hum = (np.sin(2 * np.pi * 100 * tt) * .5 + np.sin(2 * np.pi * 200 * tt) * .25 + np.sin(2 * np.pi * 300 * tt) * .12) * (1 + .1 * np.sin(2 * np.pi * 3 * tt))
hum += band(noise(secs), 2000, 7000) * .03 * (band(noise(secs), 0, 8) * 6 > .5)
put(hum * fade(len(hum), .3, .01), c["t"], .4, bus="room", wet=.2)
put(switch_click(), cue("click")["t"], .7, bus="room", wet=.3)
# The drone under it all, swelling from the click to the parcel.
dr = strings([midi(38), midi(45), midi(50)], 6.6, att=3.0, rel=.4, bright=1100, vib=.4, voices=4)
put(dr, 2.3, .7, bus="hall", wet=.5)
put(strings([midi(62), midi(69)], 6.6, att=4.0, rel=.4, bright=3500, vib=.5, voices=5), 2.3, .35, pan=.2, bus="cathedral", wet=.5)
for c in cues("buzz"):
    put(buzz, c["t"], 1.5, bus="room", wet=.25)
    put(band(buzz, 60, 400), c["t"] + .01, .6)  # the table, carrying it
g0 = cue("glow")["t"]
for k, m in enumerate(MOTIF):
    put(piano(midi(m), 5, .55 + .03 * k), g0 + .2 + k * .75, .85, pan=-.15, bus="hall", wet=.55)
    put(piano(midi(m - 24), 5, .35, .9), g0 + .2 + k * .75, .35, pan=.1, bus="hall", wet=.5)
for c in cues("paper"):
    x = np.zeros(int(1.0 * SR))
    for _ in range(12):
        pp = band(noise(rng.uniform(.03, .1)), 800, 7000)
        mixin(x, pp * np.hanning(len(pp)), rng.uniform(0, .8), rng.uniform(.3, 1))
    put(x, c["t"], .3, bus="room", wet=.3)
put(whoosh(.6, 200, 7000)[::-1].copy(), cue("wedding")["t"] - .6, .3)

# ============================================================================ II. The night
wed = cue("wedding")
w0, beat, dbl, stop = wed["t"], wed["beat"], wed["double"], wed["until"]
bar = 4 * beat
gun = cue("gunshot")["t"]
put(taiko(1.1), w0, .8, bus="hall", wet=.35)
put(sub_drop(2.0, 80, 32), w0, .55)
put(match_strike(), cue("strike")["t"], .6, bus="room", wet=.3)
# Drone and tanpura.
put(strings([midi(38), midi(45)], stop - w0 + .1, att=.3, rel=.05, bright=1200, vib=.5, voices=4), w0, .5, bus="hall", wet=.4)
t, k = w0, 0
while t < stop - .4:
    put(tanpura([midi(45), midi(50), midi(50), midi(38)][k % 4], 3.0), t, .5, pan=-.3, bus="hall", wet=.35)
    t += beat * 1.5
    k += 1
# A bar each: Dm, Bb, Gm, A.
CH = [[50, 53, 57, 62], [46, 50, 53, 58], [43, 50, 55, 58], [45, 49, 52, 57]]
for b_, notes in enumerate(CH):
    t0 = w0 + b_ * bar
    d = min(bar + .3, stop - t0 + .02)
    put(strings([midi(m) for m in notes], d, att=.2, rel=.05 if b_ == 3 else .3, bright=3400, vib=1.0, voices=4), t0, .65, pan=.15, bus="hall", wet=.4)
    for dt, v in ((0, 1.0), (beat * 1.5, .7), (beat * 2, .85)):
        put(cello(midi(notes[0] - 12), beat * .8, v, 900), t0 + dt, .85)
# The groove: dhol, claps on 2 and 4, jhanj; doubling with the cuts.
BASS = {0: 1.0, 3: .55, 4: .85, 7: .35}
TREB = {1: .45, 2: .8, 3: .3, 5: .5, 6: .8, 7: .55}
t, k = w0 + beat * 2, 4
while t < stop - .01:
    sub = 2 if t >= dbl else 1
    for s_ in range(sub):
        ts = t + s_ * beat / 2 / sub
        e8 = (k * sub + s_) % 8
        hum_ = rng.uniform(-.006, .006)
        v = rng.uniform(.85, 1.1)
        if e8 in BASS:
            put(dhol_bass(BASS[e8] * v), ts + hum_, .75, bus="room", wet=.25)
        if e8 in TREB or sub == 2:
            put(dhol_treble(TREB.get(e8, .5) * v), ts + hum_, .45, pan=.25, bus="room", wet=.25)
        if e8 in (2, 6):
            put(clap(v), ts + rng.uniform(0, .01), .35, pan=-.2, bus="hall", wet=.35)
        put(jhanj(.5 + .5 * (e8 % 2 == 0)), ts, .25, pan=.4)
    t += beat / 2
    k += 1
put(riser(stop - dbl), dbl, .35)
# The shehnai: the motif, as a wedding tune.
mel = [(69, 1, "kan"), (74, 1), (77, 1), (76, 1),
       (74, 1.5, "kan"), (72, .5), (70, 1), (69, 1),
       (67, 1), (69, .5), (70, .5), (72, 1), (74, 1),
       (75, 1, "kan"), (74, .5), (73, .5), (74, 1), (69, 1),
       (74, .5), (77, .5), (76, .5), (74, .5), (69, 2)]
ph = shehnai(mel, beat)
ph0 = w0 + beat * 2
cut_ = int((stop - ph0) * SR)
ph[cut_:] = 0
ph[cut_ - 400:cut_] *= np.linspace(1, 0, 400)
put(ph, ph0, .42, pan=-.1, bus="hall", wet=.4)
# The reel: one held note, a heartbeat, and a breath in before the shot.
sd = gun - stop
put(strings([midi(81)], sd, att=.05, rel=.02, bright=7000, vib=.3, voices=6) * np.linspace(.6, 1.3, int(sd * SR)), stop, .4, bus="hall", wet=.4)
for k in range(2):
    put(heartbeat(), stop + .15 + k * .55, .5)
put(whoosh(.35, 300, 6000)[::-1].copy(), gun - .35, .2)
shot_s = band(sample("shot"), 100, 9500)
put(shot_s, gun, 1.15, bus="cathedral", wet=.5)
tt = T(.8)
put(np.tanh((band(noise(.8), 600, 9000) * np.exp(-tt * 70) * 1.4 + np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 10)) * 2.2), gun, .55)
put(sub_drop(1.5, 90, 35), gun, .6)
put(band(shot_s, 200, 2500), gun + .45, .3, pan=.5, bus="cathedral", wet=.8, dry=.5)
put(band(shot_s, 200, 1600), gun + .95, .14, pan=-.5, bus="cathedral", wet=.9, dry=.4)
tt = T(3.0)
put(np.sin(2 * np.pi * 3600 * tt) * np.interp(tt, [0, .05, 1.6, 3.0], [0, 1, .45, 0]), gun + .05, .06)

# ============================================================================ III. After
c = cue("after")
a0, a1 = c["t"], c["until"]
secs = a1 - a0
put(strings([midi(38), midi(39), midi(45)], secs, att=2.0, rel=1.0, bright=800, vib=.2, voices=4), a0, .55, bus="hall", wet=.5)
put(band(noise(secs), 150, 1100) * (1 + 4 * band(noise(secs), 0, 1.5)) * fade(int(secs * SR), 1.0, 1.0), a0, .07)
for k, m in enumerate([69, 74, 77, 76, 74, 69]):
    put(piano(midi(m), 6, .45, .9), a0 + .6 + k * 1.8, .7, pan=-.1, bus="cathedral", wet=.6)
for k in range(int(secs / 2.4)):
    put(taiko(.35), a0 + 1.2 + k * 2.4, .35, bus="hall", wet=.4)
c = cue("sweep")
put(switch_click(), c["t"] + .1, .4, bus="room", wet=.3)
put(whoosh(1.2, 200, 4000), c["t"] + .2, .12, bus="hall", wet=.4)
c = cue("steps")
t = c["t"] + .05
while t < c["until"]:
    put(footsteps_gravel(), t, .32, pan=rng.uniform(-.2, .2), bus="room", wet=.3)
    t += .55
c = cue("slosh")
tt = T(1.2)
put(band(noise(1.2), 200, 1400) * (np.sin(2 * np.pi * 2.2 * tt) ** 8) * np.exp(-tt * 1.5), c["t"], .28, bus="room", wet=.4)
fire_c = cue("fire")
fire = sample("fire")
secs = fire_c["until"] - fire_c["t"] + .6
x = np.zeros(int(secs * SR))
for at in np.arange(0, secs, len(fire) / SR - .1):
    mixin(x, fire, at)
put(x * fade(len(x), .2, .6), fire_c["t"], .6, bus="room", wet=.2)
c = cue("puff")
put(band(noise(.45), 300, 3000) * np.interp(T(.45), [0, .05, .3, .45], [0, 1, .5, 0]), c["t"] - .1, .35, bus="room", wet=.3)
put(band(noise(1.6), 3000, 9000) * fade(int(1.6 * SR), .3, 1.0) * .3, c["t"] + .2, .2)
tn = cue("turn")["t"]
put(braam(4.0), tn, .6, bus="hall", wet=.45)
put(taiko(.9), tn, .6, bus="hall", wet=.4)

# ============================================================================ IV. Putting it together
c = cue("clockwork")
p0, b4, p1 = c["t"], c["beat"], c["until"]
three = cue("three")
ROOTS = [38, 34, 31, 33]
PAT = [0, 12, 0, 12, 0, 12, 7, 12]
t, k = p0, 0
while t < p1 - .01:
    lvl = np.interp(t, [p0, three["t"], p1], [.45, .75, 1.0])
    rt = ROOTS[int((t - p0 + 1e-6) // (4 * b4)) % 4]
    note = rt + PAT[k % 8]
    put(cello(midi(note), b4 / 2 * 1.1, .8 + .2 * (k % 2 == 0), 1500 + 900 * lvl), t, lvl * .6, pan=-.2, bus="room", wet=.2)
    put(cello(midi(note + 12), b4 / 2 * 1.1, .7, 2400), t, lvl * .38, pan=.25, bus="room", wet=.2)
    if k % 2 == 0:
        put(tick(k % 4 == 0), t, .5, pan=.15, bus="room", wet=.3)
    if k % 8 == 0:
        put(taiko(.8), t, .4, bus="hall", wet=.3)
    t += b4 / 2
    k += 1
t, i = p0, 0
CH3 = [[50, 53, 57], [46, 50, 53], [43, 50, 55], [45, 49, 52]]
while t < p1 - .01:
    d = min(4 * b4, p1 - t)
    put(strings([midi(m) for m in CH3[i % 4]], d + .25, att=.25, rel=.2, bright=np.interp(t, [p0, p1], [1200, 4200]), vib=.8, voices=5), t, .5, pan=.1, bus="hall", wet=.4)
    t += 4 * b4
    i += 1
for c in cues("cut"):
    put(whoosh(.25, 300, 7000), c["t"] - .18, .16)
    put(taiko(.45), c["t"], .35, bus="room", wet=.3)
# The three frames: a heartbeat under it, violins climbing, a Shepard tone.
t3, t4 = three["t"], three["until"]
for k in range(int((t4 - t3) / .5)):
    put(heartbeat(), t3 + k * .5, .4 + .3 * k / 8)
put(strings([midi(81), midi(82)], t4 - t3, att=1.0, rel=.02, bright=7000, vib=.2, voices=6) * (1 + .6 * np.sin(2 * np.pi * 13 * T(t4 - t3))), t3, .2, bus="hall", wet=.5)
tt = T(t4 - t3)
sh = np.zeros(len(tt))
for o in range(8):
    pos = (o + tt / 3.0) % 8
    sh += np.exp(-((pos - 4) ** 2) / 3) * np.sin(2 * np.pi * np.cumsum(55 * 2 ** pos) / SR)
put(band(sh * np.interp(tt, [0, .5, tt[-1] - .02, tt[-1]], [0, 1, 1.5, 0]), 150, 6000), t3, .13, bus="hall", wet=.3)
put(riser(1.2), t4 - 1.2, .4)
# The last words: everything gone but a clock, a low note, and a breath in before the name.
th = cue("title")["t"]
put(strings([midi(38)], th - t4, att=.1, rel=.2, bright=600, vib=.2, voices=4), t4, .5, bus="hall", wet=.5)
t = t4 + .5
while t < th - .3:
    put(tick(True), t, .45, bus="room", wet=.4)
    t += 1.0
put(reverse_swell([midi(50), midi(57), midi(62), midi(65), midi(69)], 1.4), th - 1.4, .6, bus="hall", wet=.25)

# ============================================================================ V. The name
put(braam(6.0), th, .85, bus="hall", wet=.45)
put(taiko(1.4), th, .9, bus="hall", wet=.4)
put(sub_drop(3.0, 75, 30), th, .7)
put(dhol_bass(1.0), th, .6)
tail = E["duration"] - th
put(strings([midi(m) for m in (26, 38, 45, 50, 53, 57, 64)], tail, att=.05, rel=3.0, bright=3200, vib=1.0, voices=5), th, .75, bus="hall", wet=.45)
put(choir([midi(62), midi(65), midi(69), midi(74)], tail, att=.3, rel=3.0), th, .8, bus="cathedral", wet=.55)
t = th + .5
for m, d in ((74, .7), (77, .7), (76, .7), (74, 1.2), (69, 2.6)):
    put(piano(midi(m), 5, .7), t, .8, pan=-.1, bus="hall", wet=.5)
    put(piano(midi(m - 12), 5, .45), t, .4, pan=.1, bus="hall", wet=.5)
    t += d
put(piano(midi(38), 7, .7, .8) + piano(midi(50), 7, .5), t - 2.6, .7, bus="cathedral", wet=.5)
put(tick(True), cue("last_tick")["t"], .6, bus="room", wet=.3)
put(buzz, cue("end_buzz")["t"], .9, bus="room", wet=.3)
put(band(buzz, 60, 400), cue("end_buzz")["t"] + .01, .5)

# ============================================================================ master
for name, (secs, tone, seed, gain) in {"room": (.8, 7000, 1, .7), "hall": (3.2, 6500, 2, .8), "cathedral": (6.5, 5500, 3, .7)}.items():
    irL, irR = ir(secs, tone, seed)
    for ch, src, h_ in ((L, BUS[name][0], irL), (R, BUS[name][1], irR)):
        n = 1 << int(np.ceil(np.log2(N + len(h_))))
        w = np.fft.irfft(np.fft.rfft(src, n) * np.fft.rfft(h_, n), n)[:N]
        ch += w * gain * 2.2

for a, b in E["silence"]:
    i, j = int(a * SR), int(b * SR)
    L[i:j] = 0
    R[i:j] = 0
fd = np.interp(np.arange(N) / SR, [0, .02, E["duration"] - .3, E["duration"]], [0, 1, 1, 0])
L, R = band(L * fd, 28), band(R * fd, 28)
# Tilt for a phone: a little less of the lows it can't play, a little more air.
f_ = np.fft.rfftfreq(N, 1 / SR)
tilt = 1 - .42 / (1 + (f_ / 110) ** 4) + .38 / (1 + (5000 / np.maximum(f_, 1)) ** 2)
L, R = np.fft.irfft(np.fft.rfft(L) * tilt, N), np.fft.irfft(np.fft.rfft(R) * tilt, N)

# A slow compressor so the quiet half survives a phone speaker; a soft limit.
pk = max(np.abs(L).max(), np.abs(R).max())
L, R = L / pk, R / pk
w = int(.08 * SR)
power = np.convolve((L ** 2 + R ** 2) / 2, np.ones(w) / w, mode="same")
level = 10 * np.log10(power + 1e-12)
gain = 10 ** (-np.maximum(0, level + 22) * (1 - 1 / 2.5) / 20)
gain = np.convolve(gain, np.ones(w) / w, mode="same")
L, R = np.tanh(L * gain * 1.8), np.tanh(R * gain * 1.8)
pk = max(np.abs(L).max(), np.abs(R).max())
L, R = L / pk * .9, R / pk * .9
for a, b in E["silence"]:
    i, j = int(a * SR), int(b * SR)
    L[i:j] = 0
    R[i:j] = 0
with wave.open(str(out), "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes((np.stack([L, R], 1) * 32767).astype(np.int16).tobytes())
print(f"sound → {out}")
