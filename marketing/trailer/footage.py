"""Fetches the trailer's footage and cuts each slot's clip.

    python3 marketing/trailer/footage.py               # → footage/<slot>.mp4, 1220×2060, 30 fps
    python3 marketing/trailer/footage.py w_dhol a_fire # just those slots

All of it is real and Indian wherever a place shows: a wedding's pheras and
havan, Durga Puja's dhak, Diwali's fireworks, Delhi's fog and barricades.
Pexels clips (Pexels licence: free, commercial use allowed, no attribution
required) are downloaded from videos.pexels.com by id, Mixkit clips (Mixkit
licence: free, commercial use allowed) from assets.mixkit.co; the game's own
clips and the props from inserts.mjs fill the rest. Every clip was checked by
eye: no identifiable face, nothing graphic.

A slot's clip is cut from its source at `start` for `dur` seconds, cropped
to 9:16 around `x` (0 = left edge, 1 = right) and `y`, and pushed in from
`zoom[0]` to `zoom[1]`. `speed` below 1 is slow motion (from a 50 or 60 fps
source); `blur` throws it out of focus; `dark` lowers it. A `still` becomes a
handheld shot of it. `panels` stacks three shots in one frame. render.mjs
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
MK = "https://assets.mixkit.co/videos/{id}/{id}-720.mp4"

G = "public/found/raakh/"
CLIPS = {
    # slot: source, start, dur, crop, push-in, extras. id = Pexels; mk = Mixkit; file/image = the game's own; still = a prop.
    # I. Cold open: Delhi in fog; a phone that isn't yours; the parcel.
    "o_city":     dict(mk=9678, start=3.0, dur=2.5, x=.5, zoom=(1.0, 1.08)),
    "o_phone":    dict(id=7821643, r="hd_1920_1080_30fps", start=2.4, dur=3.4, x=.48, y=.55, zoom=(1.12, 1.24), blur=6),
    "o_parcel":   dict(still="parcel.png", dur=1.6, zoom=(1.04, 1.12)),
    # II. The wedding: the pheras, the havan, the dhak, sparklers, fireworks.
    "w_diya":     dict(id=19971137, r="hd_1080_1920_60fps", start=1.0, dur=1.0, zoom=(1.0, 1.08)),
    "w_dhol":     dict(id=5691239, r="hd_1280_720_30fps", start=.4, dur=.5, x=.55, zoom=(1.0, 1.06)),
    "w_pheras":   dict(id=15157549, r="hd_1920_1080_25fps", start=8.0, dur=.5, x=.5, zoom=(1.0, 1.06)),
    "w_rice":     dict(id=15157543, r="hd_1920_1080_25fps", start=2.6, dur=.5, x=.5, zoom=(1.0, 1.06)),
    "w_sparkler": dict(id=6971607, r="hd_1280_720_30fps", start=2.0, dur=.5, x=.5, zoom=(1.0, 1.08)),
    "w_chunni":   dict(id=15157545, r="hd_1920_1080_25fps", start=1.0, dur=.5, x=.5, zoom=(1.0, 1.06)),
    "w_sparklers": dict(id=10718916, r="hd_720_1280_30fps", start=4.0, dur=.5, zoom=(1.0, 1.06)),
    "w_feet":     dict(id=15157550, r="hd_1920_1080_25fps", start=1.0, dur=.5, x=.35, zoom=(1.0, 1.06)),
    "w_fireworks": dict(id=14182088, r="hd_1080_1920_30fps", start=15.3, dur=.5, zoom=(1.0, 1.06)),
    "w_havan":    dict(id=15157547, r="hd_1920_1080_25fps", start=3.0, dur=.5, x=.5, zoom=(1.0, 1.06)),
    "w_anar":     dict(id=14182087, r="hd_1080_1920_60fps", start=3.0, dur=.5, zoom=(1.0, 1.06)),
    "w_mehndi":   dict(id=15455198, r="hd_1080_1920_30fps", start=1.0, dur=.5, zoom=(1.0, 1.06)),
    "w_gun":      dict(id=5243197, r="hd_1920_1080_25fps", start=5.0, dur=1.5, x=.62, zoom=(1.1, 1.2)),
    "w_raise":    dict(file=G + "clip-reel-take.mp4", start=1.5, dur=1.0, zoom=(1.08, 1.14), blur=18, dark=.8),
    # III. After: a field in the morning fog, a torch, a corridor, the jerrycan, the fire, smoke.
    "a_field":    dict(mk=26140, start=18.0, dur=2.4, x=.6, zoom=(1.0, 1.08)),
    "a_torch":    dict(id=18359612, r="hd_1920_1080_60fps", start=0.0, dur=2.0, x=.3, zoom=(1.0, 1.08)),
    "a_door":     dict(id=15365457, r="hd_1080_1920_30fps", start=2.0, dur=1.4, zoom=(1.0, 1.08)),
    "a_jerrycan": dict(file=G + "clip-fire-whole.mp4", start=11.0, dur=1.6, zoom=(1.0, 1.08)),
    "a_fire":     dict(id=3948683, r="hd_1080_1920_30fps", start=4.0, dur=2.4, zoom=(1.0, 1.08)),
    "a_ash":      dict(id=5691247, r="hd_1080_1920_30fps", start=1.0, dur=2.2, zoom=(1.0, 1.08)),
    # IV. The build: each plays a moment, so each is cut long enough for its longest use.
    "m_rider":    dict(id=10597765, r="hd_1920_1080_25fps", start=3.0, dur=1.0, x=.5, zoom=(1.0, 1.08)),
    "m_poster":   dict(still="poster.png", dur=1.0, zoom=(1.2, 1.14)),
    "m_auto":     dict(id=12518558, r="hd_1080_1920_30fps", start=8.0, dur=1.0, zoom=(1.0, 1.06)),
    "m_car":      dict(id=15722036, r="hd_1920_1080_24fps", start=9.0, dur=1.0, x=.6, zoom=(1.0, 1.08)),
    "m_cracker":  dict(id=16510383, r="hd_1080_1920_60fps", start=1.5, dur=1.0, zoom=(1.0, 1.06)),
    "m_trails":   dict(id=13837044, r="hd_1366_720_24fps", start=1.0, dur=1.0, x=.5, zoom=(1.0, 1.06)),
    "m_aarti":    dict(id=13953530, r="hd_1920_1080_50fps", start=6.0, dur=1.0, x=.55, zoom=(1.0, 1.06)),
    "m_clock":    dict(id=8322053, r="hd_720_1366_25fps", start=4.0, dur=1.0, zoom=(1.0, 1.06)),
    "m_road":     dict(id=5691244, r="hd_720_1280_30fps", start=15.0, dur=1.0, zoom=(1.0, 1.06)),
    "m_city":     dict(id=20319188, r="hd_1920_1080_30fps", start=3.0, dur=1.0, x=.5, zoom=(1.1, 1.16)),
    # V. Seven.
    "s_dawn":     dict(id=10401761, r="hd_1920_1080_24fps", start=10.0, dur=4.2, x=.5, zoom=(1.0, 1.1)),
    "title_ash":  dict(id=12298312, r="hd_1920_1080_24fps", start=2.0, dur=6.0, x=.5, zoom=(1.0, 1.06)),
}


def frames_of(spec, dur):
    """The slot's source frames, as (W, H, iterator of RGB arrays)."""
    if "still" in spec or "image" in spec:
        im = Image.open(FOOT / "stills" / spec["still"] if "still" in spec else ROOT / spec["image"]).convert("RGB")
        a = np.asarray(im)
        return im.width, im.height, (a for _ in range(int(dur * FPS) + 1))
    if "file" in spec:
        src = ROOT / spec["file"]
    elif "mk" in spec:
        src = SRC / f"mixkit-{spec["mk"]}-720.mp4"
    else:
        src = SRC / f"{spec['id']}-{spec['r']}.mp4"
    if not src.exists():
        SRC.mkdir(parents=True, exist_ok=True)
        url = MK.format(id=spec["mk"]) if "mk" in spec else V.format(id=spec["id"], r=spec["r"])
        subprocess.run(["curl", "-sS", "-f", "-o", str(src), url], check=True)
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
    return (f"pexels {spec['id']} {spec['start']}s" if "id" in spec else f"mixkit {spec['mk']} {spec['start']}s" if "mk" in spec else f"game clip {spec['file']} {spec['start']}s" if "file" in spec
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
