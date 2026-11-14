"""Build Raakh's voices (2026-10-23).

Each recording on the phone (voice notes, memos, clips, calls) is synthesised
line by line with Microsoft's neural voices (edge-tts), placed at the second
its caption says, filtered as the thing it is (a WhatsApp voice note, a phone
call, a phone filming outdoors, a memo held close), and written as a small
AAC file under public/voices/raakh/. content/raakh/voices.ts maps each key to
its file. The words are the game's own captions, in Devanagari so the Hindi
voices read them as Hindi.

Run:  python3 -I scripts/voices.py <edge-tts binary> <work dir>
Needs macOS's afconvert. The mix and the treatment are scripts/lib/voicedsp.py.
"""
import hashlib, os, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib.voicedsp import load_manifest, mix, to_wav, wav_to_floats, write_voices_ts  # noqa: E402

TTS, WORK = sys.argv[1], sys.argv[2]
os.makedirs(WORK, exist_ok=True)

# Who sounds like whom: one Hindi male voice at different pitches and paces,
# two multilingual voices for the friend and the brother, and the Hindi female voice.
# (Every man is Madhur. scripts/voices-direct.py is the cast with a voice each.)
CAST = {
    "Sameer": ("hi-IN-MadhurNeural", "-6%", "+0Hz"),
    "Sameer-low": ("hi-IN-MadhurNeural", "-14%", "-4Hz"),
    "Bhasin": ("hi-IN-MadhurNeural", "-16%", "-20Hz"),
    "Dilip": ("hi-IN-MadhurNeural", "+2%", "+24Hz"),
    "Guard": ("hi-IN-MadhurNeural", "+4%", "-10Hz"),
    "SHO": ("hi-IN-MadhurNeural", "-10%", "-14Hz"),
    "Kunal": ("en-US-BrianMultilingualNeural", "+10%", "+0Hz"),
    "Raju": ("en-US-AndrewMultilingualNeural", "-6%", "-2Hz"),
    "Meera": ("hi-IN-SwaraNeural", "+0%", "+0Hz"),
    "Anita": ("hi-IN-SwaraNeural", "-8%", "-10Hz"),
    "Dilip-weak": ("hi-IN-MadhurNeural", "-32%", "+16Hz"),
    "Boy": ("hi-IN-MadhurNeural", "+6%", "+30Hz"),
}


def synth(line, entry):
    voice, rate, pitch = CAST[line["who"]]
    text = line["text"]
    h = hashlib.sha1(f"{voice}|{rate}|{pitch}|{text}".encode()).hexdigest()[:16]
    mp3, wav_ = os.path.join(WORK, h + ".mp3"), os.path.join(WORK, h + ".wav")
    if not os.path.exists(wav_):
        subprocess.run([TTS, "--voice", voice, f"--rate={rate}", f"--pitch={pitch}", "--text", text, "--write-media", mp3], check=True, capture_output=True)
        to_wav(mp3, wav_)
    return wav_to_floats(wav_)


entries = load_manifest()
out = {}
for e in entries:
    k, path, secs = mix(e, synth, WORK)
    out[k] = path
    print(f"{k:28} {secs:5.1f}s  (planned {e.get('seconds', '-')})", flush=True)
write_voices_ts(out)
