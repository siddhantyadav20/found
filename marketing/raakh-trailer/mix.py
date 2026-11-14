# RAAKH trailer: the soundtrack, built as data. Usage: python mix.py <ffmpeg> <out.wav>
# Every cue is (time on the trailer, file, where in the file, how long, gain dB, filter).
import subprocess, sys, json, numpy as np

FF, OUT = sys.argv[1], sys.argv[2]
SR, LEN = 48000, 100.8
A = "../audio/"
V = "/Users/siddhantyadav/Desktop/Found/public/voices/raakh/"
G = "/Users/siddhantyadav/Desktop/Found/public/sfx/"

PHONE = "highpass=f=320,lowpass=f=3300,acompressor=threshold=0.08:ratio=4:attack=5:release=80,volume=2.2"
CLIP = "highpass=f=180,lowpass=f=5200,aecho=0.8:0.5:28|47:0.22|0.14"
NOTE = "highpass=f=200,lowpass=f=5600,acompressor=threshold=0.1:ratio=3:attack=5:release=90,volume=1.6"
FAR = "lowpass=f=650,highpass=f=120,aecho=0.8:0.6:60|110:0.35|0.25"
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
    if peak is not None:
        x = x * (10 ** (peak / 20) / (np.abs(x).max() + 1e-9))
    x = x * (10 ** (gain / 20))
    n = len(x)
    if n == 0: return
    env = np.ones(n, np.float32)
    a, b = int(fin * SR), int(fout * SR)
    if a: env[:min(a, n)] = np.linspace(0, 1, min(a, n))
    if b: env[-min(b, n):] = np.minimum(env[-min(b, n):], np.linspace(1, 0, min(b, n)))
    x = x * env[:, None]
    i = int(round(at * SR))
    if i < 0: x, i = x[-i:], 0
    j = min(N, i + len(x))
    bus[busname][i:j] += x[: j - i]

def sfx(file, at, gain=0.0, ss=0.0, t=None, af=None, fin=0.005, fout=0.05):
    put("sfx", load(A + "sfx/" + file, ss, t, af), at, gain, fin, fout)

def music(file, at, ss, t, gain=0.0, fin=0.02, fout=0.02, af=None):
    put("music", load(A + "music/" + file, ss, t, af), at, gain, fin, fout)

def voice(file, at, ss, t, af, gain=-4.0, peak=-3.0):
    put("voice", load(V + file, ss, t, af), at, gain, 0.01, 0.04, peak=peak)

def game(file, at, gain=0.0, ss=0.0, t=None, af=None, fout=0.05):
    put("sfx", load(G + file, ss, t, af), at, gain, 0.005, fout)

def tone(at, freq, dur, gain, decay=None, fin=0.01):
    n = int(dur * SR); tt = np.arange(n) / SR
    y = np.sin(2 * np.pi * freq * tt)
    if decay: y *= np.exp(-tt / decay)
    put("sfx", np.stack([y, y], 1).astype(np.float32), at, gain, fin, min(0.3, dur / 3))

# I. COLD OPEN: a phone in a dark room
sfx("3081.mp3", 0.0, -30, ss=5, t=13.0, fin=1.5, fout=2.5)
for t in (0.7, 1.02, 1.85, 2.17):
    game("found-buzz-1.m4a", t, -12)
sfx("1446.mp3", 2.6, -38, ss=3.0, t=5.0, af="highpass=f=500,lowpass=f=4000", fin=0.05, fout=0.3)
voice("call-raju-0.m4a", 2.8, 0.0, 2.3, PHONE)
voice("call-raju-2.m4a", 5.6, 0.0, 1.7, PHONE)
for k in range(3):                                   # the line goes dead
    tone(7.45 + k * 0.32, 425, 0.16, -34)

# II. THE PARCEL: Echoes builds from nothing
music("188.mp3", 8.2, 0.0, 10.2, gain=8, fin=0.5, fout=0.12)
music("188.mp3", 19.6, 11.4, 10.9, gain=3, fin=0.7, fout=0.6)      # drops out for the stamp
sfx("1395.mp3", 9.2, -12, ss=4.0, t=1.5, fout=0.08)                 # the date types on
sfx("197.mp3", 16.55, -8, af=ROOM); sfx("197.mp3", 16.92, -9, af=ROOM)  # at the door
sfx("790.mp3", 15.92, -8)                                           # into the stamp
sfx("3111.mp3", 18.37, -3, fout=1.5)
sfx("563.mp3", 18.28, -4)
sfx("2385.mp3", 19.65, -12, t=1.6)                                  # letters
sfx("1395.mp3", 21.2, -12, ss=6.0, t=0.45)                          # NO PASSCODE.
game("found-buzz-2.m4a", 23.1, -16)

# III. WHAT IS ON IT
for t in (25.0, 25.32, 25.95):
    game("found-buzz-1.m4a", t, -9)
voice("prev-meera-delete.m4a", 26.35, 0.0, 2.5, PHONE)
sfx("790.mp3", 28.47, -10)
# the wedding, on the beat: India from its downbeat
music("205.mp3", 31.0, 29.974, 4.65, gain=-1, fin=0.005, fout=0.01)
# the reel: the same party heard through a phone's speaker
music("205.mp3", 35.65, 34.624, 4.1, gain=-9, fin=0.01, fout=0.01, af=FAR)
sfx("494.mp3", 35.65, -10, ss=10.0, t=4.1, fin=0.6, fout=0.01)
voice("cold-4.m4a", 35.9, 0.2, 0.5, CLIP, gain=-5)
voice("cold-4.m4a", 36.75, 1.55, 1.15, CLIP, gain=-5)
voice("cold-5.m4a", 38.05, 0.2, 0.55, CLIP, gain=-5)
voice("cold-5.m4a", 38.75, 1.75, 0.97, CLIP, gain=-5)
game("found-shot-1.m4a", 39.75, 0, fout=0.3)
sfx("2909.mp3", 38.96, -4, fout=1.2)
tone(39.8, 3400, 3.2, -30, fin=0.02)                                 # ears ring
# Piano Horror under Raju
music("671.mp3", 40.4, 0.0, 8.6, gain=-4, fin=0.3, fout=0.4)
voice("msg-r-code.m4a", 41.6, 0.0, 6.0, PHONE)

# IV. HOW YOU PLAY
sfx("788.mp3", 49.25 - 2.17, -2, fout=1.0)                          # YOU HAVE HIS PHONE.
music("615.mp3", 50.8, 0.0, 11.4, gain=-4, fin=0.4, fout=0.3)
music("615.mp3", 62.2, 11.4, 6.6, gain=-11, fin=0.2, fout=0.4, af="lowpass=f=900")
for t, n in ((51.3, 0.5), (53.9, 0.87), (56.9, 1.0), (59.7, 0.67)):
    sfx("1395.mp3", t, -13, ss=2.0 + t % 5, t=n)
for t in (51.05, 56.65, 59.45):
    game("found-buzz-2.m4a", t, -15)
voice("voice-m-4.m4a", 54.0, 0.5, 1.5, NOTE)
voice("voice-m-4.m4a", 55.65, 3.2, 1.25, NOTE)
voice("voice-b-vn-none.m4a", 62.35, 0.6, 2.25, NOTE)
voice("voice-b-vn-none.m4a", 64.6, 7.9, 4.45, NOTE + ",atempo=1.06")
sfx("494.mp3", 62.2, -14, ss=20.0, t=6.6, fin=1.0, fout=0.5)

# V. THE NIGHT, FASTER: drums, a clock, a riser into white
music("680.mp3", 68.8, 1.0, 11.0, gain=-2, fin=0.01, fout=0.01)
sfx("632.mp3", 68.8, -6, ss=15.0, t=11.0, fout=0.01)
sfx("1059.mp3", 68.8, -12, ss=0.0, t=11.0, fout=0.01)
game("found-train-1.m4a", 70.2, -14, ss=1.0, t=2.2, fout=0.2)
game("found-fire-1.m4a", 72.4, -14, ss=1.0, t=3.0, fout=0.2)
voice("msg-r-9.m4a", 72.13, 0.0, 2.0, PHONE)
for t in (69.0, 70.3, 72.45, 74.15, 75.45, 76.4):                    # each hour lands
    tone(t, 48, 0.9, -8, decay=0.25, fin=0.003)
sfx("3111.mp3", 79.72, 0, fout=4.0)
sfx("563.mp3", 79.63, -2)

# the turn, in the dark
music("188.mp3", 81.0, 60.0, 8.4, gain=-12, fin=1.2, fout=1.0, af="lowpass=f=500")
sfx("3081.mp3", 80.5, -32, ss=20, t=9.0, fin=1.0, fout=0.6)
sfx("197.mp3", 88.75, -6, af=ROOM); sfx("197.mp3", 89.08, -7, af=ROOM)   # whose door

# VI. TITLE
sfx("563.mp3", 89.6 - 0.17, 0)
sfx("3111.mp3", 89.52, -5, fout=3.0)
music("188.mp3", 89.9, 197.0, 10.9, gain=0, fin=0.6, fout=1.6)

# ---------------------------------------------------------------------------
# duck the music under every voice: -9 dB, 60 ms in, 450 ms out
v = np.abs(bus["voice"]).max(1)
hop = 480
env = np.array([v[i:i + hop].max() for i in range(0, N, hop)])
on = (env > 0.02).astype(float)
g = np.ones_like(on); cur = 1.0
lo = 10 ** (-9 / 20)
for i, o in enumerate(on):
    tgt = lo if o else 1.0
    k = 0.6 if tgt < cur else 0.022
    cur += (tgt - cur) * k
    g[i] = cur
duck = np.repeat(g, hop)[:N].astype(np.float32)
mix = bus["music"] * duck[:, None] + bus["sfx"] + bus["voice"]

import wave
raw = OUT.replace(".wav", ".raw.f32")
mix.astype(np.float32).tofile(raw)
pre = "volume=3.8dB,alimiter=limit=0.79:attack=1:release=80:level=false"
m = subprocess.run([FF, "-nostdin", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", raw,
                    "-af", pre + ",loudnorm=I=-14:TP=-1.0:LRA=14:print_format=json", "-f", "null", "-"],
                   capture_output=True, text=True).stderr
st = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
ln = (f"loudnorm=I=-14:TP=-1.0:LRA=14:measured_I={st['input_i']}:measured_TP={st['input_tp']}"
      f":measured_LRA={st['input_lra']}:measured_thresh={st['input_thresh']}:offset={st['target_offset']}:linear=true")
subprocess.run([FF, "-nostdin", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", raw,
                "-af", pre + "," + ln + ",aresample=48000,aformat=channel_layouts=stereo", "-c:a", "pcm_s24le", OUT], check=True)
print("measured", st["input_i"], "LUFS, TP", st["input_tp"], "→ -14 LUFS")
