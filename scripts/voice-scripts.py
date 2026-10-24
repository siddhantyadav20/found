"""Write VOICE-SCRIPTS.md from scripts/voices.raakh.json (2026-10-24).

Every line Raakh speaks, split by actor, so real voices can replace the
synthesised ones file for file: each recording's file name is the one the
game already plays (public/voices/raakh/<key>.m4a).

Run:  python3 -I scripts/voice-scripts.py
"""
import collections, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = json.load(open(os.path.join(ROOT, "scripts", "voices.raakh.json")))

CAST = [
    ("Sameer", ["Sameer", "Sameer-low"], "Sameer Khurrana, 27", "the wedding planner whose phone it is. Low and close for the voice notes and memos; tired, quick, defensive on calls."),
    ("Raju", ["Raju"], "Raju Mahto, 24", "Dilip's elder brother, from Samastipur, calling from Delhi's roadsides. Hindi with a Bihari lilt; polite, frightened, persistent."),
    ("Bhasin", ["Bhasin"], "Bhasin Sehgal, 58", "the bride's father, retired from the police. Never raises his voice. Doesn't need to."),
    ("Meera", ["Meera"], "Meera Arora, 28", "advocate, Saket courts; Sameer's ex. Crisp, fast, and kinder than she sounds."),
    ("Dilip", ["Dilip", "Dilip-weak"], "Dilip Kumar Mahto, 19", "the waiter who held the light. Eager, practising his English for Mumbai; at the end, weak and hoarse."),
    ("Kunal", ["Kunal"], "Kunal Sehgal, 25", "the bride's brother, Sameer's friend. Loud, drunk, delighted with himself."),
    ("Guard", ["Guard"], "The guard at your building's Gate 2", "middle-aged, sleepy, unimpressed."),
    ("Anita", ["Anita"], "Sister Anita, a nurse on night duty", "careful, whispering, brave about it."),
    ("SHO", ["SHO"], "The SHO at the local station", "bored, and already on the other side."),
]
STYLE = {"call": "phone call", "note": "WhatsApp voice note", "memo": "voice memo, held close", "clip": "on video, outdoors"}

by = collections.defaultdict(list)
for e in spec:
    for l in e["lines"]:
        by[l["who"]].append((e["key"], e["style"], l["text"], l.get("at")))

out = [
    "# Raakh — voice scripts",
    "",
    "*Generated from `scripts/voices.raakh.json` by `scripts/voice-scripts.py`; don't edit by hand.*",
    "",
    "Every line the chapter speaks, split by actor. The game plays synthesised",
    "voices today (`scripts/voices.py`); a real actor's file, named as below and",
    "dropped into `public/voices/raakh/`, replaces each one with no code change.",
    "The words are the game's own captions, in Devanagari; don't change them.",
    "Pauses, breaths and stumbles are welcome.",
    "A file with more than one voice in it (a clip, a call with two people) is",
    "mixed from each actor's lines, timed by the seconds shown.",
    "",
    "**Spoilers:** Sameer's, Raju's and the nurse's actors read the twist. Cast people who won't play it fresh.",
    "",
    "## How to record",
    "",
    "- **On a phone**, as a WhatsApp voice note or in the voice recorder. Not a studio mic: it has to sound like a phone because it is one.",
    "- **A room with a little life in it.** A fan or distant traffic is good; music, TV and other voices aren't. Raju records outdoors, near a road.",
    "- **One file per recording, named as below.** Three takes each, with a clap between, is ideal.",
    "- **Send the originals** (m4a, opus or wav) to Siddhant, unconverted.",
    "- Nobody says their own real name, and nothing real gets said about anyone.",
    "",
]
for name, voices, who, note in CAST:
    lines = [x for v in voices for x in by.get(v, [])]
    if not lines:
        continue
    files = sorted({k for k, *_ in lines})
    out += ["---", "", f"## {who}: {len(files)} recording{'s' if len(files) != 1 else ''}", "", f"*{note[0].upper() + note[1:]}*", ""]
    current = None
    for key, style, text, at in sorted(lines, key=lambda x: (x[0], x[3] or 0)):
        if key != current:
            current = key
            out += ["", f"**`{key.replace(':', '-')}.m4a`** · {STYLE.get(style, style)}", ""]
        out.append(f"- {f'({at:g}s) ' if at else ''}{text}")
    out.append("")
open(os.path.join(ROOT, "VOICE-SCRIPTS.md"), "w").write("\n".join(out))
print("wrote VOICE-SCRIPTS.md")
