# RAAKH trailer v3: the soundtrack. Usage: python mix.py <ffmpeg> <out.wav>
# Sparse by design: room tone, one voice telling it, a swell, one burst, then true silence.
import subprocess, sys, json, numpy as np

FF, OUT = sys.argv[1], sys.argv[2]
SR, LEN = 48000, 75.0
A = "../audio/"
V = "/Users/siddhantyadav/Desktop/Found/public/voices/raakh/"
G = "/Users/siddhantyadav/Desktop/Found/public/sfx/"
cues = json.load(open("cues.json"))

PHONE = "highpass=f=320,lowpass=f=3300,acompressor=threshold=0.08:ratio=4:attack=5:release=80,volume=2.2"
NOTE = "highpass=f=110,lowpass=f=7500,acompressor=threshold=0.12:ratio=2.5:attack=8:release=120,volume=1.5"
CLIP = "highpass=f=160,lowpass=f=6000,aecho=0.8:0.4:24|41:0.16|0.1"
FAR = "lowpass=f=800,highpass=f=90,aecho=0.8:0.6:70|130:0.35|0.25"
ROOM = "aecho=0.8:0.7:70|130:0.3|0.2"

def load(path, ss=0.0, t=None, af=None):
    cmd = [FF, "-nostdin", "-v", "error", "-ss", f"{ss:.3f}"]
    if t: cmd += ["-t", f"{t:.3f}"]
    cmd += ["-i", path]
    if af: cmd += ["-af", af]
    cmd += ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    b = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, 2).copy()

N = int(LEN * SR)
bus = {k: np.zeros((N, 2), np.float32) for k in ("music", "sfx", "voice")}

def put(busname, x, at, gain=0.0, fin=0.01, fout=0.01, peak=None):
    if len(x) == 0: return
    if peak is not None: x = x * (10 ** (peak / 20) / (np.abs(x).max() + 1e-9))
    x = x * (10 ** (gain / 20)); n = len(x)
    env = np.ones(n, np.float32)
    a, b = min(int(fin * SR), n), min(int(fout * SR), n)
    if a: env[:a] = np.linspace(0, 1, a)
    if b: env[-b:] = np.minimum(env[-b:], np.linspace(1, 0, b))
    x = x * env[:, None]
    i = int(round(at * SR)); j = min(N, i + n)
    if i < N: bus[busname][i:j] += x[: j - i]

def sfx(f, at, gain=0.0, ss=0.0, t=None, af=None, fin=0.005, fout=0.05): put("sfx", load(A + "sfx/" + f, ss, t, af), at, gain, fin, fout)
def game(f, at, gain=0.0, ss=0.0, t=None, af=None, fout=0.05): put("sfx", load(G + f, ss, t, af), at, gain, 0.005, fout)
def music(f, at, ss, t, gain=0.0, fin=0.02, fout=0.02, af=None): put("music", load(A + "music/" + f, ss, t, af), at, gain, fin, fout)
def voice(f, at, ss, t, af, gain=-4.0): put("voice", load(V + f, ss, t, af), at, gain, 0.01, 0.05, peak=-3.0)
def tone(at, freq, dur, gain, decay=None, fin=0.005, bus_="sfx"):
    n = int(dur * SR); tt = np.arange(n) / SR; y = np.sin(2 * np.pi * freq * tt)
    if decay: y *= np.exp(-tt / decay)
    put(bus_, np.stack([y, y], 1).astype(np.float32), at, gain, fin, min(0.3, dur / 3))
def click(at, gain):
    n = int(0.012 * SR); y = (np.random.RandomState(7).rand(n) - 0.5) * np.exp(-np.arange(n) / (0.002 * SR))
    put("sfx", np.stack([y, y], 1).astype(np.float32), at, gain, 0.0005, 0.002)

# COLD OPEN: a phone buzzing on wood, a call nobody answers
for t in (0.15, 0.45, 1.2, 1.5, 2.4, 2.7, 3.6, 3.9, 4.8, 5.1):
    g = -7 if t < 1 else -17
    game("found-buzz-1.m4a", t, g); tone(t, 58, 0.3, g - 6, decay=0.08)
voice("call-raju-0.m4a", 1.5, 0.1, 1.85, PHONE)
voice("call-raju-2.m4a", 3.95, 0.1, 1.25, PHONE)
sfx("1446.mp3", 1.45, -40, ss=3.0, t=4.1, af="highpass=f=500,lowpass=f=4000", fin=0.05, fout=0.2)
click(5.6, -10)

# THE PARCEL: a room, a lamp, a voice on the line
sfx("3081.mp3", 6.4, -33, ss=5, t=21.6, fin=0.8, fout=0.03)
music("188.mp3", 6.4, 60.0, 21.6, gain=-16, fin=2.0, fout=0.03, af="lowpass=f=520")   # a dark floor, cut dead at 28.0
sfx("2385.mp3", 6.6, -23, t=1.6)
tone(7.0, 46, 1.0, -9, decay=0.3)
voice("call-meera-meera-keep-early-0.m4a", 10.8, 0.1, 2.95, PHONE)
voice("call-meera-meera-keep-early-0.m4a", 14.2, 4.1, 0.7, PHONE)

# THE VOICE NOTE, whole and unedited
click(15.05, -14)
voice("voice-m-1.m4a", 15.3, 0.0, 12.9, NOTE, gain=-3)
game("found-dhol-1.m4a", 20.3, -13, ss=0.0, t=5.4, af=FAR, fout=1.2)
for t in (22.85, 23.55, 24.4):                                  # celebratory fire, far off
    game("found-shot-1.m4a", t, -13, af="lowpass=f=1500," + ROOM, fout=0.3)
# 28.0: everything stops

# WHO HE WAS: his audition, his brother, the swell begins
voice("clip-d-2v.m4a", 29.0, 0.0, 9.0, CLIP, gain=-3)
music("188.mp3", 29.2, 2.0, 22.2, gain=5, fin=1.5, fout=0.6)
voice("msg-r-code.m4a", 38.1, 0.0, 4.3, PHONE)
sfx("494.mp3", 42.6, -16, ss=10.0, t=8.8, fin=1.5, fout=0.4)
voice("voice-m-2.m4a", 42.7, 0.0, 2.9, NOTE, gain=-3)
voice("voice-m-2.m4a", 45.9, 4.5, 2.8, NOTE, gain=-3)
game("found-fire-1.m4a", 48.6, -11, ss=0.5, t=3.0, fout=0.5)
voice("voice-m-3.m4a", 48.7, 0.6, 2.6, NOTE, gain=-3)

# THE CLOCK
game("found-buzz-2.m4a", 51.42, -12)
voice("voice-b-vn-none.m4a", 51.5, 0.55, 2.35, NOTE)
music("680.mp3", 53.8, 1.0, 4.4, gain=2, fin=0.01, fout=0.005)
sfx("632.mp3", 53.8, -5, ss=21.56, t=4.4, fout=0.005)
sfx("1059.mp3", 53.8, -12, ss=0.0, t=4.4, fout=0.005)
voice("voice-b-vn-none.m4a", 53.85, 7.9, 4.4, NOTE, gain=-2)
for t in cues["flash"]:
    sfx("563.mp3", t - 0.17, -13, t=0.6, fout=0.2)
for t in cues["cuts"]:
    tone(t, 52, 0.25, -14, decay=0.06)
# 58.2: total silence
voice("msg-r-9.m4a", 58.6, 0.85, 1.05, PHONE)
voice("voice-m-4.m4a", 60.6, 0.45, 1.55, NOTE, gain=-3)
voice("voice-m-4.m4a", 62.5, 3.2, 1.3, NOTE, gain=-3)

# TITLE
sfx("563.mp3", 63.9 - 0.17, -1)
sfx("3111.mp3", 63.82, -3, fout=3.0)
music("188.mp3", 64.1, 199.0, 4.3, gain=-2, fin=0.5, fout=0.6)
# BUTTON: one more line, dry and close
voice("voice-m-3.m4a", 69.0, 4.5, 1.45, NOTE, gain=-2)
tone(70.8, 44, 3.0, -12, decay=1.2)
music("188.mp3", 70.9, 205.0, 4.1, gain=-6, fin=0.6, fout=1.2)

# duck music under voices
v = np.abs(bus["voice"]).max(1); hop = 480
env = np.array([v[i:i + hop].max() for i in range(0, N, hop)])
g = np.ones(len(env)); cur = 1.0; lo = 10 ** (-7 / 20)
for i, o in enumerate(env > 0.02):
    tgt = lo if o else 1.0; cur += (tgt - cur) * (0.6 if tgt < cur else 0.022); g[i] = cur
duck = np.repeat(g, hop)[:N].astype(np.float32)
mix = bus["music"] * duck[:, None] + bus["sfx"] + bus["voice"]
# the two hard silences are absolute
for a, b in ((28.0, 29.0), (58.2, 58.6)):
    mix[int(a * SR):int(b * SR)] = 0

raw = OUT.replace(".wav", ".raw.f32"); mix.astype(np.float32).tofile(raw)
pre = "volume=3.5dB,alimiter=limit=0.79:attack=1:release=80:level=false"
m = subprocess.run([FF, "-nostdin", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", raw,
                    "-af", pre + ",loudnorm=I=-14:TP=-1.0:LRA=16:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
st = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
ln = (f"loudnorm=I=-14:TP=-1.0:LRA=16:measured_I={st['input_i']}:measured_TP={st['input_tp']}"
      f":measured_LRA={st['input_lra']}:measured_thresh={st['input_thresh']}:offset={st['target_offset']}:linear=true")
subprocess.run([FF, "-nostdin", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", raw,
                "-af", pre + "," + ln + ",aresample=48000,aformat=channel_layouts=stereo", "-c:a", "pcm_s24le", OUT], check=True)
print("measured", st["input_i"], "LUFS, TP", st["input_tp"])
