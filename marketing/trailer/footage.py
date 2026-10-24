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
source). `y` moves the crop up or down; `blur` throws it out of focus. A
`still` (from inserts.mjs) becomes a handheld shot of a prop.

`enter` is the way in: a hand holds the green phone in a dark room; its screen
shows the lock screen, swipes up to a photo from that night (the first frame
of the slot `enter` names), and the camera pushes through the glass until the
photo is the whole frame, so the next shot carries on from it. render.mjs turns
these into frames; trailer.html grades them.
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

G = "public/found/raakh/"
GF = "scripts/frames/raakh/"
CLIPS = {
    # slot: source, start, dur, crop centre, push-in, extras. id = Pexels; file/image = the game's own; still = a prop.
    # I. Out here: his phone, the parcel, your hand. (bokeh is cut before enter: the photo on the screen is its first frame.)
    "phone_dark":   dict(id=4525346, r="uhd_3840_2160_25fps", start=1.0, dur=3.0, x=.5, zoom=(1.0, 1.2), key="screen", dark=.16, wake=.4, glow=.55),
    "parcel":       dict(still="parcel.png", dur=1.6, zoom=(1.04, 1.14)),
    "bokeh":        dict(id=854088, r="hd_1920_1080_25fps", start=1.0, dur=2.4, x=.5, zoom=(1.25, 1.34)),
    "enter":        dict(id=8566854, r="hd_1920_1080_30fps", start=.3, dur=4.8, x=.47, zoom=(1.0, 1.0), enter="bokeh", dark=.3, glow=.5),
    # II. The night: hands, lights, fire. No faces.
    "lamp":         dict(id=19971139, r="hd_1080_1920_60fps", start=1.5, dur=1.2, speed=.6, zoom=(1.0, 1.08)),
    "mehndi":       dict(id=15455199, r="hd_1080_1920_30fps", start=2.0, dur=1.2, zoom=(1.0, 1.08)),
    "diyas":        dict(id=14182074, r="hd_1080_1920_30fps", start=1.0, dur=1.2, zoom=(1.08, 1.0)),
    "bangles":      dict(id=2078587, r="hd_1920_1080_24fps", start=.5, dur=1.2, x=.42, zoom=(1.0, 1.1)),
    "sparkler":     dict(id=6378175, r="hd_1080_1920_25fps", start=2.0, dur=1.2, speed=.7, zoom=(1.0, 1.08)),
    "havan":        dict(id=15157494, r="hd_1920_1080_25fps", start=.8, dur=1.2, x=.45, zoom=(1.0, 1.1)),
    "fireworks":    dict(id=14875803, r="hd_1080_1920_50fps", start=4.0, dur=1.2, speed=.6, zoom=(1.0, 1.06)),
    "blur":         dict(id=854088, r="hd_1920_1080_25fps", start=7.0, dur=1.2, x=.35, zoom=(1.1, 1.25)),
    # The reel, out of focus: a figure, an arm up, the light.
    "reel":         dict(file=G + "clip-reel-take.mp4", start=0.0, dur=2.4, zoom=(1.0, 1.12), blur=11, dark=.8),
    "lawn":         dict(image=G + "key-lawn.jpg", dur=2.0, zoom=(1.0, 1.1)),
    # III. After.
    "gravel":       dict(file=G + "clip-fire-whole.mp4", start=1.0, dur=2.0, zoom=(1.0, 1.06)),
    "jerrycan":     dict(file=G + "clip-fire-whole.mp4", start=11.0, dur=2.0, zoom=(1.0, 1.08)),
    "fire":         dict(id=11210464, r="hd_1080_1920_30fps", start=5.0, dur=2.0, zoom=(1.0, 1.1)),
    "ash":          dict(id=4211320, r="hd_1920_1080_24fps", start=6.0, dur=2.0, speed=.7, x=.4, zoom=(1.0, 1.08)),
    # The montage: one slot per kind of cut.
    "m_glass":      dict(id=12680281, r="hd_1920_1080_30fps", start=7.0, dur=1.0, x=.3, zoom=(1.0, 1.08)),
    "m_car":        dict(id=10451977, r="hd_1920_1080_25fps", start=2.0, dur=1.0, x=.6, zoom=(1.0, 1.08)),
    "m_aerial":     dict(id=9370566, r="hd_1920_1080_30fps", start=50.0, dur=1.0, x=.55, zoom=(1.0, 1.08)),
    "m_note":       dict(still="note.png", dur=1.0, zoom=(1.14, 1.04)),
    "m_pyre":       dict(file=G + "clip-fire.mp4", start=1.0, dur=1.0, zoom=(1.0, 1.08)),
    "m_smoke":      dict(id=6894947, r="hd_1920_1080_30fps", start=38.0, dur=1.0, x=.5, zoom=(1.0, 1.08)),
    "m_rain":       dict(id=11631455, r="hd_1920_1080_60fps", start=1.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_coals":      dict(id=7571829, r="hd_1920_1080_25fps", start=5.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_incense":    dict(id=1793318, r="hd_1920_1080_30fps", start=6.0, dur=1.0, x=.62, zoom=(1.0, 1.08)),
    "m_fog":        dict(id=1405527, r="hd_1920_1080_30fps", start=3.0, dur=1.0, x=.5, zoom=(1.0, 1.08)),
    "m_traffic":    dict(id=11437954, r="hd_1920_1080_25fps", start=2.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    "m_embers":     dict(id=4389495, r="hd_1366_720_60fps", start=3.0, dur=1.0, x=.5, zoom=(1.0, 1.1)),
    # IV. Seven.
    "clock":        dict(id=13687405, r="hd_1080_1920_30fps", start=2.0, dur=4.2, zoom=(1.0, 1.1)),
    "title_embers": dict(id=12605103, r="uhd_3840_2160_25fps", start=2.0, dur=6.0, x=.5, zoom=(1.0, 1.06)),
}


def font(weight, size):
    return ImageFont.truetype(f"/usr/share/fonts/opentype/inter/Inter-{weight}.otf", size)


def lock_screen(w=1170, h=2532):
    """Sameer's lock screen, as the game draws it: his wedding-light wallpaper,
    11:40, and what keeps arriving."""
    im = Image.open(ROOT / "public/found/raakh-wallpaper.jpg").convert("RGB").resize((w, h))
    im = Image.blend(im, Image.new("RGB", (w, h), (0, 0, 0)), .35)
    d = ImageDraw.Draw(im, "RGBA")
    d.text((w / 2, 300), "Saturday 29 November", font=font("Medium", 54), fill=(255, 255, 255, 215), anchor="mm")
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


def photo_viewer(photo, ph, sw=1170, sh=2532):
    """The photo as Photos shows it, full width, on black, with its date."""
    im = Image.new("RGB", (sw, sh), (0, 0, 0))
    im.paste(photo.resize((sw, ph), Image.LANCZOS), (0, (sh - ph) // 2))
    d = ImageDraw.Draw(im)
    d.text((sw / 2, 120), "22 November", font=font("SemiBold", 50), fill=(255, 255, 255), anchor="mm")
    d.text((sw / 2, 180), "9:41 PM", font=font("Regular", 38), fill=(170, 170, 170), anchor="mm")
    return im


def screen_at(t, lock, viewer, swipe=(1.6, 2.0)):
    """The lock screen; a swipe up; the photo, coming forward as the lock screen goes."""
    p = min(1.0, max(0.0, (t - swipe[0]) / (swipe[1] - swipe[0])))
    if p <= 0:
        return lock
    e = p * p * (3 - 2 * p)
    sw, sh = lock.size
    k = .92 + .08 * e
    back = Image.new("RGB", (sw, sh), (0, 0, 0))
    v = viewer.resize((int(sw * k), int(sh * k)), Image.BILINEAR)
    back.paste(Image.blend(Image.new("RGB", v.size, (0, 0, 0)), v, .4 + .6 * e), ((sw - v.width) // 2, (sh - v.height) // 2))
    if p < 1:
        back.paste(lock, (0, -int(e * sh)))
    return back


def green_mask(f):
    f = f.astype(np.float32)
    gness = f[..., 1] - np.maximum(f[..., 0], f[..., 2])
    m = np.clip((gness - 25) / 50, 0, 1)
    return np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), np.float32) / 255


def enter(slot, spec):
    """The push through the glass (see the top of this file)."""
    W, H, frames = frames_of(spec)
    n = int(spec["dur"] * FPS)
    raw = [f for _, f in zip(range(n), frames)]
    # Track the screen, then steady the track: the camera will lock onto it.
    quads = [screen_quad(f)[0] for f in raw]
    for i, q in enumerate(quads):
        if q is None:
            quads[i] = quads[i - 1]
    c = np.array([q[0] for q in quads])
    up = np.array([q[1] for q in quads])
    Ls = np.array([q[3] for q in quads])
    Ws = np.array([q[4] for q in quads])
    k = np.ones(9) / 9
    sm = lambda a: np.convolve(np.pad(a, 4, mode="edge"), k, mode="valid")
    c = np.stack([sm(c[:, 0]), sm(c[:, 1])], 1)
    up = np.stack([sm(up[:, 0]), sm(up[:, 1])], 1)
    up /= np.linalg.norm(up, axis=1, keepdims=True)
    Ls, Ws = sm(Ls), sm(Ws)
    sw, sh = 1170, 2532
    # The photo fills exactly what the camera sees once it's through.
    ph = int(round(OH * np.median(Ws) * sh / (OW * np.median(Ls)))) // 2 * 2
    # The camera ends `over` of the way across the screen (its edges are in perspective, and must be out of
    # shot), so the photo is the next shot's first frame seen that much wider: the next shot starts pushed in.
    over = spec.get("over", .8)
    target = CLIPS[spec["enter"]]
    tW, tH, tf = frames_of(dict(target, dur=.1))
    f0 = next(tf)
    for _ in tf:
        pass
    z = target["zoom"][0] * over
    tch = tH / z
    tcw = tch * OW / OH
    tcx = min(max(target.get("x", .5) * tW, tcw / 2), tW - tcw / 2)
    tcy = min(max(target.get("y", .5) * tH, tch / 2), tH - tch / 2)
    photo = Image.fromarray(f0).resize((OW, OH), Image.LANCZOS, box=(tcx - tcw / 2, tcy - tch / 2, tcx + tcw / 2, tcy + tch / 2))
    lock, viewer = lock_screen(sw, sh), photo_viewer(photo, ph, sw, sh)
    glass = Image.new("L", (sw, sh), 0)
    ImageDraw.Draw(glass).rounded_rectangle((0, 0, sw - 1, sh - 1), 120, fill=255)
    oc = np.array([OW / 2, OH / 2])
    p0, p1 = spec.get("push", (2.6, spec["dur"]))
    out = FOOT / f"{slot}.mp4"
    enc = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{OW}x{OH}", "-r", str(FPS),
                            "-i", "-", "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-pix_fmt", "yuv420p", str(out)], stdin=subprocess.PIPE)

    def render(i, t):
        f = raw[i]
        right = np.array([-up[i][1], up[i][0]])
        down = -up[i]
        # The camera: from the shot's own framing to the screen, turning to square up with it, faster and faster.
        p = min(1.0, max(0.0, (t - p0) / (p1 - p0)))
        e = p ** 3
        ch = H
        s0, s1 = ch / OH, over * Ws[i] / OW
        C0 = np.array([min(max(spec.get("x", .5) * W, ch * OW / OH / 2), W - ch * OW / OH / 2), H / 2])
        C = C0 + (c[i] - C0) * e
        s = s0 * (s1 / s0) ** e
        phi = np.arctan2(right[1], right[0]) * e
        R = np.array([[np.cos(phi), -np.sin(phi)], [np.sin(phi), np.cos(phi)]])
        A = s * R
        b = C - A @ oc
        # The room, darkened, lit by the screen.
        gm = green_mask(f)
        room = f.astype(np.float32) * spec.get("dark", 1.0)
        room[..., 1] -= np.maximum(room[..., 1] - np.maximum(room[..., 0], room[..., 2]), 0)
        scr = screen_at(t, lock, viewer)
        tint = np.asarray(scr.resize((1, 1), Image.BOX), np.float32).reshape(3) * .6 + 60
        small = Image.fromarray((gm * 255).astype(np.uint8)).resize((W // 8, H // 8), Image.BILINEAR)
        g = np.asarray(small.filter(ImageFilter.GaussianBlur(14)).resize((W, H), Image.BILINEAR), np.float32)[..., None] / 255
        room += g * tint * spec.get("glow", 0) * (1 - gm[..., None])
        aff = (A[0, 0], A[0, 1], b[0], A[1, 0], A[1, 1], b[1])
        room_o = np.asarray(Image.fromarray(np.clip(room, 0, 255).astype(np.uint8)).transform((OW, OH), Image.AFFINE, aff, resample=Image.BICUBIC), np.float32)
        gm_o = np.asarray(Image.fromarray((gm * 255).astype(np.uint8)).transform((OW, OH), Image.AFFINE, aff, resample=Image.BILINEAR), np.float32) / 255
        M = np.stack([right * sw / Ws[i], down * sh / Ls[i]])
        As, bs = M @ A, M @ (b - c[i]) + np.array([sw / 2, sh / 2])
        saff = (As[0, 0], As[0, 1], bs[0], As[1, 0], As[1, 1], bs[1])
        scr_o = np.asarray(scr.transform((OW, OH), Image.AFFINE, saff, resample=Image.BICUBIC), np.float32)
        qm = np.asarray(glass.transform((OW, OH), Image.AFFINE, saff, resample=Image.BILINEAR), np.float32) / 255
        # The thumb is over the screen until the camera's past it.
        m = (qm * np.maximum(gm_o, min(1.0, max(0.0, (e - .3) * 2.5))))[..., None]
        return room_o * (1 - m) + scr_o * m

    for i in range(n):
        t = i / FPS
        if (t - p0) / (p1 - p0) > .7:  # the fast end of the push, with motion blur
            fr = sum(render(i, t + dt) for dt in (-1 / 90, 0, 1 / 90)) / 3
        else:
            fr = render(i, t)
        enc.stdin.write(np.clip(fr, 0, 255).astype(np.uint8).tobytes())
    enc.stdin.close()
    enc.wait()
    print(f"{slot:14s} ← pexels {spec['id']} through the glass into {spec['enter']} +{spec['dur']}s", flush=True)


def frames_of(spec):
    """The slot's source frames, as (W, H, iterator of RGB arrays)."""
    if "still" in spec or "image" in spec:
        im = Image.open(FOOT / "stills" / spec["still"] if "still" in spec else ROOT / spec["image"]).convert("RGB")
        a = np.asarray(im)
        return im.width, im.height, (a for _ in range(int(spec["dur"] * FPS)))
    src = ROOT / spec["file"] if "file" in spec else SRC / f"{spec['id']}-{spec['r']}.mp4"
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
        if "still" in spec or "image" in spec:
            cx += W * .006 * np.sin(t * 1.3) + W * .002 * np.sin(t * 3.7)
            cy += H * .005 * np.cos(t * 1.1)
            cx, cy = min(max(cx, cw / 2), W - cw / 2), min(max(cy, ch / 2), H - ch / 2)
        im = Image.fromarray(f).resize((OW, OH), Image.LANCZOS, box=(cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2))
        if spec.get("blur"):
            im = im.filter(ImageFilter.GaussianBlur(spec["blur"]))
        enc.stdin.write(im.tobytes())
    enc.stdin.close()
    enc.wait()
    src = (f"pexels {spec['id']} ({spec['r']}) {spec['start']}s" if "id" in spec else f"game clip {spec['file']} {spec['start']}s" if "file" in spec
           else f"game image {spec['image']}" if "image" in spec else f"prop {spec['still']}")
    print(f"{slot:14s} ← {src} +{spec['dur']}s", flush=True)


if __name__ == "__main__":
    import sys
    only = sys.argv[1:]
    for old in FOOT.glob("*.mp4"):
        if old.stem not in CLIPS:
            old.unlink()
    for slot, spec in CLIPS.items():
        if not only or slot in only:
            (enter if "enter" in spec else cut)(slot, spec)
