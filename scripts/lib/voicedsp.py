"""What every voice build shares (2026-11-14): the mix, the treatment, the
files. Pulled out of scripts/voices.py so that voices-direct.py (real voices
through a model, directed line by line) and voices.py (the old Microsoft
voices) make the same kind of file from the same manifest.

A manifest entry is one recording on the phone: its key, its style (how the
phone heard it), the seconds it runs, and its lines, each with who says it
and, where it matters, at what second. A backend turns one line into
samples; this module lays the lines on a track, treats the track as the
thing it is, and writes the AAC file and the row for content/raakh/voices.ts.

Pure-Python DSP, no numpy; afconvert for the encode (macOS).
"""
import array, hashlib, json, math, os, random, re, subprocess, wave

RATE = 24000
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "public", "voices", "raakh")
MANIFEST = os.path.join(ROOT, "scripts", "voices.raakh.json")
VOICES_TS = os.path.join(ROOT, "content", "raakh", "voices.ts")


def load_manifest():
    return json.load(open(MANIFEST, encoding="utf-8"))


def pcm_to_floats(raw, trim=True):
    """16-bit little-endian mono at RATE, as floats, the synthesiser's silence trimmed at either end."""
    a = array.array("h")
    a.frombytes(raw[: len(raw) - (len(raw) % 2)])
    lo, hi = 0, len(a)
    if trim:
        while lo < hi and abs(a[lo]) < 300:
            lo += 1
        while hi > lo and abs(a[hi - 1]) < 300:
            hi -= 1
    return [x / 32768.0 for x in a[max(0, lo - 240) : hi + 240]]


def wav_to_floats(path):
    with wave.open(path) as w:
        assert w.getframerate() == RATE and w.getnchannels() == 1 and w.getsampwidth() == 2, path
        return pcm_to_floats(w.readframes(w.getnframes()))


def to_wav(src, dst):
    """Anything afconvert reads (mp3, m4a, wav at any rate) to 16-bit mono at RATE."""
    subprocess.run(["afconvert", "-f", "WAVE", "-d", f"LEI16@{RATE}", "-c", "1", src, dst], check=True)


def _run(x, b0, b1, b2, a1, a2):
    y = [0.0] * len(x)
    x1 = x2 = y1 = y2 = 0.0
    for i, v in enumerate(x):
        o = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        x2, x1, y2, y1 = x1, v, y1, o
        y[i] = o
    return y


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


def treat(x, style):
    """The recording as the phone heard it: a call's narrow line, a voice note's close mic, a clip outdoors."""
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
    elif style == "whisper":
        x = biquad(biquad(x, "hp", 200), "lp", 5000)
        x = [v * 0.6 + rnd.gauss(0, 0.004) for v in x]
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


def file_name(key):
    """The file a key is kept in: the key with ':' as '-', or, for a key that is a line itself, a short safe hash."""
    name = key.replace(":", "-")
    if not all(c.isascii() and (c.isalnum() or c == "-") for c in name):
        name = key.split(":")[0] + "-" + hashlib.sha1(key.encode()).hexdigest()[:10]
    return name


def mix(entry, synth, work):
    """Lay each line's samples at its second, treat the track, encode it. `synth(line, entry)` gives one line's floats."""
    seconds = entry.get("seconds", 0)
    track = [0.0] * int(RATE * (seconds or 1))
    end = 0.0
    for line in entry["lines"]:
        voice = synth(line, entry)
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
    name = file_name(entry["key"])
    wav_ = os.path.join(work, name + ".out.wav")
    write_wav(wav_, track)
    os.makedirs(OUT, exist_ok=True)
    m4a = os.path.join(OUT, name + ".m4a")
    subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "24000", wav_, m4a], check=True)
    return entry["key"], f"/voices/raakh/{name}.m4a", round(len(track) / RATE, 1)


def write_wav(path, floats):
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(array.array("h", [max(-32767, min(32767, int(v * 32767))) for v in floats]).tobytes())


def seconds_of(path):
    info = subprocess.run(["afinfo", path], capture_output=True, text=True).stdout
    return float(re.search(r"estimated duration: ([\d.]+)", info).group(1))


def write_voices_ts(built):
    """content/raakh/voices.ts: every key, its file, how long it runs. `built` maps key to its public path;
    keys not in it keep the row they have, so a partial build never loses a recording."""
    src = open(VOICES_TS, encoding="utf-8").read()
    head, body = src.split("export const voices: Voices = {")
    rows = {}
    for m in re.finditer(r'^\s*("(?:[^"\\]|\\.)*"):\s*(\{.*\}),\s*$', body, re.M):
        rows[json.loads(m.group(1))] = m.group(2)
    for k, path in built.items():
        secs = seconds_of(os.path.join(ROOT, "public") + path)
        rows[k] = f'{{ src: "{path}", seconds: {secs:.1f} }}'
    out = "\n".join(f"  {json.dumps(k, ensure_ascii=False)}: {v}," for k, v in rows.items())
    open(VOICES_TS, "w", encoding="utf-8").write(head + "export const voices: Voices = {\n" + out + "\n};\n")
