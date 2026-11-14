# RAAKH trailer v7: the edit as data. Indian footage only, none of it from v4; the game as its
# own screens, captured from the running build; every transition a cut on the grid.
# Usage: python3 edit.py [cards|shots|final|all]
# 1920x1080 at 24 fps, picture in a 2.39:1 scope frame (1920x804 at y=138).
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
FF = HERE + "/../v5/node_modules/ffmpeg-static/ffmpeg"
STEP = sys.argv[1] if len(sys.argv) > 1 else "all"
SRC, GAME = HERE + "/src/", HERE + "/game/desktop/"
FPS, PW, PH = 24, 1920, 804

# ---- the grid ----
BEAT, B0 = 0.716, 9.6                 # dhol-midnight: beat 0.716 s; song time 9.28 lands on B0
def b(k): return round(B0 + k * BEAT, 3)
SHOT_T = b(21)                        # 24.636: the gunshot, on the beat
A = 28.6                              # the cue (Dark Mystery Trailer) starts here
HIT = [A, A + 4.39, A + 8.78, A + 13.1]
DRIVE, DROP, TITLE, END = A + 19.9, A + 37.15, A + 39.38, A + 43.72
LENGTH = 80.0

WARM = "eq=contrast=1.07:saturation=1.02:gamma=0.98,colorbalance=rs=0.03:bs=-0.03:rh=0.05:bh=-0.04"
COLD = "eq=contrast=1.12:saturation=0.74:gamma=0.94,colorbalance=rs=-0.05:gs=-0.01:bs=0.07:rm=-0.02:bm=0.03:rh=0.03:bh=-0.02"
UI = "eq=contrast=1.03:saturation=0.96"
FILM = "curves=all='0/0.018 0.18/0.15 0.5/0.5 0.82/0.84 1/0.955'"

S = []
def shot(t0, t1, f, src_in=0.0, speed=1.0, grade=COLD, zoom=1.0, fx=0.5, fy=0.5, extra=""):
    S.append(dict(kind="clip", t0=round(t0, 3), t1=round(t1, 3), f=f, src=src_in, speed=speed, grade=grade, zoom=zoom, fx=fx, fy=fy, extra=extra))
def still(t0, t1, f, z0, z1, fx, fy, grade=UI, dark_in=0.0):
    """A game capture (3840x2160), pushed in slowly: zoom z is source width / window width."""
    S.append(dict(kind="still", t0=round(t0, 3), t1=round(t1, 3), f=f, z0=z0, z1=z1, fx=fx, fy=fy, grade=grade, dark_in=dark_in))
G = lambda name: GAME + name

# ── COLD OPEN: the bell, the parcel, what was in it
shot(0.3, 1.9, SRC + "7702049.mp4", 9.4, 1.0, COLD + ",eq=brightness=-0.03", 1.0, 0.5, 0.5)       # a hand at the doorbell
shot(1.9, 3.9, SRC + "6667254.mp4", 2.0, 1.0, COLD, 1.05, 0.5, 0.45)                              # the parcel, received
still(3.9, 6.4, G("03-parcel.png"), 3.3, 3.8, 0.135, 0.83)                                        # RETURN TO ORIGIN
still(6.4, 8.2, G("06-envelope-back.png"), 2.5, 2.8, 0.35, 0.55)                                   # "M — sab isme hai."
still(8.2, B0, G("07-lock.png"), 2.5, 2.75, 0.5, 0.6)                                              # 47 Missed Calls
# ── ACT ONE: the wedding, on the dhol
shot(b(0), b(3), SRC + "34431085.mp4", 6.0, 1.0, WARM, 1.0, 0.5, 0.5)                             # the lawn from the air
shot(b(3), b(5), SRC + "38804596.mp4", 8.0, 1.0, WARM, 1.0, 0.5, 0.5)                             # chandeliers under the tent
shot(b(5), b(7), SRC + "34187403.mp4", 2.0, 1.0, WARM, 1.05, 0.5, 0.5)                            # mehndi
shot(b(7), b(9), SRC + "29766220.mp4", 6.0, 1.0, WARM, 1.0, 0.5, 0.5)                             # the pheras, hands and fire
shot(b(9), b(11), SRC + "29028274.mp4", 4.0, 1.0, WARM, 1.05, 0.5, 0.45)                          # everyone dancing
shot(b(11), b(13), SRC + "7685157.mp4", 1.0, 1.0, WARM, 1.0, 0.5, 0.45)                           # sparklers
shot(b(13), b(15), SRC + "35764324.mp4", 1.5, 0.7, WARM, 1.0, 0.5, 0.45)                          # a twirl in the dark
shot(b(15), b(17), SRC + "18522875.mp4", 10.0, 0.8, WARM, 1.0, 0.5, 0.4)                          # the bride
shot(b(17), b(19), SRC + "29217159.mp4", 1.0, 1.0, WARM, 1.0, 0.5, 0.5)                           # an anar, sparks
shot(b(19), b(20), SRC + "15157547.mp4", 3.0, 1.0, WARM, 1.05, 0.5, 0.5)                          # the fire, close
shot(b(20), SHOT_T, SRC + "29277472.mp4", 4.0, 1.0, WARM, 1.0, 0.5, 0.5)                          # the farmhouse lit up, from above
# SHOT_T: one white frame, then black (added in final()).
# ── ACT TWO: the night, on the cue's hits
shot(HIT[0], HIT[1], SRC + "30837748.mp4", 2.0, 0.9, COLD, 1.0, 0.5, 0.5)                         # a station in the fog
shot(HIT[1], HIT[2], SRC + "9481662.mp4", 5.0, 1.0, COLD, 1.0, 0.5, 0.5)                          # rain on a Delhi road
shot(HIT[2], HIT[3], SRC + "35680723.mp4", 0.5, 0.8, COLD, 1.05, 0.5, 0.5)                        # a petrol pump at night
shot(HIT[3], 44.6, SRC + "3795117.mp4", 2.0, 1.0, COLD, 1.0, 0.5, 0.5)                            # a man walks a dark street
shot(44.6, DRIVE, SRC + "30358172.mp4", 3.0, 0.8, COLD + ",eq=brightness=-0.03", 1.0, 0.5, 0.45)  # the city under smog, at dawn
# ── ACT THREE: the phone (the drive)
shot(DRIVE, 50.0, SRC + "8070888.mp4", 12.0, 1.0, COLD, 1.0, 0.5, 0.45)                           # a man in bed with it
still(50.0, 51.4, G("09-incoming-call.png"), 2.3, 2.5, 0.5, 0.24)                                   # a call: +91 62••• •4417
shot(51.4, 52.6, SRC + "34796502.mp4", 6.0, 1.0, COLD, 1.05, 0.5, 0.5)                            # thumbs on the glass
still(52.6, 53.9, G("14-wa-raju-top.png"), 2.6, 2.8, 0.5, 0.42)                                    # LAPATA
shot(53.9, 55.1, SRC + "15083562.mp4", 4.0, 1.0, COLD, 1.0, 0.5, 0.45)                            # a woman, a balcony, her phone
still(55.1, 56.3, G("20-wa-m-top.png"), 2.6, 2.8, 0.5, 0.5)                                            # voice notes to M
shot(56.3, 57.3, SRC + "8458497.mp4", 6.0, 1.0, COLD, 1.0, 0.5, 0.5)                              # hands over a face
still(57.3, 58.7, G("18-casefile.png"), 2.1, 2.25, 0.86, 0.5)                                          # the whole desk: phone and case file
still(58.7, 59.7, G("10-low-battery.png"), 3.2, 3.4, 0.5, 0.49)                             # a curtain closed
still(59.7, 60.7, G("21-wa-bhasin-top.png"), 2.6, 2.8, 0.5, 0.5)                                       # Bhasin
# the night, faster
MONT = [(SRC + "36498235.mp4", 3.0, 1.0, COLD), (SRC + "9481660.mp4", 4.0, 1.0, COLD), (SRC + "32031047.mp4", 20.0, 1.0, COLD),
        (SRC + "38979012.mp4", 8.0, 1.0, COLD), ("still", G("13-wa-raju.png")), (SRC + "29217159.mp4", 3.0, 1.0, WARM),
        (SRC + "17812439.mp4", 10.0, 1.0, COLD), ("still", G("16-photos.png")), (SRC + "6319109.mp4", 5.0, 1.0, COLD),
        (SRC + "35778192.mp4", 2.0, 1.0, COLD), (SRC + "10853328.mp4", 10.0, 1.0, COLD)]
D = [0.5, 0.42, 0.36, 0.3, 0.26, 0.22, 0.19, 0.16, 0.14, 0.12, 0.1]
k = (DROP - 60.7) / sum(D); t = 60.7
for i, (m, d) in enumerate(zip(MONT, D)):
    t1 = DROP if i == len(D) - 1 else round(t + d * k, 3)
    if m[0] == "still": still(t, t1, m[1], 3.0, 3.2, 0.5, 0.5)
    else: shot(t, t1, m[0], m[1], m[2], m[3], 1.1, 0.5, 0.5)
    t = t1
# DROP: silence, black. TITLE: sparks, slowed. END: the end card.
shot(TITLE, END, SRC + "29217159.mp4", 3.0, 0.35, COLD + ",eq=brightness=-0.28:saturation=0.95:contrast=1.1,gblur=sigma=1.2", 1.15, 0.5, 0.5)
# the button: the phone lights once more
still(END + 4.3, LENGTH - 0.4, G("07-lock.png"), 2.3, 2.4, 0.5, 0.58, UI, dark_in=0.5)

CARDS = [
    (b(1), b(4), "pic", "A wedding in Delhi."),
    (b(9), b(12), "pic", "21 November."),
    (25.6, 28.2, "blk", "One boy didn’t go home."),
    (29.4, 32.4, "pic", "He was nineteen."),
    (33.8, 36.8, "pic", "No police."),
    (38.2, 41.1, "pic", "No hospital."),
    (42.3, 44.4, "pic", "No body."),
    (45.1, 48.2, "pic", "By morning, it never happened."),
    (48.7, 51.2, "pic", "But someone kept the phone."),
    (54.0, 56.2, "pic", "And now it’s in your hands."),
    (57.4, 59.5, "pic", "Find out what they did."),
    (60.8, 63.4, "pic", "They want it back by seven."),
    (DROP + 0.45, TITLE - 0.25, "blk", "Everyone has a version."),
    (TITLE, END - 0.05, "title", "CHAPTER ONE"),
    (END + 0.05, END + 4.2, "end", ""),
]

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(" ".join(cmd)); print(r.stderr[-2000:]); sys.exit(1)

def segments():
    seg, t = [], 0.0
    for s in sorted(S, key=lambda x: x["t0"]):
        if s["t0"] > t + 1e-3: seg.append(dict(kind="black", t0=t, t1=s["t0"]))
        seg.append(s); t = s["t1"]
    if t < LENGTH: seg.append(dict(kind="black", t0=t, t1=LENGTH))
    return seg

def render_shots():
    os.makedirs(HERE + "/seg", exist_ok=True)
    seg = segments(); files = []
    for i, s in enumerate(seg):
        n = round(s["t1"] * FPS) - round(s["t0"] * FPS)
        out = f"{HERE}/seg/{i:03d}.mp4"; files.append(out)
        if n <= 0: files.pop(); continue
        if s["kind"] == "black":
            run([FF, "-v", "error", "-y", "-f", "lavfi", "-i", f"color=black:s={PW}x{PH}:r={FPS}", "-frames:v", str(n),
                 "-c:v", "libx264", "-crf", "10", "-preset", "fast", "-pix_fmt", "yuv420p", out]); continue
        if s["kind"] == "still":
            # a 3840x2160 capture: take the 2.39 band at fy, then push in with zoompan
            band_h = round(3840 / (PW / PH))
            y0 = min(max(0.0, s['fy'] * 2160 - band_h / 2), 2160 - band_h)
            fyb = (s['fy'] * 2160 - y0) / band_h
            z = f"({s['z0']}+({s['z1']}-{s['z0']})*on/{n})"
            vf = (f"scale=3840:-2,crop=3840:{band_h}:0:{y0:.0f},"
                  f"zoompan=z='{z}':x='{s['fx']}*iw-iw/zoom/2':y='{fyb:.4f}*ih-ih/zoom/2':d=1:s={PW}x{PH}:fps={FPS},{s['grade']},{FILM}")
            if s.get("dark_in"): vf += f",fade=t=in:st=0:d={s['dark_in']}"
            run([FF, "-v", "error", "-y", "-loop", "1", "-framerate", str(FPS), "-i", s["f"], "-vf", vf, "-frames:v", str(n),
                 "-c:v", "libx264", "-crf", "10", "-preset", "fast", "-pix_fmt", "yuv420p", out])
            print(f"{i:03d} {s['t0']:6.2f}-{s['t1']:6.2f} still {os.path.basename(s['f'])}"); continue
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
        d = t1 - t0; fi = 0.12 if kind == "pic" and d < 1.4 else 0.3; fo = 0.12 if d < 1.4 else 0.3
        if kind == "title": fi, fo = 0.042, 0.5
        if kind == "end": fi, fo = 0.042, 0.6
        ins_ += ["-loop", "1", "-t", f"{d:.3f}", "-framerate", str(FPS), "-i", f"{HERE}/cards/c{i:02d}.png"]
        fc.append(f"[{i+1}:v]format=rgba,fade=t=in:st=0:d={fi}:alpha=1,fade=t=out:st={d-fo:.3f}:d={fo}:alpha=1,setpts=PTS+{t0:.3f}/TB[c{i}]")
        fc.append(f"[{last}][c{i}]overlay=eof_action=pass:format=auto[o{i}]"); last = f"o{i}"
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
if STEP in ("shots", "all"): render_shots()
if STEP in ("final", "all"): final()
json.dump(dict(B0=B0, BEAT=BEAT, SHOT_T=SHOT_T, A=A, HIT=HIT, DRIVE=DRIVE, DROP=DROP, TITLE=TITLE, END=END, LENGTH=LENGTH,
               cuts=[s["t0"] for s in S], cards=[(c[0], c[1], c[2]) for c in CARDS]), open(HERE + "/marks.json", "w"), indent=1)
