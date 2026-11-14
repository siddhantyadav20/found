# RAAKH trailer v4: the soundtrack. No voices. Usage: python mix.py <ffmpeg> <out.wav>
# A dhol wedding track until one gunshot, ringing silence, then a trailer score with its own drop and hits.
import subprocess, sys, json, numpy as np
FF, OUT = sys.argv[1], sys.argv[2]
SR = 48000
M = json.load(open("marks.json")); LEN = M["LENGTH"]
MU, SX = "mus/", "../audio/sfx/"
G = "/Users/siddhantyadav/Desktop/Found/public/sfx/"
def load(path, ss=0.0, t=None, af=None):
    cmd = [FF, "-nostdin", "-v", "error", "-ss", f"{ss:.3f}"] + (["-t", f"{t:.3f}"] if t else []) + ["-i", path] + (["-af", af] if af else []) + ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2).copy()
N = int(LEN * SR); bus = {k: np.zeros((N, 2), np.float32) for k in ("music", "sfx")}
def put(bn, x, at, gain=0.0, fin=0.01, fout=0.01):
    n = len(x)
    if not n: return
    x = x * (10 ** (gain / 20)); env = np.ones(n, np.float32)
    a, b = min(int(fin * SR), n), min(int(fout * SR), n)
    if a: env[:a] = np.linspace(0, 1, a)
    if b: env[-b:] = np.minimum(env[-b:], np.linspace(1, 0, b))
    x = x * env[:, None]; i = int(round(at * SR)); j = min(N, i + n)
    if i < N: bus[bn][i:j] += x[: j - i]
def tone(at, f, dur, gain, decay=None, fin=0.005):
    tt = np.arange(int(dur * SR)) / SR; y = np.sin(2 * np.pi * f * tt)
    if decay: y *= np.exp(-tt / decay)
    put("sfx", np.stack([y, y], 1).astype(np.float32), at, gain, fin, min(0.3, dur / 3))

ST, A = M["SHOT_T"], M["A"]
# ACT ONE: the wedding. The dhol track, beat-locked so 1.5 s falls on src 9.23.
w0 = 9.23 - 1.5
put("music", load(MU + "w5.mp3", w0, ST), 0.0, -1, fin=1.4, fout=0.004)
# the shot: cut everything, a crack, a sub drop, and the party goes on, muffled, through ringing ears
put("sfx", load(G + "found-shot-1.m4a"), ST, 2, 0.001, 0.4)
put("sfx", load(G + "found-shot-1.m4a", af="aecho=0.8:0.6:90|160:0.4|0.25,lowpass=f=2500"), ST + 0.01, -6, 0.001, 0.8)
put("sfx", load(SX + "563.mp3", 0.12, 2.5), ST, -3, 0.001, 1.0)
tone(ST, 3350, 2.7, -27, decay=1.3, fin=0.05)
put("music", load(MU + "w5.mp3", w0 + ST, 2.6, af="lowpass=f=260,volume=1.2"), ST + 0.05, -15, 0.6, 1.6)

# ACTS TWO AND THREE: the score, start to finish
put("music", load(MU + "p00.mp3"), A, 0, 0.002, 0.3)
put("sfx", load(G + "found-fire-1.m4a", 0.3, 6.0), M["HIT"][3] + 0.1, -17, 0.8, 1.5)  # the fire, under
put("sfx", load(G + "found-buzz-1.m4a"), 44.05, -15)                                   # the phone on the envelopes wakes
put("sfx", load(G + "found-buzz-2.m4a"), 47.98, -17)                                   # a message lands
# title: reinforce the score's hit
put("sfx", load(SX + "563.mp3"), M["TITLE"] - 0.17, -5, 0.002, 0.8)
put("sfx", load(SX + "3111.mp3"), M["TITLE"] - 0.08, -9, 0.002, 2.5)
# button: silence, then a phone buzzing in the dark
for t in (69.85, 70.25, 71.05, 71.45):
    put("sfx", load(G + "found-buzz-1.m4a"), t, -9); tone(t, 58, 0.25, -18, decay=0.07)

mix = bus["music"] + bus["sfx"]
mix[int((ST + 2.65) * SR):int(A * SR)] *= 0.0      # true silence before the score
raw = OUT.replace(".wav", ".raw.f32"); mix.astype(np.float32).tofile(raw)
pre = "volume=2dB,alimiter=limit=0.8:attack=1:release=60:level=false"
m = subprocess.run([FF, "-nostdin", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", raw, "-af", pre + ",loudnorm=I=-14:TP=-1.0:LRA=18:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
st = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
ln = (f"loudnorm=I=-14:TP=-1.0:LRA=18:measured_I={st['input_i']}:measured_TP={st['input_tp']}:measured_LRA={st['input_lra']}"
      f":measured_thresh={st['input_thresh']}:offset={st['target_offset']}:linear=true")
subprocess.run([FF, "-nostdin", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", raw, "-af", pre + "," + ln + ",aresample=48000,aformat=channel_layouts=stereo", "-c:a", "pcm_s24le", OUT], check=True)
print("measured", st["input_i"], "LUFS TP", st["input_tp"], "LRA", st["input_lra"])
