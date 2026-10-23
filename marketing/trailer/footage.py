"""Fetches the trailer's real footage from Pexels and cuts each slot's clip.

    python3 marketing/trailer/footage.py          # → footage/<slot>.mp4, 1220×2060, 30 fps

Every clip is Pexels footage under the Pexels licence (free, commercial use
allowed, no attribution required), downloaded straight from videos.pexels.com
by id. Each one is checked by eye before it goes in: no identifiable face.

A slot's clip is cut from its source at `start` for `dur` seconds, cropped
to 9:16 around `x` (0 = left edge, 1 = right), pushed in from `zoom[0]` to
`zoom[1]`, and, for the two green-screen phones, given Sameer's lock screen:
  key="screen" replaces the whole screen quad (the table phone has tracking
               crosses on its green);
  key="chroma" replaces only the green (a thumb crosses the hand-held one).
`dark` darkens everything but the screen, to turn a daylit table into a
night room; `wake` is when the screen comes on, and `glow` how much of its
light falls on the table. `speed` below 1 is slow motion (from a 50 fps
source). `y` moves the crop up or down. A `still` (from inserts.mjs) becomes
a handheld shot of a prop. render.mjs turns these into frames; trailer.html grades them.
"""

import json
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
FOOT = HERE / "footage"
SRC = FOOT / "src"
OW, OH, FPS = 1220, 2060, 30
V = "https://videos.pexels.com/video-files/{id}/{id}-{r}.mp4"

CLIPS = {
    # slot: pexels id, rendition, start, dur, crop centre, push-in, extras
    "phone_dark":   dict(id=4525346, r="uhd_3840_2160_25fps", start=1.0, dur=2.6, x=.5, zoom=(1.0, 1.2), key="screen", dark=.16, wake=.22, glow=.55),
    "delhi_fog":    dict(id=6587044, r="uhd_3840_2160_30fps", start=.5, dur=2.4, x=.53, zoom=(1.0, 1.12)),
    # The wedding: lamps, mehndi, hands, a sparkler, fireworks slowing down.
    "w_diyas":      dict(id=14182074, r="hd_1080_1920_30fps", start=2.0, dur=1.1, x=.5, zoom=(1.1, 1.0)),
    "w_mehndi":     dict(id=15455199, r="hd_1080_1920_30fps", start=3.0, dur=1.2, x=.5, zoom=(1.0, 1.1)),
    "w_hands":      dict(id=2078587, r="hd_1920_1080_24fps", start=.2, dur=1.0, x=.5, zoom=(1.0, 1.12)),
    "w_sparkler":   dict(id=6378175, r="hd_1080_1920_25fps", start=2.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "w_fireworks":  dict(id=14875803, r="hd_1080_1920_50fps", start=5.5, dur=1.4, x=.5, zoom=(1.0, 1.08), speed=.5),
    # After.
    "fog_road":     dict(id=1405527, r="hd_1920_1080_30fps", start=3.0, dur=3.0, x=.5, zoom=(1.0, 1.08)),
    "poster":       dict(still="poster.png", dur=1.6, zoom=(1.04, 1.14)),
    "rain_street":  dict(id=9481662, r="hd_1920_1080_24fps", start=2.0, dur=3.0, x=.5, zoom=(1.0, 1.06)),
    "phone_hand":   dict(id=8566854, r="uhd_3840_2160_30fps", start=1.0, dur=2.8, x=.52, y=.6, zoom=(1.05, 1.4), key="chroma", dark=.26),
    "rain_glass":   dict(id=12680281, r="hd_1920_1080_30fps", start=3.0, dur=2.8, x=.32, zoom=(1.0, 1.06)),
    # The montage: one slot per cut.
    "m_rain":       dict(id=11631455, r="hd_1920_1080_60fps", start=1.0, dur=1.4, x=.5, zoom=(1.0, 1.1)),
    "m_havan":      dict(id=15157494, r="hd_1920_1080_25fps", start=.5, dur=1.3, x=.5, zoom=(1.0, 1.12)),
    "m_note":       dict(still="note.png", dur=1.2, zoom=(1.14, 1.02)),
    "m_street":     dict(id=13687405, r="hd_1080_1920_30fps", start=4.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_poster":     dict(still="poster.png", dur=.9, zoom=(1.3, 1.18)),
    "m_fire":       dict(id=16753425, r="hd_1920_1080_60fps", start=10.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_bikes":      dict(id=10597765, r="hd_1920_1080_25fps", start=2.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_incense":    dict(id=1793318, r="hd_1920_1080_30fps", start=6.0, dur=1.0, x=.47, zoom=(1.0, 1.1)),
    "m_gate":       dict(id=6583820, r="uhd_3840_2160_30fps", start=4.0, dur=1.0, x=.5, zoom=(1.1, 1.0)),
    "m_embers":     dict(id=4389495, r="hd_1366_720_60fps", start=3.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_fireworks":  dict(id=4832681, r="hd_1080_1920_30fps", start=.2, dur=1.0, x=.5, zoom=(1.0, 1.08)),
    "m_traffic":    dict(id=11437954, r="hd_1920_1080_25fps", start=2.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_coals":      dict(id=7571829, r="hd_1920_1080_25fps", start=5.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_fire3":      dict(id=11203341, r="hd_1920_1080_30fps", start=5.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "title_embers": dict(id=12605103, r="uhd_3840_2160_25fps", start=2.0, dur=7.0, x=.5, zoom=(1.0, 1.06)),
}


def font(weight, size):
    return ImageFont.truetype(f"/usr/share/fonts/opentype/inter/Inter-{weight}.otf", size)


def lock_screen(w=1170, h=2532):
    """Sameer's lock screen, as the game draws it: his wedding-light wallpaper,
    11:40, and what keeps arriving."""
    im = Image.open(ROOT / "public/found/shagun-wallpaper.jpg").convert("RGB").resize((w, h))
    im = Image.blend(im, Image.new("RGB", (w, h), (0, 0, 0)), .35)
    d = ImageDraw.Draw(im, "RGBA")
    d.text((w / 2, 300), "Thursday 27 November", font=font("Medium", 54), fill=(255, 255, 255, 215), anchor="mm")
    d.text((w / 2, 520), "11:40", font=font("SemiBold", 300), fill=(255, 255, 255, 235), anchor="mm")
    notes = [("Missed Calls (47)", "+91 62••• •••••", "now"), ("Mummy (6)", "Beta, phone kyun nahi utha raha?", "2m"), ("Bhasin Uncle (2)", "Missed call", "9m")]
    y = h - 1060
    for title, body, when in notes:
        box = (50, y, w - 50, y + 230)
        blur = im.crop(box).filter(ImageFilter.GaussianBlur(30))
        im.paste(blur, box[:2])
        d.rounded_rectangle(box, 56, fill=(40, 36, 34, 165))
        d.rounded_rectangle((90, y + 50, 220, y + 180), 30, fill=(52, 199, 89, 255) if "Calls" in title else (142, 142, 147, 255))
        d.text((250, y + 82), title, font=font("SemiBold", 52), fill=(255, 255, 255, 255), anchor="lm")
        d.text((250, y + 150), body, font=font("Regular", 46), fill=(255, 255, 255, 215), anchor="lm")
        d.text((w - 90, y + 70), when, font=font("Regular", 40), fill=(255, 255, 255, 140), anchor="rm")
        y += 260
    return im


def screen_quad(frame):
    """The green screen's centre, axes and extents, from its green pixels."""
    f = frame.astype(np.int16)
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    m = (g > 120) & (g - np.maximum(r, b) > 45)
    ys, xs = np.nonzero(m)
    if len(xs) < 500:
        return None, m
    pts = np.stack([xs, ys], 1).astype(float)
    c = pts.mean(0)
    w, v = np.linalg.eigh(np.cov((pts - c).T))
    major = v[:, 1]
    if major[1] > 0:  # "up" is towards the top of the frame
        major = -major
    minor = np.array([-major[1], major[0]])  # "right", a quarter-turn clockwise from up
    pm, pn = (pts - c) @ major, (pts - c) @ minor
    lo_m, hi_m = np.percentile(pm, [.2, 99.8])
    lo_n, hi_n = np.percentile(pn, [.2, 99.8])
    c = c + major * (lo_m + hi_m) / 2 + minor * (lo_n + hi_n) / 2
    return (c, major, minor, hi_m - lo_m, hi_n - lo_n), m


def put_screen(frame, screen, mode, dark, on=1.0, glow=0.0):
    q, green = screen_quad(frame)
    out = frame.astype(np.float32) * dark
    if q is None:
        return out
    c, up, right, L, Wd = q
    H, W = frame.shape[:2]
    sw, sh = screen.size
    # Frame → screen-image coordinates (u along right, v down the phone).
    down = -up
    a, b_ = right / Wd * sw, down / L * sh
    coef = (a[0], a[1], sw / 2 - a @ c, b_[0], b_[1], sh / 2 - b_ @ c)
    warped = np.asarray(screen.transform((W, H), Image.AFFINE, coef, resample=Image.BICUBIC), np.float32)
    if mode == "screen":
        corners = [c + s1 * up * L / 2 + s2 * right * Wd / 2 for s1, s2 in ((1, 1), (1, -1), (-1, -1), (-1, 1))]
        mk = Image.new("L", (W, H), 0)
        ImageDraw.Draw(mk).polygon([tuple(p) for p in corners], fill=255)
        m = np.asarray(mk.filter(ImageFilter.GaussianBlur(1.5)), np.float32)[..., None] / 255
    else:
        f = frame.astype(np.float32)
        gness = f[..., 1] - np.maximum(f[..., 0], f[..., 2])
        m = np.clip((gness - 25) / 50, 0, 1)
        m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), np.float32)[..., None] / 255
    # Despill the green fringe the key leaves on the bezel and the thumb.
    out[..., 1] -= np.maximum(out[..., 1] - np.maximum(out[..., 0], out[..., 2]), 0)
    # Off, the screen is dark glass; on, it lights the table around it.
    glass = np.full_like(warped, 6.0)
    lit = glass + (warped - glass) * on
    if glow and on > 0:
        small = Image.fromarray((m[..., 0] * 255).astype(np.uint8)).resize((W // 8, H // 8), Image.BILINEAR)
        g = np.asarray(small.filter(ImageFilter.GaussianBlur(14)).resize((W, H), Image.BILINEAR), np.float32)[..., None] / 255
        tint = np.array([150., 165., 200.])
        out += g * tint * glow * on * (1 - m)
    return out * (1 - m) + lit * m


def frames_of(spec):
    """The slot's source frames, as (W, H, iterator of RGB arrays)."""
    if "still" in spec:
        im = Image.open(FOOT / "stills" / spec["still"]).convert("RGB")
        a = np.asarray(im)
        return im.width, im.height, (a for _ in range(int(spec["dur"] * FPS)))
    src = SRC / f"{spec['id']}-{spec['r']}.mp4"
    if not src.exists():
        SRC.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-sS", "-f", "-o", str(src), V.format(id=spec["id"], r=spec["r"])], check=True)
    info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                                      "-of", "json", str(src)], capture_output=True, check=True).stdout)["streams"][0]
    W, H = info["width"], info["height"]
    # Work at most 2160 tall; the crop decides the rest.
    s = min(1.0, 2160 / H)
    W, H = int(W * s) // 2 * 2, int(H * s) // 2 * 2
    speed = spec.get("speed", 1.0)
    dec = subprocess.Popen(["ffmpeg", "-nostdin", "-loglevel", "error", "-ss", str(spec["start"]), "-t", str(spec["dur"] * speed + .2), "-i", str(src),
                            "-vf", f"setpts=PTS/{speed},fps={FPS},scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)

    def read():
        while True:
            raw = dec.stdout.read(W * H * 3)
            if len(raw) < W * H * 3:
                dec.wait()
                return
            yield np.frombuffer(raw, np.uint8).reshape(H, W, 3)
    return W, H, read()


def cut(slot, spec):
    W, H, frames = frames_of(spec)
    out = FOOT / f"{slot}.mp4"
    enc = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{OW}x{OH}", "-r", str(FPS),
                            "-i", "-", "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-pix_fmt", "yuv420p", str(out)], stdin=subprocess.PIPE)
    screen = lock_screen() if spec.get("key") else None
    n = int(spec["dur"] * FPS)
    for i, f in zip(range(n), frames):
        t = i / FPS
        if screen is not None:
            wake = spec.get("wake", -1)
            on = 1.0 if wake < 0 else min(1.0, max(0.0, (t - wake) / .12))
            f = put_screen(f, screen, spec["key"], spec.get("dark", 1.0), on, spec.get("glow", 0.0))
        elif spec.get("dark"):
            f = f.astype(np.float32) * spec["dark"]
        f = np.clip(f, 0, 255).astype(np.uint8)
        # Crop to 9:16 around (x, y), pushing in over the clip; a prop gets a hand's drift.
        z = spec["zoom"][0] + (spec["zoom"][1] - spec["zoom"][0]) * i / max(1, n - 1)
        ch = H / z
        cw = ch * OW / OH
        if cw > W:
            cw, ch = W, W * OH / OW
        cx = min(max(spec.get("x", .5) * W, cw / 2), W - cw / 2)
        cy = min(max(spec.get("y", .5) * H, ch / 2), H - ch / 2)
        if "still" in spec:
            cx += W * .006 * np.sin(t * 1.3) + W * .002 * np.sin(t * 3.7)
            cy += H * .005 * np.cos(t * 1.1)
            cx, cy = min(max(cx, cw / 2), W - cw / 2), min(max(cy, ch / 2), H - ch / 2)
        im = Image.fromarray(f).resize((OW, OH), Image.LANCZOS, box=(cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2))
        enc.stdin.write(im.tobytes())
    enc.stdin.close()
    enc.wait()
    src = f"pexels {spec['id']} ({spec['r']}) {spec['start']}s" if "id" in spec else f"still {spec['still']}"
    print(f"{slot:14s} ← {src} +{spec['dur']}s", flush=True)


if __name__ == "__main__":
    import sys
    only = sys.argv[1:]
    for old in FOOT.glob("*.mp4"):
        if old.stem not in CLIPS:
            old.unlink()
    for slot, spec in CLIPS.items():
        if not only or slot in only:
            cut(slot, spec)
