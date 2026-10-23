"""Build Raakh's voices (2026-10-23).

Each recording on the phone (voice notes, memos, clips, calls) is synthesised
line by line with Microsoft's neural voices (edge-tts), placed at the second
its caption says, filtered as the thing it is (a WhatsApp voice note, a phone
call, a phone filming outdoors, a memo held close), and written as a small
AAC file under public/voices/raakh/. content/raakh/voices.ts maps each key to
its file. The words are the game's own captions, in Devanagari so the Hindi
voices read them as Hindi.

Run:  python3 -I scripts/voices.py <edge-tts binary> <work dir>
Needs macOS's afconvert. Pure-Python DSP; no numpy.
"""
import array, hashlib, json, math, os, random, subprocess, sys, wave

TTS, WORK = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "voices", "raakh")
RATE = 24000
os.makedirs(OUT, exist_ok=True)
os.makedirs(WORK, exist_ok=True)

# Who sounds like whom: one Hindi male voice at different pitches and paces,
# two multilingual voices for the friend and the brother, and the Hindi female voice.
CAST = {
    "Sameer": ("hi-IN-MadhurNeural", "-6%", "+0Hz"),
    "Sameer-low": ("hi-IN-MadhurNeural", "-14%", "-4Hz"),
    "Bhasin": ("hi-IN-MadhurNeural", "-16%", "-20Hz"),
    "Dilip": ("hi-IN-MadhurNeural", "+2%", "+24Hz"),
    "Guard": ("hi-IN-MadhurNeural", "+4%", "-10Hz"),
    "Kunal": ("en-US-BrianMultilingualNeural", "+10%", "+0Hz"),
    "Raju": ("en-US-AndrewMultilingualNeural", "-6%", "-2Hz"),
    "Meera": ("hi-IN-SwaraNeural", "+0%", "+0Hz"),
}


def synth(who, text):
    voice, rate, pitch = CAST[who]
    h = hashlib.sha1(f"{voice}|{rate}|{pitch}|{text}".encode()).hexdigest()[:16]
    mp3, wav_ = os.path.join(WORK, h + ".mp3"), os.path.join(WORK, h + ".wav")
    if not os.path.exists(wav_):
        subprocess.run([TTS, "--voice", voice, f"--rate={rate}", f"--pitch={pitch}", "--text", text, "--write-media", mp3], check=True, capture_output=True)
        subprocess.run(["afconvert", "-f", "WAVE", "-d", f"LEI16@{RATE}", "-c", "1", mp3, wav_], check=True)
    with wave.open(wav_) as w:
        a = array.array("h", w.readframes(w.getnframes()))
    # Trim the synthesiser's silence at either end.
    lo, hi = 0, len(a)
    while lo < hi and abs(a[lo]) < 300:
        lo += 1
    while hi > lo and abs(a[hi - 1]) < 300:
        hi -= 1
    return [x / 32768.0 for x in a[max(0, lo - 240) : hi + 240]]


def biquad(x, kind, f, q=0.707):
    w0 = 2 * math.pi * f / RATE
    c, s = math.cos(w0), math.sin(w0)
    al = s / (2 * q)
    if kind == "hp":
        b0, b1, b2 = (1 + c) / 2, -(1 + c), (1 + c) / 2
    elif kind == "lp":
        b0, b1, b2 = (1 - c) / 2, 1 - c, (1 - c) / 2
    else:  # a gentle presence peak
        A = 10 ** (3 / 40)
        b0, b1, b2 = 1 + al * A, -2 * c, 1 - al * A
        a0, a1, a2 = 1 + al / A, -2 * c, 1 - al / A
        return _run(x, b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0)
    a0, a1, a2 = 1 + al, -2 * c, 1 - al
    return _run(x, b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0)


def _run(x, b0, b1, b2, a1, a2):
    y = [0.0] * len(x)
    x1 = x2 = y1 = y2 = 0.0
    for i, v in enumerate(x):
        o = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        x2, x1, y2, y1 = x1, v, y1, o
        y[i] = o
    return y


def treat(x, style):
    rnd = random.Random(7)
    if style == "call":
        # A mobile line: 300 Hz to 3.4 kHz, a little crunch, a little hiss.
        x = biquad(biquad(x, "hp", 320), "lp", 3300)
        x = [math.tanh(v * 2.2) / 1.6 for v in x]
        x = [v + rnd.gauss(0, 0.004) for v in x]
    elif style == "note":
        # A WhatsApp voice note: phone mic close up, a quiet room behind it.
        x = biquad(biquad(x, "hp", 110), "lp", 7000)
        x = [v * 0.95 + rnd.gauss(0, 0.0025) for v in x]
    elif style == "memo":
        x = biquad(biquad(x, "hp", 90), "lp", 8000)
        x = [v * 0.9 + rnd.gauss(0, 0.002) for v in x]
    elif style == "clip":
        # A phone filming outdoors: thinner, further off, a touch of air.
        x = biquad(biquad(x, "hp", 180), "lp", 6000)
        x = [v * 0.8 + rnd.gauss(0, 0.003) for v in x]
    peak = max(1e-6, max(abs(v) for v in x))
    g = 0.89 / peak
    return [v * g for v in x]


def build(entry):
    seconds = entry.get("seconds", 0)
    track = [0.0] * int(RATE * (seconds or 1))
    end = 0.0
    for line in entry["lines"]:
        voice = synth(line["who"], line["text"])
        start = max(line.get("at", 0) + 0.15, end + 0.12)
        i0 = int(start * RATE)
        need = i0 + len(voice)
        if need > len(track):
            track.extend([0.0] * (need - len(track)))
        for i, v in enumerate(voice):
            track[i0 + i] += v
        end = need / RATE
    track.extend([0.0] * int(RATE * 0.35))
    track = treat(track, entry["style"])
    key = entry["key"]
    name = key.replace(":", "-")
    wav_ = os.path.join(WORK, name + ".out.wav")
    with wave.open(wav_, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(array.array("h", [max(-32767, min(32767, int(v * 32767))) for v in track]).tobytes())
    m4a = os.path.join(OUT, name + ".m4a")
    subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "40000", wav_, m4a], check=True)
    return key, f"/voices/raakh/{name}.m4a", round(len(track) / RATE, 1)


entries = json.load(open(os.path.join(ROOT, "scripts", "voices.raakh.json")))
out = {}
for e in entries:
    k, path, secs = build(e)
    out[k] = path
    print(f"{k:28} {secs:5.1f}s  (planned {e.get('seconds', '-')})", flush=True)
json.dump(out, open(os.path.join(WORK, "manifest.json"), "w"), indent=1)
