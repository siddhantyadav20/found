"""Re-read every recording's loudness into content/raakh/voices.ts (2026-11-15) without building
any voice: the `peaks` the waveforms draw. A voice build writes them as well; this is for when
the files changed some other way.

    python3 scripts/voice-peaks.py
"""
import json, os, re, sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "lib"))
from voicedsp import VOICES_TS, write_voices_ts  # noqa: E402

body = open(VOICES_TS, encoding="utf-8").read().split("export const voices: Voices = {")[1]
built = {json.loads(k): src for k, src in re.findall(r'^\s*("(?:[^"\\]|\\.)*"):\s*\{ src: "([^"]+)"', body, re.M)}
write_voices_ts(built)
print(f"peaks for {len(built)} recordings")
