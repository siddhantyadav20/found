"""Fetches the trailer's real footage from Pexels and cuts each slot's clip.

    python3 marketing/trailer/footage.py          # → footage/<slot>.mp4, 1220×2060, 30 fps
    python3 marketing/trailer/footage.py fire ash # just those slots

Every Pexels clip is under the Pexels licence (free, commercial use allowed,
no attribution required), downloaded straight from videos.pexels.com by id,
and checked by eye before it goes in: no identifiable face. Nothing is
composited: every phone, hand, flame and clock here is really there.

A slot's clip is cut from its source at `start` for `dur` seconds, cropped
to 9:16 around `x` (0 = left edge, 1 = right) and `y`, and pushed in from
`zoom[0]` to `zoom[1]`. `speed` below 1 is slow motion (from a 50 or 60 fps
source); `blur` throws it out of focus; `dark` lowers it. A `still` (from
inserts.mjs) or a game `image` becomes a handheld shot of it.

`panels` stacks three shots in one frame, each a 2:1 strip with black between,
all moving at once: the split screen the tension references use. render.mjs
turns these into frames; trailer.html grades them.
"""

import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
FOOT = HERE / "footage"
SRC = FOOT / "src"
OW, OH, FPS = 1220, 2060, 30
V = "https://videos.pexels.com/video-files/{id}/{id}-{r}.mp4"

G = "public/found/raakh/"
CLIPS = {
    # slot: source, start, dur, crop, push-in, extras. id = Pexels; file/image = the game's own; still = a prop.
    # I. Lights out. A bulb dies; on a table of letters in the dark, a phone that isn't yours lights up.
    "bulb":      dict(id=853772, r="hd_1920_1080_25fps", start=4.8, dur=2.2, x=.5, zoom=(1.0, 1.06)),
    "phone":     dict(id=7821643, r="hd_1920_1080_30fps", start=2.8, dur=4.2, x=.48, y=.55, zoom=(1.12, 1.26), blur=6),
    "parcel":    dict(still="parcel.png", dur=1.6, zoom=(1.04, 1.12)),
    # II. The night, in hands and flames.
    "match":     dict(id=8618706, r="hd_1080_1920_30fps", start=4.6, dur=1.2, zoom=(1.0, 1.08)),
    "mehndi":    dict(id=15455199, r="hd_1080_1920_30fps", start=2.0, dur=.6, zoom=(1.0, 1.06)),
    "lamp":      dict(id=19971139, r="hd_1080_1920_60fps", start=1.5, dur=.6, speed=.6, zoom=(1.0, 1.06)),
    "bangles":   dict(id=2078587, r="hd_1920_1080_24fps", start=.5, dur=.6, x=.42, zoom=(1.0, 1.08)),
    "lighter":   dict(id=2544525, r="hd_1920_1080_24fps", start=9.7, dur=.6, x=.5, zoom=(1.1, 1.16)),
    "sparkler":  dict(id=6378175, r="hd_1080_1920_25fps", start=2.0, dur=.6, speed=.7, zoom=(1.0, 1.06)),
    "havan":     dict(id=15157494, r="hd_1920_1080_25fps", start=.8, dur=.6, x=.45, zoom=(1.0, 1.08)),
    "diyas":     dict(id=14182074, r="hd_1080_1920_30fps", start=1.0, dur=.6, zoom=(1.08, 1.0)),
    "fireworks": dict(id=14875803, r="hd_1080_1920_50fps", start=4.0, dur=.6, speed=.6, zoom=(1.0, 1.06)),
    "bokeh":     dict(id=854088, r="hd_1920_1080_25fps", start=1.0, dur=.6, x=.5, zoom=(1.1, 1.18)),
    "reel":      dict(file=G + "clip-reel-take.mp4", start=0.0, dur=1.2, zoom=(1.0, 1.08), blur=11, dark=.8),
    # III. After: someone searching in the dark, the gravel, the jerrycan, the fire, and it going out.
    "torch":     dict(id=18359612, r="hd_1920_1080_60fps", start=0.0, dur=2.4, x=.3, zoom=(1.0, 1.08)),
    "gravel":    dict(file=G + "clip-fire-whole.mp4", start=1.0, dur=2.0, zoom=(1.0, 1.06)),
    "jerrycan":  dict(file=G + "clip-fire-whole.mp4", start=11.0, dur=1.8, zoom=(1.0, 1.08)),
    "fire":      dict(file=G + "clip-fire.mp4", start=1.0, dur=2.4, zoom=(1.0, 1.1)),
    "candle":    dict(id=4055408, r="hd_1920_1080_30fps", start=1.4, dur=1.8, x=.7, zoom=(1.0, 1.1)),
    "smoke":     dict(id=7034152, r="hd_1920_1080_25fps", start=1.4, dur=1.8, x=.5, zoom=(1.0, 1.1)),
    # IV. You, putting it together; the clock.
    "board":     dict(id=8369880, r="hd_720_1366_25fps", start=2.0, dur=1.6, zoom=(1.0, 1.08)),
    "back":      dict(id=8369883, r="hd_1366_720_25fps", start=3.0, dur=1.4, x=.5, zoom=(1.0, 1.08)),
    "alarm":     dict(id=11267667, r="hd_1080_1920_30fps", start=1.0, dur=1.0, zoom=(1.0, 1.1)),
    "seconds":   dict(id=7033786, r="hd_1920_1080_25fps", start=2.0, dur=.8, x=.45, zoom=(1.0, 1.06)),
    "glass":     dict(id=12680281, r="hd_1920_1080_30fps", start=7.0, dur=.3, x=.3, zoom=(1.0, 1.04)),
    "note":      dict(still="note.png", dur=.3, zoom=(1.1, 1.08)),
    "poster":    dict(still="poster.png", dur=.3, zoom=(1.2, 1.16)),
    # V. Three at once: the clock, his phone, the poster.
    "three":     dict(dur=4.0, panels=[
        dict(id=7033786, r="hd_1920_1080_25fps", start=4.0, x=.45, zoom=(1.0, 1.1)),
        dict(id=7821643, r="hd_1920_1080_30fps", start=4.4, speed=.7, x=.5, y=.55, zoom=(1.3, 1.45), blur=4),
        dict(still="poster.png", x=.5, y=.2, zoom=(2.2, 2.5)),
    ]),
    "title_embers": dict(id=12605103, r="uhd_3840_2160_25fps", start=2.0, dur=6.0, x=.5, zoom=(1.0, 1.06)),
}


def frames_of(spec, dur):
    """The slot's source frames, as (W, H, iterator of RGB arrays)."""
    if "still" in spec or "image" in spec:
        im = Image.open(FOOT / "stills" / spec["still"] if "still" in spec else ROOT / spec["image"]).convert("RGB")
        a = np.asarray(im)
        return im.width, im.height, (a for _ in range(int(dur * FPS) + 1))
    src = ROOT / spec["file"] if "file" in spec else SRC / f"{spec['id']}-{spec['r']}.mp4"
    if not src.exists():
        SRC.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-sS", "-f", "-o", str(src), V.format(id=spec["id"], r=spec["r"])], check=True)
    info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                                      "-of", "json", str(src)], capture_output=True, check=True).stdout)["streams"][0]
    W, H = info["width"], info["height"]
    s = min(1.0, 2160 / H)  # work at most 2160 tall; the crop decides the rest
    W, H = int(W * s) // 2 * 2, int(H * s) // 2 * 2
    speed = spec.get("speed", 1.0)
    dec = subprocess.Popen(["ffmpeg", "-nostdin", "-loglevel", "quiet", "-ss", str(spec["start"]), "-t", str(dur * speed + .3), "-i", str(src),
                            "-vf", f"setpts=PTS/{speed},fps={FPS},scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                           stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)

    def read():
        last = None
        while True:
            raw = dec.stdout.read(W * H * 3)
            if len(raw) < W * H * 3:
                dec.stdout.close()
                dec.wait()
                while last is not None:  # hold the last frame if the source runs short
                    yield last
                return
            last = np.frombuffer(raw, np.uint8).reshape(H, W, 3)
            yield last
    return W, H, read()


def framed(f, W, H, spec, i, n, w, h):
    """One frame cropped to w×h around (x, y), pushed in over the shot; a still drifts as if handheld."""
    t = i / FPS
    z = spec["zoom"][0] + (spec["zoom"][1] - spec["zoom"][0]) * i / max(1, n - 1)
    # The largest w:h box the source holds, then pushed in.
    cw, ch = (H * w / h, H) if W / H > w / h else (W, W * h / w)
    cw, ch = cw / z, ch / z
    cx = spec.get("x", .5) * W
    cy = spec.get("y", .5) * H
    if "still" in spec or "image" in spec:
        cx += W * .006 * np.sin(t * 1.3) + W * .002 * np.sin(t * 3.7)
        cy += H * .005 * np.cos(t * 1.1)
    cx = min(max(cx, cw / 2), W - cw / 2)
    cy = min(max(cy, ch / 2), H - ch / 2)
    if spec.get("dark"):
        f = (f.astype(np.float32) * spec["dark"]).astype(np.uint8)
    im = Image.fromarray(f).resize((w, h), Image.LANCZOS, box=(cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2))
    if spec.get("blur"):
        im = im.filter(ImageFilter.GaussianBlur(spec["blur"]))
    return im


def encoder(slot):
    return subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{OW}x{OH}", "-r", str(FPS),
                             "-i", "-", "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-pix_fmt", "yuv420p", str(FOOT / f"{slot}.mp4")],
                            stdin=subprocess.PIPE)


def describe(spec):
    return (f"pexels {spec['id']} {spec['start']}s" if "id" in spec else f"game clip {spec['file']} {spec['start']}s" if "file" in spec
            else f"game image {spec['image']}" if "image" in spec else f"prop {spec['still']}")


def cut(slot, spec):
    n = int(spec["dur"] * FPS)
    enc = encoder(slot)
    if "panels" in spec:
        # Three 2:1 strips, black between, all moving at once.
        ph, gap = 560, 50
        top = (OH - 3 * ph - 2 * gap) // 2
        sources = [frames_of(p, spec["dur"]) for p in spec["panels"]]
        for i in range(n):
            canvas = Image.new("RGB", (OW, OH))
            for k, (p, (W, H, fr)) in enumerate(zip(spec["panels"], sources)):
                canvas.paste(framed(next(fr), W, H, p, i, n, OW, ph), (0, top + k * (ph + gap)))
            enc.stdin.write(canvas.tobytes())
        what = " / ".join(describe(p) for p in spec["panels"])
    else:
        W, H, fr = frames_of(spec, spec["dur"])
        for i in range(n):
            enc.stdin.write(framed(next(fr), W, H, spec, i, n, OW, OH).tobytes())
        what = describe(spec)
    enc.stdin.close()
    enc.wait()
    print(f"{slot:13s} ← {what} +{spec['dur']}s", flush=True)


if __name__ == "__main__":
    only = sys.argv[1:]
    for old in FOOT.glob("*.mp4"):
        if old.stem not in CLIPS:
            old.unlink()
    for slot, spec in CLIPS.items():
        if not only or slot in only:
            cut(slot, spec)
