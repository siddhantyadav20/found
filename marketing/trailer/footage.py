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
night room. render.mjs turns these into frames; trailer.html grades them.
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
    "phone_dark":       dict(id=4525346, r="uhd_3840_2160_25fps", start=1.0, dur=3.6, x=.5, zoom=(1.0, 1.12), key="screen", dark=.2),
    "delhi_fog":        dict(id=6587044, r="uhd_3840_2160_30fps", start=.5, dur=3.4, x=.53, zoom=(1.0, 1.14)),
    "wedding_lights":   dict(id=854088, r="hd_1920_1080_25fps", start=2.0, dur=2.4, x=.5, zoom=(1.12, 1.0)),
    "baraat_fireworks": dict(id=14875803, r="hd_1080_1920_50fps", start=5.5, dur=2.6, x=.5, zoom=(1.0, 1.06)),
    "dawn_smoke":       dict(id=11514996, r="hd_1920_1080_30fps", start=10.0, dur=4.6, x=.42, zoom=(1.0, 1.08)),
    "night_street":     dict(id=4182795, r="hd_1920_1080_25fps", start=5.0, dur=4.6, x=.62, zoom=(1.0, 1.06)),
    "phone_hand":       dict(id=8566854, r="uhd_3840_2160_30fps", start=1.0, dur=3.2, x=.52, zoom=(1.0, 1.08), key="chroma", dark=.28),
    "rain_glass":       dict(id=12680281, r="hd_1920_1080_30fps", start=3.0, dur=3.4, x=.32, zoom=(1.0, 1.06)),
    # The montage: one slot per cut.
    "m_rain":           dict(id=11631455, r="hd_1920_1080_60fps", start=1.0, dur=1.6, x=.5, zoom=(1.0, 1.1)),
    "m_fire":           dict(id=16753425, r="hd_1920_1080_60fps", start=10.0, dur=1.5, x=.5, zoom=(1.0, 1.1)),
    "m_traffic":        dict(id=11437954, r="hd_1920_1080_25fps", start=2.0, dur=1.4, x=.5, zoom=(1.0, 1.1)),
    "m_embers":         dict(id=4389495, r="hd_1366_720_60fps", start=3.0, dur=1.2, x=.5, zoom=(1.0, 1.1)),
    "m_gate":           dict(id=6583820, r="uhd_3840_2160_30fps", start=4.0, dur=1.2, x=.5, zoom=(1.1, 1.0)),
    "m_fireworks":      dict(id=4832681, r="hd_1080_1920_30fps", start=.2, dur=1.0, x=.5, zoom=(1.0, 1.08)),
    "m_bokeh":          dict(id=854088, r="hd_1920_1080_25fps", start=8.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_fire2":          dict(id=11210464, r="hd_1080_1920_30fps", start=8.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_street":         dict(id=4182795, r="hd_1920_1080_25fps", start=15.0, dur=1.0, x=.45, zoom=(1.0, 1.1)),
    "m_smog":           dict(id=5941316, r="hd_1920_1080_30fps", start=2.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_sparkler":       dict(id=6378175, r="hd_1080_1920_25fps", start=2.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_phone":          dict(id=1190185, r="hd_1920_1080_30fps", start=5.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_bridge":         dict(id=10194738, r="hd_1280_720_25fps", start=10.0, dur=1.0, x=.55, zoom=(1.0, 1.1)),
    "m_coals":          dict(id=7571829, r="hd_1920_1080_25fps", start=5.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_fire3":          dict(id=11203341, r="hd_1920_1080_30fps", start=5.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "title_embers":     dict(id=12605103, r="uhd_3840_2160_25fps", start=2.0, dur=6.6, x=.5, zoom=(1.0, 1.06)),
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


def put_screen(frame, screen, mode, dark):
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
    return out * (1 - m) + warped * m


def cut(slot, spec):
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
    dec = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-ss", str(spec["start"]), "-t", str(spec["dur"]), "-i", str(src),
                            "-vf", f"fps={FPS},scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    out = FOOT / f"{slot}.mp4"
    enc = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{OW}x{OH}", "-r", str(FPS),
                            "-i", "-", "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-pix_fmt", "yuv420p", str(out)], stdin=subprocess.PIPE)
    screen = lock_screen() if spec.get("key") else None
    n = int(spec["dur"] * FPS)
    for i in range(n):
        raw = dec.stdout.read(W * H * 3)
        if len(raw) < W * H * 3:
            break
        f = np.frombuffer(raw, np.uint8).reshape(H, W, 3)
        if screen is not None:
            f = put_screen(f, screen, spec["key"], spec.get("dark", 1.0))
        elif spec.get("dark"):
            f = f.astype(np.float32) * spec["dark"]
        f = np.clip(f, 0, 255).astype(np.uint8)
        # Crop to 9:16 around x, pushing in over the clip.
        z = spec["zoom"][0] + (spec["zoom"][1] - spec["zoom"][0]) * i / max(1, n - 1)
        ch = H / z
        cw = ch * OW / OH
        if cw > W:
            cw, ch = W, W * OH / OW
        cx = min(max(spec["x"] * W, cw / 2), W - cw / 2)
        cy = H / 2
        im = Image.fromarray(f).resize((OW, OH), Image.LANCZOS, box=(cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2))
        enc.stdin.write(im.tobytes())
    enc.stdin.close()
    enc.wait()
    dec.wait()
    print(f"{slot:18s} ← pexels {spec['id']} ({spec['r']}) {spec['start']}s +{spec['dur']}s")


if __name__ == "__main__":
    import sys
    only = sys.argv[1:]
    for slot, spec in CLIPS.items():
        if not only or slot in only:
            cut(slot, spec)
