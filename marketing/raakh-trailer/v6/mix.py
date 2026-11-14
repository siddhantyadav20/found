# RAAKH trailer v6: the soundtrack. Usage: python3 mix.py <out.wav>
# A dhol until the gunshot; ringing silence with a lone sarangi; then "Dark Mystery Trailer"
# with a tanpura under it; rooms, objects and the phone's buzz on wood; no voices (the voice
# slots are left for a real recording). Mixed to -14 LUFS, true peak -1.5.
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

# ---- the cold open: a room, a buzz on wood, a thread of tanpura ----
put("room", loop(AU + "sfx-fan-hum.mp3", B0 + 0.3, "lowpass=f=1200"), 0.0, -34, 0.8, 0.2)
put("room", load(AU + "tanpura-deep.mp3", 20.0, B0 + 0.4, "lowpass=f=2500"), 0.0, -33, 1.5, 0.15)
buzz = load(AU + "sfx-vibrate-wood.mp3", 0.3, 0.55, "highpass=f=80")
put("sfx", buzz, 0.5, -9, 0.005, 0.08); put("sfx", buzz, 1.4, -11, 0.005, 0.08)

# ---- act one: the dhol, cut to its beat, until the shot ----
d = load(AU + "dhol-midnight.mp3", 9.28, SHOT - B0 + 0.02, "highpass=f=40")
put("music", d, B0, -3.5, 0.05, 0.004)
# the shot, the party carrying on muffled for a breath, the ears ringing
put("sfx", load(GAME + "found-shot-1.m4a"), SHOT - 0.01, -1.0, 0.0, 0.2)
put("music", load(AU + "dhol-midnight.mp3", 9.28 + SHOT - B0, 1.4, "lowpass=f=220,volume=1.2"), SHOT + 0.05, -18, 0.02, 1.0)
put("sfx", load(AU + "sfx-tinnitus.mp3", 0.5, 5.0, "highpass=f=2000"), SHOT + 0.04, -27, 0.01, 3.5)
# a lone sarangi, in the black
put("music", load(AU + "sarangi-bowed.mp3", 0.0, 4.6, "highpass=f=200,lowpass=f=6000"), 19.6, -22, 0.6, 1.4)

# ---- act two and three: the cue, a tanpura under it, the night outside ----
put("music", load(AU + "dark-mystery-trailer.mp3", 0.0, LENGTH - A), A, -1.5, 0.25, 0.4)
put("music", load(AU + "tanpura-deep.mp3", 30.0, DRIVE - A + 2.0, "lowpass=f=1800"), A - 0.2, -31, 2.0, 2.0)
put("room", load(AU + "sfx-crickets.mp3", 5.0, DRIVE - A, "highpass=f=1500"), A, -31, 1.5, 1.5)
put("room", load(AU + "sfx-dog-2.mp3", 0.0, 4.0), HIT[0] + 1.9, -26, 0.05, 0.5)
put("room", load(AU + "sfx-fire-2.mp3", 4.0, 38.6 - HIT[2] + 0.6), HIT[2] - 0.1, -21, 0.4, 0.6)
put("room", loop(AU + "sfx-fan-hum.mp3", DROP - DRIVE, "lowpass=f=1200"), DRIVE, -35, 1.0, 0.3)
# the phone, in the flat
put("sfx", buzz, 45.55, -13, 0.005, 0.08); put("sfx", buzz, 46.3, -15, 0.005, 0.08)
for x in (0.0, 0.42, 0.84): put("sfx", buzz, 55.6 + x, -16, 0.005, 0.08)       # the battery
put("sfx", load(AU + "sfx-riser-wildfire.mp3", 6.5, 5.3), DROP - 5.2, -9, 0.3, 0.02)
put("sfx", load(AU + "sfx-subdrop.mp3"), DROP - 0.02, -10, 0.002, 0.8)
# the title, the end card, the phone once more
put("sfx", load(AU + "sfx-hit-impact.mp3"), TITLE - 0.02, -7, 0.001, 0.4)
put("sfx", load(AU + "sfx-subboom.mp3"), TITLE, -9, 0.001, 0.5)
put("sfx", load(AU + "sfx-hit-boom.mp3"), END - 0.02, -11, 0.001, 0.4)
put("sfx", buzz, END + 4.45, -9, 0.005, 0.08); put("sfx", buzz, END + 5.05, -11, 0.005, 0.08)
put("room", loop(AU + "sfx-fan-hum.mp3", LENGTH - END - 4.0, "lowpass=f=1200"), END + 4.0, -36, 0.5, 0.4)

mix = bus["music"] + bus["sfx"] + bus["room"]
mix[-int(0.3 * SR):] *= np.linspace(1, 0, int(0.3 * SR))[:, None]
mix = np.tanh(mix)
raw = OUT.replace(".wav", ".raw.f32"); mix.astype(np.float32).tofile(raw)
subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", raw, OUT], check=True)
p1 = subprocess.run([FF, "-v", "info", "-i", OUT, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
j = json.loads(p1[p1.rindex("{"):p1.rindex("}") + 1])
norm = OUT.replace(".wav", ".norm.wav")
subprocess.run([FF, "-v", "error", "-y", "-i", OUT, "-af", f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,alimiter=limit=0.84:attack=4:release=60:level=false", "-ar", str(SR), norm], check=True)
print("input", j["input_i"], "LUFS tp", j["input_tp"], "->", norm)
