"""Build Found's trailers (2026-10-24): title cards, soundtrack, picture.

  1. Chapter 2's teaser, ten seconds: marketing/lastlocal-teaser.mp4
     (540x960). Not on the end card: held back on 2026-10-24.
  2. Raakh's vertical trailer, about a minute, for Instagram and WhatsApp
     status: marketing/raakh-trailer.mp4 (1080x1920). It never says the twist:
     no "alive", no nursing home, no seven o'clock rescue.

Cards are drawn by scripts/card.swift, the picture by scripts/clip.swift,
voices come from public/voices/raakh (and one line synthesised here with
edge-tts for the teaser), sounds from public/sfx.

Run:  python3 -I scripts/trailers.py <work dir> <clip tool> <card tool> <edge-tts>
Needs macOS's afconvert. Pure-Python mixing; no numpy.
"""
import array, json, os, subprocess, sys

WORK, CLIP, CARD, TTS = sys.argv[1:5]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RATE = 24000
os.makedirs(WORK, exist_ok=True)
os.makedirs(os.path.join(ROOT, "marketing"), exist_ok=True)

RAAKH = os.path.join(ROOT, "public", "found", "raakh")
FRAMES = os.path.join(ROOT, "scripts", "frames")
LL = os.path.join(ROOT, "public", "found", "lastlocal")


def load(path):
    wav_ = os.path.join(WORK, os.path.basename(path) + ".wav")
    subprocess.run(["afconvert", "-f", "WAVE", "-d", f"LEI16@{RATE}", "-c", "1", path, wav_], check=True)
    raw = open(wav_, "rb").read()
    i = 12
    while raw[i : i + 4] != b"data":
        i += 8 + int.from_bytes(raw[i + 4 : i + 8], "little")
    n = int.from_bytes(raw[i + 4 : i + 8], "little")
    return [x / 32768.0 for x in array.array("h", raw[i + 8 : i + 8 + n])]


def sfx(name):
    return load(os.path.join(ROOT, "public", "sfx", f"found-{name}-1.m4a"))


def voice(key):
    return load(os.path.join(ROOT, "public", "voices", "raakh", key + ".m4a"))


def lay(track, sound, at, gain, until=None, fade_in=0.0, fade_out=0.0):
    i0 = int(at * RATE)
    end = len(track) if until is None else min(len(track), int(until * RATE))
    fi, fo = max(1, int(fade_in * RATE)), int(fade_out * RATE)
    for i, v in enumerate(sound):
        j = i0 + i
        if j >= end:
            break
        if j >= 0:
            k = min(1.0, i / fi) if fade_in else 1.0
            if fo and end - j < fo:
                k *= (end - j) / fo
            track[j] += v * gain * k


def bed(track, sound, gain, start=0.0, until=None, fade_in=0.0, fade_out=0.0):
    t = start
    stop = until or len(track) / RATE
    while t < stop:
        lay(track, sound, t, gain, stop, fade_in if t == start else 0, fade_out)
        t += len(sound) / RATE - 0.05


def write(track, name):
    peak = max(1e-6, max(abs(v) for v in track))
    g = min(1.0, 0.9 / peak)
    wav_ = os.path.join(WORK, name + ".mix.wav")
    import wave

    with wave.open(wav_, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(array.array("h", [max(-32767, min(32767, int(v * g * 32767))) for v in track]).tobytes())
    m4a = os.path.join(WORK, name + ".mix.m4a")
    subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "64000", wav_, m4a], check=True)
    return m4a


def card(name, lines, width=1080, height=1920):
    out = os.path.join(WORK, f"card-{name}.jpg")
    spec = os.path.join(WORK, f"card-{name}.json")
    json.dump({"out": out, "width": width, "height": height, "lines": lines}, open(spec, "w"))
    subprocess.run([CARD, spec], check=True, stdout=subprocess.DEVNULL)
    return out


def tts(text, voice_name, rate, pitch, name):
    mp3 = os.path.join(WORK, name + ".mp3")
    if not os.path.exists(mp3):
        subprocess.run([TTS, "--voice", voice_name, f"--rate={rate}", f"--pitch={pitch}", "--text", text, "--write-media", mp3], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return load(mp3)


def shot(image, start, end, z0=1.0, z1=1.08, x0=0.5, y0=0.5, x1=0.5, y1=0.5, still=False):
    return {"image": image, "start": start, "end": end, "z0": z0, "z1": z1, "x0": x0, "y0": y0, "x1": x1, "y1": y1, "still": still}


def build(name, out, seconds, shots, audio, width, height, bitrate, flashes=(), shake=0.003):
    spec = {
        "out": out, "width": width, "height": height, "fps": 24, "seconds": seconds, "audio": audio,
        "shake": shake, "bitrate": bitrate, "shots": shots, "flashes": [{"at": a, "dur": d} for a, d in flashes],
    }
    path = os.path.join(WORK, f"spec-{name}.json")
    json.dump(spec, open(path, "w"))
    subprocess.run([CLIP, path], check=True)


MONO, DISPLAY, SERIF, SERIF_I = "Menlo-Regular", "HelveticaNeue-Medium", "Georgia", "Georgia-Italic"
EMBER, PAPER, GREY = "#ff7a45", "#f4f1ea", "#a8a29a"

buzz, train, dhol, shot_s, fire = sfx("buzz"), sfx("train"), sfx("dhol"), sfx("shot"), sfx("fire")

# --- 1. Chapter 2's teaser: the last train out of Dadar, a phone on the seat, a man coming down the carriages.
t = [0.0] * int(10 * RATE)
bed(t, train, 0.7, until=10, fade_out=1.2)
lay(t, buzz, 1.1, 0.8)
lay(t, buzz, 4.0, 0.8)
lay(t, tts("जिसने भी ये फ़ोन उठाया है… मेरे घर वालों को कुछ मत बताना। प्लीज़।", "hi-IN-SwaraNeural", "-12%", "+0Hz", "ll-whisper"), 3.3, 1.0)
ll_card = card("ll", [
    {"text": "CHAPTER 02 · MUMBAI", "font": MONO, "size": 30, "color": EMBER, "y": 0.43, "tracking": 6},
    {"text": "LAST LOCAL", "font": DISPLAY, "size": 124, "color": PAPER, "y": 0.52, "tracking": 6},
    {"text": "This time, you're on the train.", "font": SERIF_I, "size": 44, "color": GREY, "y": 0.585},
])
build("teaser", os.path.join(ROOT, "marketing", "lastlocal-teaser.mp4"), 10, [
    shot(os.path.join(LL, "dadar.jpg"), 0, 3.0, 1.0, 1.1, 0.5, 0.5, 0.55, 0.45),
    shot(os.path.join(FRAMES, "lastlocal", "seat.jpg"), 3.0, 6.3, 1.06, 1.16, 0.5, 0.62, 0.5, 0.68),
    shot(os.path.join(FRAMES, "lastlocal", "walker.jpg"), 6.3, 8.2, 1.0, 1.14, 0.5, 0.5, 0.5, 0.45),
    shot(ll_card, 8.2, 10, 1.0, 1.0, still=True),
], write(t, "teaser"), 540, 960, 520_000)

# --- 2. Raakh's trailer: the premise, the wedding, the shot, the fire, everyone's version, and the choice. Never the twist.
S = 56
t = [0.0] * int(S * RATE)


def say(text, size=60, y=0.5, italic=True, color=PAPER):
    return {"text": text, "font": SERIF_I if italic else SERIF, "size": size, "color": color, "y": y}


cards = {
    "door": card("door", [say("A parcel came", 72, 0.47), say("to the wrong door.", 72, 0.52)]),
    "phone": card("phone", [say("Inside: a wedding planner's phone.", 52, 0.47), say("Forty-seven missed calls.", 52, 0.52, color=GREY)]),
    "waiter": card("waiter", [say("That night, a waiter", 66, 0.47), say("went missing.", 66, 0.52)]),
    "version": card("version", [say("Everyone has a version.", 64, 0.5)]),
    "edited": card("edited", [say("Somebody edited the night.", 64, 0.5)]),
    "choose": card("choose", [say("Before seven,", 72, 0.47), say("you'll have to choose.", 72, 0.52, color=EMBER)]),
    "title": card("title", [
        {"text": "CHAPTER 01 · DELHI", "font": MONO, "size": 30, "color": EMBER, "y": 0.4, "tracking": 6},
        {"text": "RAAKH", "font": DISPLAY, "size": 190, "color": PAPER, "y": 0.5, "tracking": 10},
        say("A thriller you play on someone else's phone.", 40, 0.565, color=GREY),
        {"text": "PLAY FREE · FOUND-GAME.VERCEL.APP", "font": MONO, "size": 28, "color": PAPER, "y": 0.66, "tracking": 4},
    ]),
}
R = lambda f: os.path.join(RAAKH, f)  # noqa: E731
F = lambda f: os.path.join(FRAMES, "raakh", f)  # noqa: E731

shots = [
    shot(cards["door"], 0, 3.6, 1.0, 1.03, still=True),
    shot(R("w-4.jpg"), 3.6, 5.1, 1.05, 1.15),
    shot(R("w-3.jpg"), 5.1, 6.6, 1.05, 1.12, 0.5, 0.5, 0.45, 0.5),
    shot(R("w-5.jpg"), 6.6, 8.1, 1.02, 1.12),
    shot(cards["phone"], 8.1, 11.4, 1.0, 1.03, still=True),
    shot(F("reel-1.jpg"), 11.4, 15.0, 1.0, 1.08, 0.5, 0.55, 0.45, 0.55),
    shot(F("reel-2.jpg"), 15.0, 17.6, 1.14, 1.22, 0.5, 0.56, 0.52, 0.55),
    shot(F("reel-3.jpg"), 17.6, 18.6, 1.0, 1.1),
    shot(cards["waiter"], 18.6, 21.8, 1.0, 1.03, still=True),
    shot(R("w-portrait.jpg"), 21.8, 25.6, 1.0, 1.1, 0.5, 0.4, 0.5, 0.36),
    shot(R("fire-mattress.jpg"), 25.6, 31.2, 1.0, 1.14, 0.5, 0.55, 0.5, 0.5),
    shot(cards["version"], 31.2, 34.0, 1.0, 1.03, still=True),
    shot(F("kunal-fire.jpg"), 34.0, 36.6, 1.02, 1.12, 0.5, 0.4, 0.5, 0.36),
    shot(F("jerrycan.jpg"), 36.6, 39.6, 1.0, 1.1),
    shot(cards["edited"], 39.6, 42.6, 1.0, 1.03, still=True),
    shot(F("gravel.jpg"), 42.6, 45.8, 1.0, 1.12, 0.5, 0.65, 0.5, 0.45),
    shot(cards["choose"], 45.8, 49.6, 1.0, 1.04, still=True),
    shot(cards["title"], 49.6, S, 1.0, 1.0, still=True),
]
# Sound: the phone, the wedding, Dilip practising his English, the shot, Raju, Sameer's voice note, the fire, the gravel.
lay(t, buzz, 0.6, 0.9)
lay(t, buzz, 2.2, 0.9)
bed(t, dhol, 0.75, 3.6, 8.2, fade_out=0.4)
lay(t, buzz, 8.6, 0.6)
lay(t, buzz, 9.8, 0.6)
bed(t, dhol, 0.16, 11.4, 17.6, fade_in=0.6)
lay(t, voice("voice-d-2c"), 11.6, 1.0, until=15.4, fade_out=0.3)
lay(t, shot_s, 16.0, 1.0)
lay(t, voice("call-raju-2"), 22.4, 1.0)
bed(t, fire, 0.6, 25.6, 31.4, fade_in=0.5, fade_out=0.5)
lay(t, voice("voice-m-3"), 26.0, 1.0)
lay(t, shot_s, 34.8, 0.9)
lay(t, shot_s, 35.18, 0.9)
bed(t, fire, 0.3, 36.6, 39.6, fade_in=0.4, fade_out=0.4)
lay(t, voice("clip-fire-whole"), 36.8, 0.9, until=39.6, fade_out=0.3)
lay(t, buzz, 46.2, 0.7)
lay(t, buzz, 47.8, 0.7)
build("trailer", os.path.join(ROOT, "marketing", "raakh-trailer.mp4"), S, shots, write(t, "trailer"), 1080, 1920, 3_500_000,
      flashes=[(16.0, 0.14), (34.8, 0.1), (35.18, 0.1)], shake=0.002)
print("trailers built")
