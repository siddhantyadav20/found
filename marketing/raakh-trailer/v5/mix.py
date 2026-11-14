# RAAKH trailer v5: the soundtrack, built from the game's own sounds.
# Usage: python3 mix.py <ffmpeg> <out.wav>
# A dhol track until the gunshot, ringing silence, then a score made of a drone, a
# heartbeat (the dhol slowed down), booms on the cards, the phone's buzz as a
# metronome, a riser, a drop, and the voices from the phone, each filtered as the
# thing it is (a call, a WhatsApp voice note).
import json, re, subprocess, sys, numpy as np

FF, OUT = sys.argv[1], sys.argv[2]
SR = 48000
ROOT = "/Users/siddhantyadav/Desktop/Found/"
SFX, VOX = ROOT + "public/sfx/", ROOT + "public/voices/raakh/"

# ---- marks, read straight from timeline.js so picture and sound can't drift ----
src = open("timeline.js").read()
M = {}
for k, v in re.findall(r"(\w+):\s*([\d.]+)", src[src.index("export const M"):src.index("export const LENGTH")]):
    M[k] = float(v)
for k, a, b in re.findall(r"(\w+):\s*\[([\d.]+),\s*([\d.]+)\]", src[src.index("export const M"):src.index("export const LENGTH")]):
    M[k] = (float(a), float(b))
LENGTH = float(re.search(r"export const LENGTH = ([\d.]+)", src).group(1))
MONTAGE = re.findall(r'\["(\w+)", (?:"[\w-]+"|null|\d), ([\d.]+)\]', src[src.index("export const MONTAGE"):src.index("export const CARDS")])
N = int(LENGTH * SR)
bus = {k: np.zeros((N, 2), np.float32) for k in ("music", "sfx", "voice")}

def load(path, ss=0.0, t=None, af=None):
    cmd = [FF, "-nostdin", "-v", "error", "-ss", f"{ss:.3f}"] + (["-t", f"{t:.3f}"] if t else []) + ["-i", path] + (["-af", af] if af else []) + ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2).copy()

def put(bn, x, at, gain=0.0, fin=0.01, fout=0.01):
    n = len(x)
    if not n: return
    x = x * (10 ** (gain / 20)); env = np.ones(n, np.float32)
    a, b = min(int(fin * SR), n), min(int(fout * SR), n)
    if a: env[:a] = np.linspace(0, 1, a)
    if b: env[-b:] = np.minimum(env[-b:], np.linspace(1, 0, b))
    x = x * env[:, None]; i = int(round(at * SR)); j = min(N, i + n)
    if i < N and j > i: bus[bn][i:j] += x[: j - i]

def st(y): return np.stack([y, y], 1).astype(np.float32)
def tt(dur): return np.arange(int(dur * SR)) / SR
def onepole_lp(x, fc):
    # a one-pole lowpass, fc may be an array (time-varying)
    y = np.zeros_like(x); a = np.exp(-2 * np.pi * np.broadcast_to(np.asarray(fc, np.float64), x.shape[:1]) / SR)
    acc = 0.0
    for i in range(len(x)):
        acc = a[i] * acc + (1 - a[i]) * x[i]; y[i] = acc
    return y
def lp_fft(x, fc):
    # a gentle lowpass through the spectrum (for long signals, where the loop is slow)
    X = np.fft.rfft(x, axis=0); f = np.fft.rfftfreq(len(x), 1 / SR)
    g = 1 / np.sqrt(1 + (f / fc) ** 4)
    return np.fft.irfft(X * g[:, None], n=len(x), axis=0).astype(np.float32)

# ---- a room, for the booms and hits ----
rs = np.random.default_rng(7)
def make_ir(dur=2.6, tau=0.8, fc=1800):
    t = tt(dur); ir = np.stack([rs.standard_normal(len(t)), rs.standard_normal(len(t))], 1) * np.exp(-t / tau)[:, None]
    ir = lp_fft(ir.astype(np.float32), fc); ir[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))[:, None]
    return ir / np.sqrt((ir ** 2).sum(0)).max() * 0.35
IR = make_ir()
def reverb(x, wet=0.5):
    n = len(x) + len(IR) - 1
    X = np.fft.rfft(x, n, axis=0); H = np.fft.rfft(IR, n, axis=0)
    y = np.fft.irfft(X * H, n, axis=0).astype(np.float32)
    out = np.zeros_like(y); out[: len(x)] += x; return out + y * wet

# ---- instruments ----
def thump(f0=62, f1=38, dur=0.45, tau=0.16):
    t = tt(dur); f = f1 + (f0 - f1) * np.exp(-t / 0.09); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t / tau); y[: 48] *= np.linspace(0, 1, 48)
    return st(y)
def heartbeat(at, gain):
    put("music", thump(), at, gain, 0.002, 0.12)
    put("music", thump(58, 36, 0.4, 0.14), at + 0.3, gain - 5, 0.002, 0.12)
def boom(at, gain=0.0, f0=52, f1=33, tau=1.5, click=True):
    t = tt(3.2); f = f1 + (f0 - f1) * np.exp(-t / 0.35); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t / tau) * 0.9
    if click:
        n = rs.standard_normal(len(t)) * np.exp(-t / 0.04) * 0.5
        n = onepole_lp(n, 900); y += n
    y[: 24] *= np.linspace(0, 1, 24)
    put("music", reverb(st(y), 0.6), at, gain, 0.001, 0.4)
def hit(at, gain=0.0):
    boom(at, gain, 56, 30, 2.0)
    t = tt(2.8); sub = np.sin(2 * np.pi * np.cumsum(22 + 36 * np.exp(-t / 0.7)) / SR) * np.exp(-t / 1.3) * 0.8
    put("music", st(sub), at + 0.02, gain - 3, 0.002, 0.5)
    t = tt(1.6); met = sum(np.sin(2 * np.pi * f * t + p) * np.exp(-t / d) for f, p, d in ((196, 0, 0.9), (293.7, 1, 0.7), (392, 2, 0.5), (587, 0.5, 0.35))) * 0.25
    put("music", reverb(st(met), 0.8), at, gain - 14, 0.001, 0.3)
def drone(t0, t1, g0, g1, f0=55.0):
    t = tt(t1 - t0)
    y = np.zeros(len(t))
    for mult, det, amp in ((1, 0, 1.0), (1, 0.004, 0.7), (1, -0.003, 0.7), (2, 0.002, 0.28), (3, -0.001, 0.09), (0.5, 0, 0.5)):
        y += amp * np.sin(2 * np.pi * f0 * mult * (1 + det) * t + det * 100)
    y *= (0.85 + 0.15 * np.sin(2 * np.pi * 0.07 * t))             # slow breath
    air = onepole_lp(rs.standard_normal(len(t)) * 0.08, 420)          # a little air
    y = y / np.abs(y).max() * 0.6 + air
    g = 10 ** (np.linspace(g0, g1, len(t)) / 20)
    put("music", st(y * g), t0, 0, 1.5, 0.4)
def riser(t0, t1, g0=-34, g1=-9):
    t = tt(t1 - t0); k = t / t[-1]
    n = rs.standard_normal(len(t)); fc = 180 * (40 ** k)                 # 180 Hz -> 7.2 kHz
    n = onepole_lp(n, fc)
    f = 64 * (4.5 ** k); tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sin(2 * np.pi * (2 + 14 * k ** 2) * t))
    y = n * 1.6 + tone * 0.5
    g = 10 ** ((g0 + (g1 - g0) * k ** 1.6) / 20)
    put("music", st(y * g), t0, 0, 0.3, 0.03)
def ring(at, dur=4.5, f=5200, gain=-30):
    t = tt(dur); y = np.sin(2 * np.pi * f * t) * np.exp(-t / 1.5)
    put("sfx", st(y), at, gain, 0.002, 0.5)

# ---- sounds from the game ----
DHOL, SHOT, BUZZ, FIRE, LAUGH = (SFX + f for f in ("found-dhol-1.m4a", "found-shot-1.m4a", "found-buzz-1.m4a", "found-fire-1.m4a", "found-laugh-1.m4a"))
CALL_AF = "highpass=f=320,lowpass=f=3300,acompressor=threshold=-20dB:ratio=3.5:attack=5:release=80,volume=1.5"
NOTE_AF = "highpass=f=140,lowpass=f=5200,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120,volume=1.25"
def voice(name, at, ss=0.0, t=None, af=NOTE_AF, gain=0.0):
    put("voice", load(VOX + name + ".m4a", ss, t, af), at, gain, 0.02, 0.06)
buzz = load(BUZZ)
def bz(at, gain=-2.0): put("sfx", buzz, at, gain, 0.002, 0.03)

# ================= THE MIX =================
# Cold open: a buzz, another, the call.
bz(M["buzz1"], -7); bz(M["buzz2"], -7)
voice("call-raju-0", M["rajuA"], 0.0, 2.1, CALL_AF, -5)
voice("call-raju-2", M["rajuB"], 0.0, 1.5, CALL_AF, -5)
# a faint line hiss while the call is open
t = tt(M["act1"] - M["answer"]); put("sfx", st(onepole_lp(rs.standard_normal(len(t)), 2400) * 0.02), M["answer"], -24, 0.05, 0.02)

# Act 1: the dhol, from the cut to the shot. (11.9 s of track, 11.8 s needed.)
d = load(DHOL, 0.0, M["shot"] - M["act1"] + 0.02)
put("music", d, M["act1"], -5.0, 0.25, 0.004)
put("sfx", load(LAUGH), M["k3"] + 0.4, -16, 0.3, 0.6)                 # the crowd, under the dance floor
# the shot, the party carrying on muffled for a breath, the ears ringing
put("sfx", load(SHOT), M["shot"] - 0.01, -3.0, 0.0, 0.2)
put("music", load(DHOL, M["shot"] - M["act1"], 1.5, "lowpass=f=240,volume=1.3"), M["shot"] + 0.06, -16, 0.02, 1.1)
ring(M["shot"] + 0.05)

# Act 2: the drone breathes in; the heartbeat; booms on the three cards.
drone(M["act2"] - 0.4, M["card5"][1] + 0.5, -42, -26)
drone(M["card5"][1], M["drop"], -26, -22, 55.0)
hb_t, gap = M["act2"] + 1.2, 2.4
while hb_t < M["drop"] - 0.3:
    if hb_t < M["act3"]: g, gap = -24 + 5 * (hb_t - M["act2"]) / (M["act3"] - M["act2"]), max(1.7, gap - 0.045)
    else: g, gap = -17, max(0.46, gap * 0.93)
    heartbeat(hb_t, g); hb_t += gap
for k in ("boom1", "boom2", "boom3"): boom(M[k], -14.0)
boom(M["card5"][0], -19.0, 48, 30, 1.2, False)
# the voices from the phone
voice("voice-m-1", M["mVoice"] - 0.15, 5.0, 7.7, NOTE_AF, -6)
voice("voice-m-2", M["m2Voice"] - 0.15, 0.5, 6.9, NOTE_AF, -6)
voice("prev-meera-delete", M["meera"], 0.1, 1.7, CALL_AF, -5)

# Act 3: Bhasin, the battery, the call, the night in pieces.
voice("voice-b-vn-stranger", M["bVoice1"], 0.5, 2.5, NOTE_AF, -5)
voice("voice-b-vn-stranger", M["bVoice3"], 7.5, 5.4, NOTE_AF, -5)
voice("voice-b-vn-stranger", M["bVoice4"], 13.9, 2.1, NOTE_AF, -5)
for x in (0.0, 0.55, 1.1): bz(M["battery"] + x, -12)                 # the battery, dropping
for x in (0.0, 0.9, 1.8, 2.7): bz(M["call"] + x, -9); bz(M["call"] + x + 0.5, -11)   # Mummy calling
t0 = M["montage"]
for kind, dur in MONTAGE:
    if kind != "black":
        bz(t0, -14); put("music", thump(70, 40, 0.3, 0.1), t0, -18, 0.002, 0.08)
        if kind == "fire": put("sfx", load(FIRE, 1.0, float(dur) + 0.2), t0, -16, 0.03, 0.15)
    t0 += float(dur)
riser(M["montage"] + 0.7, M["drop"], -40, -15)
boom(M["drop"] - 0.02, -22, 44, 30, 0.5, False)                       # the floor goes

# The drop: nothing, then one question.
voice("msg-r-9", M["zinda"] + 0.35, 0.6, 1.6, CALL_AF, -6)
# Title, end card, the phone once more.
hit(M["title"], -9.0)
drone(M["title"] + 0.3, M["tag"] - 0.3, -32, -38, 55.0)
hit(M["end"], -15.0)
bz(M["tagLight"], -8); bz(M["tagLight"] + 0.55, -10)
# a hair of room so the silences aren't digital zero
room = onepole_lp(rs.standard_normal(N).astype(np.float32) * 0.03, 300)
put("sfx", st(room), 0, -40, 1.0, 1.0)

# ---- sum, limit, write ----
mix = bus["music"] + bus["sfx"] + bus["voice"]
mix = np.tanh(mix)
raw = OUT.replace(".wav", ".raw.f32"); mix.astype(np.float32).tofile(raw)
subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", raw, OUT], check=True)
# loudness: two-pass loudnorm to -14 LUFS, true peak -1.5
p1 = subprocess.run([FF, "-v", "info", "-i", OUT, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
j = json.loads(p1[p1.rindex("{"):p1.rindex("}") + 1])
norm = OUT.replace(".wav", ".norm.wav")
subprocess.run([FF, "-v", "error", "-y", "-i", OUT, "-af", f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true:print_format=summary,alimiter=limit=0.84:attack=4:release=60:level=false", "-ar", str(SR), norm], check=True)
print("input", j["input_i"], "LUFS, tp", j["input_tp"], "->", norm)
