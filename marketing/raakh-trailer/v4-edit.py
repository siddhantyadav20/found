# RAAKH trailer v4: the edit as data. Real footage only, cut to the score.
# Usage: python edit.py <ffmpeg> [cards|shots|final|all]
# 1920x1080 at 24 fps, picture in a 2.39:1 scope frame (1920x804 at y=138).
import json, os, subprocess, sys
FF = sys.argv[1]; STEP = sys.argv[2] if len(sys.argv) > 2 else "all"
HERE = os.path.dirname(os.path.abspath(__file__))
SRC, OLD = HERE + "/src/", HERE + "/../src/"
FPS, PW, PH = 24, 1920, 804

# Score markers (trailer seconds). Act 1 rides the dhol track on a 0.572 s beat;
# acts 2-3 ride "Dark Mystery Trailer", which starts at A.
BEAT, B0 = 0.572, 1.5
def b(k): return round(B0 + k * BEAT, 3)
SHOT_T = b(29)                                  # the gunshot, on the beat
A = 21.0
HIT = [A + 0.0, A + 4.39, A + 8.78, A + 13.1]   # four slow booms
DRIVE, DROP, TITLE, END = A + 19.9, A + 37.15, A + 39.38, A + 43.72
LENGTH = 72.6

# Grades: memory (warm, alive) for the wedding; night (cold, crushed) after the shot.
WARM = "eq=contrast=1.07:saturation=1.02:gamma=0.98,colorbalance=rs=0.03:bs=-0.03:rh=0.05:bh=-0.04"
COLD = "eq=contrast=1.12:saturation=0.74:gamma=0.94,colorbalance=rs=-0.05:gs=-0.01:bs=0.07:rm=-0.02:bm=0.03:rh=0.03:bh=-0.02"
FILM = "curves=all='0/0.018 0.18/0.15 0.5/0.5 0.82/0.84 1/0.955'"

S = []  # (t0, t1, file, src_in, speed, grade, zoom, fx, fy, extra)
def shot(t0, t1, f, src_in, speed=1.0, grade=COLD, zoom=1.0, fx=0.5, fy=0.5, extra=""):
    S.append(dict(t0=round(t0, 3), t1=round(t1, 3), f=f, src=src_in, speed=speed, grade=grade, zoom=zoom, fx=fx, fy=fy, extra=extra))

# ── ACT ONE: the wedding (cuts on the dhol)
shot(b(0),  b(7),  SRC + "38804641.mp4", 20.0, 0.5, WARM, 1.0, 0.5, 0.5)      # aerial: the venue lit up
shot(b(7),  b(10), SRC + "4174213.mp4",  2.4,  0.8, WARM, 1.05, 0.5, 0.45)     # the party
shot(b(10), b(12), SRC + "7685044.mp4",  1.0,  0.8, WARM, 1.0, 0.5, 0.4)       # sparklers
shot(b(12), b(14), SRC + "30077981.mp4", 2.0,  0.4, WARM, 1.0, 0.5, 0.5)       # the dance floor, slowed
shot(b(14), b(18), SRC + "4824123.mp4",  2.3,  0.8, WARM, 1.0, 0.5, 0.35)      # a boy, a sparkler
shot(b(18), b(20), SRC + "35008225.mp4", 4.0,  1.0, WARM, 1.05, 0.5, 0.5)      # everyone dancing
shot(b(20), b(24), OLD + "13953530.mp4", 4.5,  0.5, WARM, 1.0, 0.5, 0.5)       # phones up, filming
shot(b(24), b(26), SRC + "17735952.mp4", 7.4,  0.8, WARM, 1.0, 0.5, 0.45)      # fireworks
shot(b(26), b(28), SRC + "33287257.mp4", 5.8,  1.0, WARM, 1.0, 0.5, 0.5)       # fireworks over the city
shot(b(28), b(29), SRC + "4824123.mp4",  8.6,  0.8, WARM, 1.15, 0.5, 0.33)     # the boy, closer
# SHOT_T: the gunshot. Black.
# ── ACT TWO: the night
shot(HIT[0], HIT[1], SRC + "11792115.mp4", 4.6, 0.96, COLD, 1.0, 0.5, 0.5)     # a figure walks into the fog
shot(HIT[1], HIT[2], SRC + "28780676.mp4", 2.4, 0.96, COLD, 1.0, 0.5, 0.55)    # a roadside, a car leaving
shot(HIT[2], HIT[3], SRC + "28928755.mp4", 0.6, 0.8,  COLD, 1.0, 0.5, 0.6)     # an empty road
shot(HIT[3], 37.0,   SRC + "38328416.mp4", 0.4, 0.48, COLD + ",eq=saturation=1.2", 1.0, 0.5, 0.5)   # figures around a pyre
shot(37.0,   38.7,   SRC + "38328417.mp4", 0.6, 0.48, COLD + ",eq=saturation=1.2", 1.0, 0.5, 0.5)    # someone watches it burn
shot(38.7,   DRIVE,  SRC + "6383997.mp4",  9.0, 0.8,  COLD + ",eq=saturation=1.1", 1.1, 0.5, 0.5)    # ash
# ── ACT THREE: the phone (the drive)
shot(DRIVE, 43.3, SRC + "35999376.mp4", 1.6, 0.4, COLD, 1.0, 0.5, 0.55)       # a hand reaches for a phone
shot(43.3,  44.8, OLD + "7821643.mp4",  4.4, 0.8, COLD, 1.08, 0.45, 0.5)      # the phone on the envelopes wakes
shot(44.8,  46.7, SRC + "5281602.mp4",  2.6, 0.8, COLD, 1.1, 0.5, 0.35)       # a face lit by a screen
shot(46.7,  47.95, SRC + "28828935.mp4", 3.6, 0.48, COLD, 1.0, 0.5, 0.5)      # thumbs through the chats
shot(47.95, 49.15, SRC + "34786878.mp4", 3.0, 0.48, COLD, 1.0, 0.5, 0.5)      # a message lands
shot(49.15, 50.35, SRC + "39494839.mp4", 5.0, 0.96, COLD, 1.0, 0.5, 0.5)      # typing
shot(50.35, 51.55, SRC + "7924639.mp4",  2.0, 0.96, COLD, 1.05, 0.5, 0.4)     # awake at night
shot(51.55, 53.3, OLD + "1190185.mp4",  8.0, 0.8, COLD + ",eq=brightness=0.03:contrast=1.15", 1.25, 0.42, 0.45)  # 5:00 AM
# the night, faster
MONT = [(SRC + "10385802.mp4", 9.0, 0.96), (SRC + "31153703.mp4", 5.0, 0.8), (SRC + "11839716.mp4", 1.0, 0.96),
        (SRC + "9085510.mp4", 6.4, 0.8), (SRC + "34703788.mp4", 4.0, 0.4), (OLD + "10597765.mp4", 3.0, 0.96),
        (OLD + "13643105.mp4", 3.0, 0.96), (SRC + "4824123.mp4", 6.2, 0.8), (SRC + "5509723.mp4", 3.0, 0.8),
        (SRC + "6580999.mp4", 20.0, 1.0), (OLD + "12165393.mp4", 4.0, 0.96), (SRC + "7948198.mp4", 14.6, 1.0),
        (SRC + "33287257.mp4", 16.6, 1.0), (SRC + "854309.mp4", 11.4, 0.8)]
D = [0.62, 0.55, 0.5, 0.46, 0.42, 0.38, 0.35, 0.32, 0.3, 0.28, 0.26, 0.24, 0.22, 0.2]
k = (DROP - 53.3) / sum(D); t = 53.3
for i, ((f, si, sp), d) in enumerate(zip(MONT, D)):
    t1 = DROP if i == len(D) - 1 else round(t + d * k, 3)
    shot(t, t1, f, si, sp, WARM if "4824123" in f or "33287257" in f or "854309" in f else COLD, 1.1, 0.5, 0.5)
    t = t1
# DROP: silence, black. TITLE: ash, RAAKH. END: end card on black.
shot(TITLE, END, SRC + "6383997.mp4", 20.0, 0.6, COLD + ",eq=brightness=-0.27:saturation=0.8:contrast=0.9,gblur=sigma=2.4", 1.15, 0.5, 0.5)
# button: a phone lights up in the dark
shot(69.4, 71.7, SRC + "34786878.mp4", 2.2, 0.48, COLD, 1.0, 0.5, 0.5)

# ── Words. pic = over picture (lower scope), blk = on black, centred.
CARDS = [
    (2.3, 5.2, "pic", "A wedding in Delhi."),
    (9.7, 11.6, "pic", "Everyone was dancing."),
    (13.1, 15.1, "pic", "Every phone was recording."),
    (19.0, 20.85, "blk", "One boy didn’t go home."),
    (22.0, 24.9, "pic", "He was nineteen."),
    (26.3, 29.2, "pic", "No police."),
    (30.7, 33.6, "pic", "No hospital."),
    (34.9, 37.0, "pic", "No body."),
    (37.6, 40.6, "pic", "By morning, it never happened."),
    (41.3, 43.6, "pic", "But someone kept the phone."),
    (44.95, 47.3, "pic", "And now it’s in your hands."),
    (47.95, 49.1, "pic", "Unlock it."),
    (49.15, 50.3, "pic", "Read everything."),
    (50.35, 51.5, "pic", "Find out what they did."),
    (51.55, 53.3, "pic", "They want it back by seven."),
    (DROP + 0.45, TITLE - 0.25, "blk", "Everyone has a version."),
    (TITLE, END - 0.05, "title", "CHAPTER ONE"),
    (END + 0.05, 69.25, "end", ""),
]

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(" ".join(cmd)); print(r.stderr[-2000:]); sys.exit(1)

def segments():
    """The full timeline as contiguous segments: shots, with black in the gaps."""
    seg, t = [], 0.0
    for s in sorted(S, key=lambda x: x["t0"]):
        if s["t0"] > t + 1e-3: seg.append(dict(t0=t, t1=s["t0"], black=True))
        seg.append(s); t = s["t1"]
    if t < LENGTH: seg.append(dict(t0=t, t1=LENGTH, black=True))
    return seg

def render_shots():
    os.makedirs(HERE + "/seg", exist_ok=True)
    seg = segments(); files = []
    # frame-accurate boundaries: each segment gets round(t1*24)-round(t0*24) frames
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
    ins = ["-i", HERE + "/out/cut.mp4"]; fc = [f"[0:v]pad=1920:1080:0:138:black,setsar=1[v0]"]; last = "v0"
    for i, (t0, t1, kind, _) in enumerate(CARDS):
        d = t1 - t0; fi = 0.12 if kind == "pic" and d < 1.4 else 0.35; fo = 0.12 if d < 1.4 else 0.4
        if kind in ("title",): fi, fo = 0.042, 0.5
        if kind == "end": fi, fo = 0.042, 0.6
        ins += ["-loop", "1", "-t", f"{d:.3f}", "-framerate", str(FPS), "-i", f"{HERE}/cards/c{i:02d}.png"]
        fc.append(f"[{i+1}:v]format=rgba,fade=t=in:st=0:d={fi}:alpha=1,fade=t=out:st={d-fo:.3f}:d={fo}:alpha=1,setpts=PTS+{t0:.3f}/TB[c{i}]")
        fc.append(f"[{last}][c{i}]overlay=eof_action=pass:format=auto[o{i}]"); last = f"o{i}"
    # film: soft vignette inside the scope, fine moving grain, keep the bars pure black
    fc.append(f"[{last}]vignette=angle=0.55:mode=forward,noise=c0s=7:c0f=t+u,"
              f"drawbox=x=0:y=0:w=1920:h=138:color=black:t=fill,drawbox=x=0:y=942:w=1920:h=138:color=black:t=fill,format=yuv420p[v]")
    run([FF, "-v", "error", "-y", *ins, "-filter_complex", ";".join(fc), "-map", "[v]", "-r", str(FPS),
         "-t", f"{LENGTH:.3f}", "-c:v", "libx264", "-crf", "17", "-preset", "slow", "-tune", "grain", HERE + "/out/picture.mp4"])
    print("picture done")

if STEP in ("cards", "all"):
    json.dump([dict(kind=k, text=x) for (_, _, k, x) in CARDS], open(HERE + "/cards.json", "w"))
    run(["node", HERE + "/cards.mjs"])
if STEP in ("shots", "all"): render_shots()
if STEP in ("final", "all"): final()
json.dump(dict(SHOT_T=SHOT_T, A=A, HIT=HIT, DRIVE=DRIVE, DROP=DROP, TITLE=TITLE, END=END, LENGTH=LENGTH,
               cuts=[s["t0"] for s in S]), open(HERE + "/marks.json", "w"), indent=1)
