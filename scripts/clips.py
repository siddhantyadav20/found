"""Build Raakh's video clips (2026-10-24): soundtrack, then picture.

For each clip: the wedding's or the fire's sound under it (public/sfx), the
shots and the laughter at the seconds its captions give, footsteps where
there are footsteps, and the voices (public/voices/raakh/clip-*.m4a, from
scripts/voices.py). Mixed here, then handed with the clip's frames to
scripts/clip.swift, which draws the picture and writes the mp4 to
public/found/raakh/.

Run:  python3 -I scripts/clips.py <work dir> <compiled clip tool>
Needs macOS's afconvert. Pure-Python mixing; no numpy.
"""
import array, json, math, os, random, subprocess, sys, wave

WORK, CLIP = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RATE = 24000
R = os.path.join(ROOT, "public", "found", "raakh")
FRAMES = os.path.join(ROOT, "scripts", "frames", "raakh")
os.makedirs(WORK, exist_ok=True)


def load(path):
    wav_ = os.path.join(WORK, os.path.basename(path) + ".wav")
    subprocess.run(["afconvert", "-f", "WAVE", "-d", f"LEI16@{RATE}", "-c", "1", path, wav_], check=True)
    # afconvert writes WAVE_FORMAT_EXTENSIBLE, which the wave module won't read: find the data chunk by hand.
    raw = open(wav_, "rb").read()
    i = 12
    while raw[i : i + 4] != b"data":
        i += 8 + int.from_bytes(raw[i + 4 : i + 8], "little")
    n = int.from_bytes(raw[i + 4 : i + 8], "little")
    a = array.array("h", raw[i + 8 : i + 8 + n])
    return [x / 32768.0 for x in a]


def sfx(name):
    return load(os.path.join(ROOT, "public", "sfx", f"found-{name}-1.m4a"))


def voice(key):
    return load(os.path.join(ROOT, "public", "voices", "raakh", key + ".m4a"))


def lay(track, sound, at, gain, fade_in=0.0, until=None):
    i0 = int(at * RATE)
    end = len(track) if until is None else min(len(track), int(until * RATE))
    fi = max(1, int(fade_in * RATE))
    for i, v in enumerate(sound):
        j = i0 + i
        if j >= end:
            break
        if j >= 0:
            k = min(1.0, i / fi) if fade_in else 1.0
            track[j] += v * gain * k


def bed(track, sound, gain, start=0.0, until=None, fade_in=0.0):
    t = start
    while t < (until or len(track) / RATE):
        lay(track, sound, t, gain, fade_in if t == start else 0, until)
        t += len(sound) / RATE - 0.05


def steps(track, start, end, every=0.55, gain=0.35):
    rnd = random.Random(3)
    t = start
    while t < end:
        n = int(0.09 * RATE)
        crunch = [rnd.uniform(-1, 1) * math.exp(-i / (0.025 * RATE)) for i in range(n)]
        # Gravel: low and short, a hand's swing apart.
        y = 0.0
        out = []
        for v in crunch:
            y = y * 0.82 + v * 0.18
            out.append(y)
        lay(track, out, t, gain)
        t += every + rnd.uniform(-0.06, 0.06)


def write(track, name, cut=None):
    if cut is not None:
        for i in range(int(cut * RATE), len(track)):
            track[i] = 0.0
    peak = max(1e-6, max(abs(v) for v in track))
    g = min(1.0, 0.92 / peak)
    wav_ = os.path.join(WORK, name + ".mix.wav")
    with wave.open(wav_, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(array.array("h", [max(-32767, min(32767, int(v * g * 32767))) for v in track]).tobytes())
    m4a = os.path.join(WORK, name + ".mix.m4a")
    subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "48000", wav_, m4a], check=True)
    return m4a


def silent(seconds):
    return [0.0] * int(seconds * RATE)


dhol, shot, laugh, fire = sfx("dhol"), sfx("shot"), sfx("laugh"), sfx("fire")
clips = []

# The reel take, 12:31 AM (RAAKH-V3 §16): the wedding far off, one shot up, laughter, "Ek aur, pose mein—",
# the second shot, nobody speaking, "Dilip?", footsteps toward the tripod, and the recording stops.
t = silent(18)
bed(t, dhol, 0.18, until=17.6)
lay(t, shot, 8.6, 0.95)
lay(t, laugh, 9.0, 0.55, until=10.1)
lay(t, shot, 13.0, 0.95)
steps(t, 16.2, 17.6, every=0.32, gain=0.5)
lay(t, voice("clip-reel-take"), 0, 1.0)
clips.append(("reel-take", write(t, "reel-take", cut=17.6), 18, 17.6))

# Kunal's clip, 11:52 PM: the dance floor at full volume, two shots, cheering, "Oye hoye!".
t = silent(14)
bed(t, dhol, 0.85)
lay(t, shot, 5.0, 1.0)
lay(t, shot, 5.38, 1.0)
lay(t, laugh, 7.0, 0.8)
lay(t, voice("clip-k-3"), 0, 1.0)
clips.append(("k-3", write(t, "k-3"), 14, None))

# The fire, trimmed to its first nine seconds: nothing lit yet. Footsteps, something heavy set down, "Uske kapde bhi."
t = silent(9)
steps(t, 0.4, 2.2)
lay(t, voice("clip-fire"), 0, 1.0)
clips.append(("fire", write(t, "fire"), 9, None))

# The whole fire, in his locked note: footsteps, the jerrycan set down, "Uske kapde bhi.", and from 13 s the fire taking.
t = silent(31)
steps(t, 0.4, 2.2)
bed(t, fire, 0.8, start=13.0, fade_in=2.5)
lay(t, voice("clip-fire-whole"), 0, 1.0)
clips.append(("fire-whole", write(t, "fire-whole"), 31, None))

json.dump([{"key": k, "audio": a, "seconds": s, "black": b} for k, a, s, b in clips], open(os.path.join(WORK, "clips.json"), "w"), indent=1)
print("mixed", [c[0] for c in clips])

# The picture: each clip's frames and moves, then the mp4.
SHOTS = json.load(open(os.path.join(ROOT, "scripts", "clips.raakh.json")))
STAND_IN = {"reel-1.jpg": "reel-take-2.jpg", "reel-2.jpg": "reel-take-2.jpg", "reel-3.jpg": "reel-take-2.jpg", "kunal-fire.jpg": "kunal-frame.jpg", "gravel.jpg": "w-blur.jpg", "jerrycan.jpg": "fire-mattress.jpg"}
for key, audio, seconds, black in clips:
    spec = dict(SHOTS[key])
    spec.update({"out": os.path.join(R, f"clip-{key}.mp4"), "width": 540, "height": 960, "fps": 24, "seconds": seconds, "audio": audio})
    for s in spec["shots"]:
        # A frame not shot yet stands in with the nearest one that has been.
        # Frames shot for a clip live with the scripts, not in public/ (only the footage ships).
        own = os.path.join(FRAMES, s["image"])
        s["image"] = own if os.path.exists(own) else os.path.join(R, s["image"] if os.path.exists(os.path.join(R, s["image"])) else STAND_IN[s["image"]])
    if black is not None:
        spec["blackFrom"] = black
    path = os.path.join(WORK, f"spec-{key}.json")
    json.dump(spec, open(path, "w"))
    subprocess.run([CLIP, path], check=True)
