# RAAKH trailer v7: the soundtrack. Usage: python3 mix.py <out.wav>
# One continuous bed from the first frame to the drop: a tanpura under everything, the dhol over it
# for the wedding, the cue from the first hit. The gunshot's silence is one held breath, with the
# ears ringing and a lone sarangi in it. Rooms and objects underneath. No voices yet.
import json, subprocess, sys, numpy as np

HERE = __import__("os").path.dirname(__import__("os").path.abspath(__file__))
FF = HERE + "/../v5/node_modules/ffmpeg-static/ffmpeg"
OUT = sys.argv[1] if len(sys.argv) > 1 else HERE + "/out/mix.wav"
SR = 48000
M = json.load(open(HERE + "/marks.json"))
B0, BEAT, SHOT, A, HIT, DRIVE, DROP, TITLE, END, LENGTH = (M[k] for k in ("B0", "BEAT", "SHOT_T", "A", "HIT", "DRIVE", "DROP", "TITLE", "END", "LENGTH"))
AU, GAME = HERE + "/audio/", HERE + "/../../../public/sfx/"
N = int(LENGTH * SR); bus = {k: np.zeros((N, 2), np.float32) for k in ("music", "sfx", "room")}

def load(path, ss=0.0, t=None, af=None):
    cmd = [FF, "-nostdin", "-v", "error", "-ss", f"{ss:.3f}"] + (["-t", f"{t:.3f}"] if t else []) + ["-i", path] + (["-af", af] if af else []) + ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2).copy()
def put(bn, x, at, gain=0.0, fin=0.01, fout=0.01):
    n = len(x)
    if not n: return
    x = x * (10 ** (gain / 20)); env = np.ones(n, np.float32)
    a, b_ = min(int(fin * SR), n), min(int(fout * SR), n)
    if a: env[:a] = np.linspace(0, 1, a)
    if b_: env[-b_:] = np.minimum(env[-b_:], np.linspace(1, 0, b_))
    x = x * env[:, None]; i = int(round(at * SR)); j = min(N, i + n)
    if i < N and j > i: bus[bn][i:j] += x[: j - i]
def loop(path, dur, af=None):
    x = load(path, 0.0, None, af); reps = int(np.ceil(dur * SR / len(x))) + 1
    return np.concatenate([x] * reps)[: int(dur * SR)]
def st(y): return np.stack([y, y], 1).astype(np.float32)
def chime(at, gain):
    # an apartment doorbell: two soft tones, the second a fourth below
    t = np.arange(int(1.6 * SR)) / SR
    y = np.sin(2 * np.pi * 988 * t) * np.exp(-t / 0.45) + 0.6 * np.sin(2 * np.pi * 1976 * t) * np.exp(-t / 0.2)
    t2 = t[: int(1.2 * SR)]; y2 = np.sin(2 * np.pi * 740 * t2) * np.exp(-t2 / 0.5) + 0.5 * np.sin(2 * np.pi * 1480 * t2) * np.exp(-t2 / 0.22)
    i0 = int(0.42 * SR); y2 = y2[: len(y) - i0]; y[i0: i0 + len(y2)] += y2
    put("sfx", st(y / np.abs(y).max() * 0.6), at, gain, 0.002, 0.3)

# ---- the bed: a tanpura from the first frame to the cue, under everything ----
put("music", load(AU + "tanpura-deep.mp3", 14.0, A - 0.0 + 3.0, "lowpass=f=2200"), 0.0, -19, 0.8, 2.5)
# ---- the cold open: the room, the bell, the parcel, the phone ----
put("room", loop(AU + "sfx-fan-hum.mp3", B0 + 0.4, "lowpass=f=1200"), 0.0, -30, 0.6, 0.25)
put("room", load(AU + "sfx-dog-2.mp3", 0.0, 4.0), 0.6, -30, 0.05, 0.5)
chime(0.9, -11)
buzz = load(AU + "sfx-vibrate-wood.mp3", 0.3, 0.55, "highpass=f=80")
put("sfx", buzz, 8.3, -10, 0.005, 0.08); put("sfx", buzz, 9.0, -12, 0.005, 0.08)
# ---- act one: the dhol, over the bed, until the shot ----
d = load(AU + "dhol-midnight.mp3", 9.28, SHOT - B0 + 0.02, "highpass=f=40")
put("music", d, B0, -3.5, 0.12, 0.004)
put("sfx", load(GAME + "found-shot-1.m4a"), SHOT - 0.01, -1.0, 0.0, 0.2)
put("music", load(AU + "dhol-midnight.mp3", 9.28 + SHOT - B0, 1.3, "lowpass=f=220,volume=1.2"), SHOT + 0.05, -18, 0.02, 0.9)
put("sfx", load(AU + "sfx-tinnitus.mp3", 0.5, 4.5, "highpass=f=2000"), SHOT + 0.04, -27, 0.01, 3.0)
put("music", load(AU + "sarangi-bowed.mp3", 0.0, 4.2, "highpass=f=200,lowpass=f=6000"), SHOT + 0.9, -21, 0.5, 1.2)
# ---- the cue, from its first hit; crickets and a fan under the acts ----
put("music", load(AU + "dark-mystery-trailer.mp3", 0.0, LENGTH - A), A, -1.5, 0.2, 0.4)
put("music", load(AU + "tanpura-deep.mp3", 40.0, DRIVE - A + 2.0, "lowpass=f=1800"), A, -33, 2.0, 2.0)
put("room", load(AU + "sfx-crickets.mp3", 5.0, DRIVE - A, "highpass=f=1500"), A, -32, 1.5, 1.5)
put("room", load(AU + "sfx-dog-2.mp3", 0.0, 4.0), HIT[3] + 0.6, -27, 0.05, 0.5)
put("room", loop(AU + "sfx-fan-hum.mp3", DROP - DRIVE, "lowpass=f=1200"), DRIVE, -35, 1.0, 0.3)
for x in (0.0, 0.5, 1.0): put("sfx", buzz, 50.05 + x, -12 - 2 * x, 0.005, 0.08)    # the call
put("sfx", buzz, 59.75, -14, 0.005, 0.08)
put("sfx", load(AU + "sfx-riser-wildfire.mp3", 6.5, 5.3), DROP - 5.2, -9, 0.3, 0.02)
put("sfx", load(AU + "sfx-subdrop.mp3"), DROP - 0.02, -10, 0.002, 0.8)
put("sfx", load(AU + "sfx-hit-impact.mp3"), TITLE - 0.02, -7, 0.001, 0.4)
put("sfx", load(AU + "sfx-subboom.mp3"), TITLE, -9, 0.001, 0.5)
put("sfx", load(AU + "sfx-hit-boom.mp3"), END - 0.02, -11, 0.001, 0.4)
put("sfx", buzz, END + 4.85, -9, 0.005, 0.08); put("sfx", buzz, END + 5.45, -11, 0.005, 0.08)
put("room", loop(AU + "sfx-fan-hum.mp3", LENGTH - END - 4.0, "lowpass=f=1200"), END + 4.0, -30, 0.5, 0.4)

mix = bus["music"] + bus["sfx"] + bus["room"]
mix[-int(0.4 * SR):] *= np.linspace(1, 0, int(0.4 * SR))[:, None]
mix = np.tanh(mix)
raw = OUT.replace(".wav", ".raw.f32"); mix.astype(np.float32).tofile(raw)
subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", raw, OUT], check=True)
p1 = subprocess.run([FF, "-v", "info", "-i", OUT, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
j = json.loads(p1[p1.rindex("{"):p1.rindex("}") + 1])
norm = OUT.replace(".wav", ".norm.wav")
subprocess.run([FF, "-v", "error", "-y", "-i", OUT, "-af", f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,alimiter=limit=0.84:attack=4:release=60:level=false", "-ar", str(SR), norm], check=True)
print("input", j["input_i"], "LUFS tp", j["input_tp"], "->", norm)
# continuity check: the quietest 250 ms windows outside the two designed silences
x = np.frombuffer(subprocess.run([FF, "-v", "error", "-i", norm, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32)
w = int(0.25 * SR); m = len(x) // w; rms = 20 * np.log10(np.sqrt((x[: m * w].reshape(m, w) ** 2).mean(1)) + 1e-9)
quiet = [(round(i * 0.25, 2), round(float(r), 1)) for i, r in enumerate(rms) if r < -45 and not (SHOT - 0.1 < i * 0.25 < SHOT + 1.0) and not (DROP - 0.1 < i * 0.25 < TITLE) and i * 0.25 < LENGTH - 0.6]
print("quiet windows (<-45 dBFS) outside the designed silences:", quiet[:20] or "none")
