# RAAKH trailer v6: the edit as data. Real footage, cut to the cue; the game's screens as
# short inserts, and once composited onto a real phone on a real nightstand.
# Usage: python3 edit.py [cards|comp|shots|final|all]
# 1920x1080 at 24 fps, picture in a 2.39:1 scope frame (1920x804 at y=138).
import json, os, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
FF = HERE + "/../v5/node_modules/ffmpeg-static/ffmpeg"
STEP = sys.argv[1] if len(sys.argv) > 1 else "all"
SRC, INS = HERE + "/src/", HERE + "/inserts/out/"
FPS, PW, PH = 24, 1920, 804

# ---- the grid: the dhol's beat for act one, the cue's own hits after the shot ----
BEAT, B0 = 0.716, 3.6                 # dhol-midnight: beat 0.716 s, song time 9.28 at B0
def b(k): return round(B0 + k * BEAT, 3)
SHOT_T = b(21)                        # 18.636: the gunshot, on the beat
A = 22.6                              # the cue (Dark Mystery Trailer) starts here
HIT = [A, A + 4.39, A + 8.78, A + 13.1]
DRIVE, DROP, TITLE, END = A + 19.9, A + 37.15, A + 39.38, A + 43.72
LENGTH = 74.2

WARM = "eq=contrast=1.07:saturation=1.02:gamma=0.98,colorbalance=rs=0.03:bs=-0.03:rh=0.05:bh=-0.04"
COLD = "eq=contrast=1.12:saturation=0.74:gamma=0.94,colorbalance=rs=-0.05:gs=-0.01:bs=0.07:rm=-0.02:bm=0.03:rh=0.03:bh=-0.02"
UI = "eq=contrast=1.04:saturation=0.9"                       # the inserts: barely touched
FILM = "curves=all='0/0.018 0.18/0.15 0.5/0.5 0.82/0.84 1/0.955'"

S = []
def shot(t0, t1, f, src_in=0.0, speed=1.0, grade=COLD, zoom=1.0, fx=0.5, fy=0.5, extra=""):
    S.append(dict(t0=round(t0, 3), t1=round(t1, 3), f=f, src=src_in, speed=speed, grade=grade, zoom=zoom, fx=fx, fy=fy, extra=extra))
def ins(name): return INS + name + ".mp4"
COMP = HERE + "/out/comp-nightstand.mp4"

# ── COLD OPEN: a phone lights up on a nightstand. Then a face, reading.
shot(0.0, 2.3, COMP, 0.0, 1.0, COLD + ",eq=brightness=-0.02", 1.0, 0.5, 0.55)
shot(2.3, B0, SRC + "6415082.mp4", 5.0, 0.9, COLD, 1.08, 0.5, 0.45)                      # a face lit by the screen
# ── ACT ONE: the wedding, on the dhol
shot(b(0), b(3), SRC + "38804641.mp4", 20.0, 0.5, WARM, 1.0, 0.5, 0.5)                   # the venue from the air
shot(b(3), b(5), SRC + "11122323.mp4", 3.0, 0.8, WARM, 1.0, 0.5, 0.5)                    # the bride's hands
shot(b(5), b(7), SRC + "7685157.mp4", 1.0, 1.0, WARM, 1.0, 0.5, 0.45)                    # sparklers
shot(b(7), b(9), SRC + "35008225.mp4", 4.0, 1.0, WARM, 1.05, 0.5, 0.5)                   # everyone dancing
shot(b(9), b(11), SRC + "30077981.mp4", 2.0, 0.4, WARM, 1.0, 0.5, 0.5)                   # the dance floor, slowed
shot(b(11), b(13), SRC + "13953530.mp4", 4.5, 0.5, WARM, 1.0, 0.5, 0.5)                  # phones up, filming
shot(b(13), b(15), SRC + "4824123.mp4", 2.3, 0.8, WARM, 1.0, 0.5, 0.35)                  # a boy, a sparkler
shot(b(15), b(17), SRC + "34602730.mp4", 7.0, 1.0, WARM, 1.0, 0.5, 0.5)                  # sparklers, the party
shot(b(17), b(19), SRC + "17735952.mp4", 7.4, 0.8, WARM, 1.0, 0.5, 0.45)                 # fireworks
shot(b(19), b(20), SRC + "33287257.mp4", 5.8, 1.0, WARM, 1.0, 0.5, 0.5)                  # fireworks over the city
shot(b(20), SHOT_T, SRC + "4824123.mp4", 8.6, 0.8, WARM, 1.15, 0.5, 0.33)                # the boy, closer
# SHOT_T: one white frame, then black. (The white frame is added in final().)
# ── ACT TWO: the night, on the cue's four hits
shot(HIT[0], HIT[1], SRC + "11792115.mp4", 4.6, 0.96, COLD, 1.0, 0.5, 0.5)               # a figure walks into the fog
shot(HIT[1], HIT[2], SRC + "28780676.mp4", 2.4, 0.96, COLD, 1.0, 0.5, 0.55)              # a roadside, a car leaving
shot(HIT[2], HIT[3], SRC + "33644260.mp4", 3.0, 0.8, COLD + ",eq=saturation=1.25", 1.6, 0.5, 0.55)   # a fire in a field, from above
shot(HIT[3], 38.6, SRC + "38328417.mp4", 0.6, 0.48, COLD + ",eq=saturation=1.2", 1.0, 0.5, 0.5)     # someone watches it burn
shot(38.6, DRIVE, SRC + "6383997.mp4", 9.0, 0.8, COLD + ",eq=saturation=1.1", 1.1, 0.5, 0.5)       # ash
# ── ACT THREE: the phone (the drive)
shot(DRIVE, 44.0, SRC + "36017452.mp4", 1.2, 0.8, COLD, 1.0, 0.5, 0.5)                    # a hand reaches for it
shot(44.0, 45.5, SRC + "33942937.mp4", 2.0, 0.8, COLD, 1.05, 0.5, 0.5)                    # a thumb on the glass, in the dark
shot(45.5, 47.0, ins("lock"), 0.2, 1.0, UI)                                                # 47 Missed Calls
shot(47.0, 48.5, SRC + "5281602.mp4", 2.6, 0.8, COLD, 1.1, 0.5, 0.35)                     # a face lit by a screen
shot(48.5, 49.7, SRC + "28828935.mp4", 3.6, 0.48, COLD, 1.0, 0.5, 0.5)                    # thumbs through the chats
shot(49.7, 51.2, ins("poster"), 0.2, 1.0, UI)                                              # LAPATA
shot(51.2, 52.2, SRC + "39494839.mp4", 5.0, 0.96, COLD, 1.0, 0.5, 0.5)                    # typing
shot(52.2, 53.4, ins("gone"), 0.2, 1.0, UI)                                                # disappearing messages
shot(53.4, 54.4, SRC + "6346221.mp4", 3.0, 0.9, COLD, 1.0, 0.5, 0.45)                     # a woman's face in the dark
shot(54.4, 55.6, ins("casefile"), 0.6, 1.0, UI, 1.45, 0.72, 0.42)                                            # the case file fills in
shot(55.6, 56.5, ins("battery"), 0.1, 1.0, UI)                                             # 7, 5, 3
shot(56.5, 57.4, SRC + "20563164.mp4", 3.0, 1.0, COLD, 1.0, 0.5, 0.5)                     # alone with a laptop
# the night, faster
MONT = [(SRC + "36920052.mp4", 10.5, 1.0, COLD), (SRC + "10385802.mp4", 9.0, 0.96, COLD), (SRC + "5509723.mp4", 3.0, 0.8, COLD),
        (SRC + "33780144.mp4", 1.0, 1.0, COLD + ",eq=saturation=1.2"), (ins("lock"), 0.9, 1.0, UI), (SRC + "13643105.mp4", 3.0, 0.96, COLD),
        (SRC + "12165393.mp4", 4.0, 0.96, COLD + ",eq=saturation=1.2"), (ins("poster"), 0.9, 1.0, UI), (SRC + "4824123.mp4", 6.2, 0.8, WARM)]
D = [0.5, 0.42, 0.36, 0.3, 0.26, 0.22, 0.19, 0.16, 0.14]
k = (DROP - 57.4) / sum(D); t = 57.4
for i, ((f, si, sp, g), d) in enumerate(zip(MONT, D)):
    t1 = DROP if i == len(D) - 1 else round(t + d * k, 3)
    shot(t, t1, f, si, sp, g, 1.1 if g != UI else 1.0, 0.5, 0.5); t = t1
# DROP: silence, black. TITLE: embers rising, RAAKH. END: the end card on black.
shot(TITLE, END, SRC + "12298312.mp4", 2.0, 0.6, COLD + ",eq=brightness=-0.08:saturation=1.1", 1.1, 0.5, 0.5)
# the button: a message lands on a phone in the dark
shot(END + 4.3, LENGTH - 0.3, SRC + "34786878.mp4", 2.2, 0.48, COLD, 1.0, 0.5, 0.5)

CARDS = [
    (4.4, 7.0, "pic", "A wedding in Delhi."),
    (8.7, 10.9, "pic", "21 November."),
    (11.6, 14.0, "pic", "Every phone was recording."),
    (19.6, 22.2, "blk", "One boy didn’t go home."),
    (23.4, 26.3, "pic", "He was nineteen."),
    (27.8, 30.5, "pic", "No police."),
    (32.2, 34.9, "pic", "No hospital."),
    (36.4, 38.4, "pic", "No body."),
    (39.1, 42.2, "pic", "By morning, it never happened."),
    (42.8, 45.3, "pic", "But someone kept the phone."),
    (47.1, 49.4, "pic", "And now it’s in your hands."),
    (53.5, 55.4, "pic", "Find out what they did."),
    (56.6, 59.3, "pic", "They want it back by seven."),
    (DROP + 0.45, TITLE - 0.25, "blk", "Everyone has a version."),
    (TITLE, END - 0.05, "title", "CHAPTER ONE"),
    (END + 0.05, END + 4.2, "end", ""),
]

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(" ".join(cmd)); print(r.stderr[-2000:]); sys.exit(1)

# ---- the composite: the game's lock screen on the real phone (35999376, locked-off camera) ----
# UI corner order: top-left, top-right, bottom-right, bottom-left of the upright screen, mapped to
# where they land on the nightstand. The phone's top points left; its near edge is the lower line.
QUAD = [(296, 757), (302, 636), (1187, 686), (1180, 807)]
def homography(src, dst):
    A = []
    for (x, y), (u, v) in zip(src, dst):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); A.append([0, 0, 0, x, y, 1, -v * x, -v * y])
    h = np.linalg.solve(np.array(A, float), np.array([c for p in dst for c in p], float))
    return np.append(h, 1).reshape(3, 3)
def composite(out, src=SRC + "35999376.mp4", ss=3.5, dur=2.3, ui=INS + "lockflat.mp4", ui_ss=0.0, light_at=0.5):
    n = int(round(dur * FPS))
    raw = lambda cmd: subprocess.run(cmd, capture_output=True, check=True).stdout
    bg = np.frombuffer(raw([FF, "-v", "error", "-ss", f"{ss:.3f}", "-i", src, "-t", f"{dur + 0.2:.3f}", "-vf", f"fps={FPS},scale=1920:1080", "-frames:v", str(n), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]), np.uint8).reshape(n, 1080, 1920, 3)
    fg = np.frombuffer(raw([FF, "-v", "error", "-ss", f"{ui_ss:.3f}", "-i", ui, "-t", f"{dur + 0.2:.3f}", "-vf", f"fps={FPS},crop=432:936:744:72", "-frames:v", str(n), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]), np.uint8).reshape(n, 936, 432, 3).astype(np.float32)
    Hm = np.linalg.inv(homography([(0, 0), (432, 0), (432, 936), (0, 936)], QUAD))
    xs = [p[0] for p in QUAD]; ys = [p[1] for p in QUAD]
    x0, x1, y0, y1 = max(0, min(xs) - 2), min(1920, max(xs) + 3), max(0, min(ys) - 2), min(1080, max(ys) + 3)
    gx, gy = np.meshgrid(np.arange(x0, x1), np.arange(y0, y1))
    P = np.stack([gx, gy, np.ones_like(gx)], -1).astype(float) @ Hm.T
    u = P[..., 0] / P[..., 2]; v = P[..., 1] / P[..., 2]
    inside = (u >= 0) & (u < 432) & (v >= 0) & (v < 936)
    ui_ = np.clip(u, 0, 431).astype(int); vi_ = np.clip(v, 0, 935).astype(int)
    # a soft edge, and the glass: the UI sits at 88 %, the phone's own light underneath
    edge = np.minimum.reduce([u, 432 - u, v, 936 - v]) ; alpha = np.clip(edge / 6.0, 0, 1) * inside
    frames = bytearray()
    for i in range(n):
        t = i / FPS; k = 0.0 if t < light_at else min(1.0, (t - light_at) / 0.25)
        f = bg[i].astype(np.float32)
        if k > 0:
            patch = fg[i][vi_, ui_] * 0.92 + 8                    # a little lift, like glass
            a = (alpha * k * 0.9)[..., None]
            f[y0:y1, x0:x1] = f[y0:y1, x0:x1] * (1 - a) + patch * a
        frames += np.clip(f, 0, 255).astype(np.uint8).tobytes()
    subprocess.run([FF, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1920x1080", "-r", str(FPS), "-i", "-",
                    "-c:v", "libx264", "-crf", "10", "-preset", "fast", "-pix_fmt", "yuv420p", out], input=bytes(frames), check=True)
    print("composite", out, n, "frames")

def segments():
    seg, t = [], 0.0
    for s in sorted(S, key=lambda x: x["t0"]):
        if s["t0"] > t + 1e-3: seg.append(dict(t0=t, t1=s["t0"], black=True))
        seg.append(s); t = s["t1"]
    if t < LENGTH: seg.append(dict(t0=t, t1=LENGTH, black=True))
    return seg

def render_shots():
    os.makedirs(HERE + "/seg", exist_ok=True)
    seg = segments(); files = []
    for i, s in enumerate(seg):
        n = round(s["t1"] * FPS) - round(s["t0"] * FPS)
        out = f"{HERE}/seg/{i:03d}.mp4"; files.append(out)
        if n <= 0: files.pop(); continue
        if s.get("black"):
            run([FF, "-v", "error", "-y", "-f", "lavfi", "-i", f"color=black:s={PW}x{PH}:r={FPS}", "-frames:v", str(n),
                 "-c:v", "libx264", "-crf", "10", "-preset", "fast", "-pix_fmt", "yuv420p", out]); continue
        need = n / FPS * s["speed"] + 0.5
        w = int(round(PW * s["zoom"] / 2) * 2)
        vf = (f"setpts=(PTS-STARTPTS)/{s['speed']},fps={FPS},scale={w}:-2:flags=lanczos,"
              f"crop={PW}:{PH}:(iw-{PW})*{s['fx']}:(ih-{PH})*{s['fy']},{s['grade']},{FILM}")
        if s["extra"]: vf += "," + s["extra"]
        run([FF, "-v", "error", "-y", "-ss", f"{s['src']:.3f}", "-t", f"{need:.3f}", "-i", s["f"], "-an", "-vf", vf,
             "-frames:v", str(n), "-c:v", "libx264", "-crf", "10", "-preset", "fast", "-pix_fmt", "yuv420p", out])
        print(f"{i:03d} {s['t0']:6.2f}-{s['t1']:6.2f} {os.path.basename(s['f'])}")
    with open(HERE + "/seg/list.txt", "w") as fh:
        for f in files: fh.write(f"file '{f}'\n")

def final():
    os.makedirs(HERE + "/out", exist_ok=True)
    run([FF, "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", HERE + "/seg/list.txt", "-c", "copy", HERE + "/out/cut.mp4"])
    ins_ = ["-i", HERE + "/out/cut.mp4"]; fc = [f"[0:v]pad=1920:1080:0:138:black,setsar=1[v0]"]; last = "v0"
    for i, (t0, t1, kind, _) in enumerate(CARDS):
        d = t1 - t0; fi = 0.12 if kind == "pic" and d < 1.4 else 0.35; fo = 0.12 if d < 1.4 else 0.4
        if kind == "title": fi, fo = 0.042, 0.5
        if kind == "end": fi, fo = 0.042, 0.6
        ins_ += ["-loop", "1", "-t", f"{d:.3f}", "-framerate", str(FPS), "-i", f"{HERE}/cards/c{i:02d}.png"]
        fc.append(f"[{i+1}:v]format=rgba,fade=t=in:st=0:d={fi}:alpha=1,fade=t=out:st={d-fo:.3f}:d={fo}:alpha=1,setpts=PTS+{t0:.3f}/TB[c{i}]")
        fc.append(f"[{last}][c{i}]overlay=eof_action=pass:format=auto[o{i}]"); last = f"o{i}"
    # the gunshot: one white frame in the scope
    w0 = round(SHOT_T * FPS) / FPS
    fc.append(f"[{last}]drawbox=x=0:y=138:w=1920:h=804:color=white@0.92:t=fill:enable='between(t,{w0:.4f},{w0 + 0.5 / FPS:.4f})'[w]")
    fc.append(f"[w]vignette=angle=0.55:mode=forward,noise=c0s=7:c0f=t+u,"
              f"drawbox=x=0:y=0:w=1920:h=138:color=black:t=fill,drawbox=x=0:y=942:w=1920:h=138:color=black:t=fill,format=yuv420p[v]")
    run([FF, "-v", "error", "-y", *ins_, "-filter_complex", ";".join(fc), "-map", "[v]", "-r", str(FPS),
         "-t", f"{LENGTH:.3f}", "-c:v", "libx264", "-crf", "17", "-preset", "slow", "-tune", "grain", HERE + "/out/picture.mp4"])
    print("picture done")

if STEP in ("cards", "all"):
    json.dump([dict(kind=k, text=x) for (_, _, k, x) in CARDS], open(HERE + "/cards.json", "w"))
    run(["node", HERE + "/cards.mjs"])
if STEP in ("comp", "all"): composite(COMP)
if STEP in ("shots", "all"): render_shots()
if STEP in ("final", "all"): final()
json.dump(dict(B0=B0, BEAT=BEAT, SHOT_T=SHOT_T, A=A, HIT=HIT, DRIVE=DRIVE, DROP=DROP, TITLE=TITLE, END=END, LENGTH=LENGTH,
               cuts=[s["t0"] for s in S], cards=[(c[0], c[1], c[2]) for c in CARDS]), open(HERE + "/marks.json", "w"), indent=1)
