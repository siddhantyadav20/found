"""Raakh's voices, directed (2026-11-14): a real voice for each character,
and every line told how to say it.

scripts/voices.py gave the chapter its first voices with two Microsoft Hindi
voices, so every man was one voice at a different pitch. This build casts
one voice per character from a model that performs, and sends each line
with its direction: who is speaking, where, to whom, in what state. The
words stay the game's own captions, in Devanagari. The mix, the treatment
(a call's narrow line, a voice note's close mic) and the files are the same
as before (scripts/lib/voicedsp.py), so nothing in the game changes but the
sound.

Two backends, by key in the environment or .env.local:

  gemini       GEMINI_API_KEY      Gemini TTS (gemini-3.8-flash-tts), 30 voices,
                                   direction as a style annotation per line.
  elevenlabs   ELEVENLABS_API_KEY  Eleven v3, direction as audio tags; voices are
                                   the IDs in ELEVEN below (add Hindi voices from
                                   the library to the account first).

Run:
  python3 -I scripts/voices-direct.py --dry-run                 the direction sheet, no audio
  python3 -I scripts/voices-direct.py --audition <work dir>     one line per character in each candidate voice
  python3 -I scripts/voices-direct.py <work dir> [--only key,…] [--backend gemini|elevenlabs]

ElevenLabs, before a build:
  python3 -I scripts/voices-direct.py --backend elevenlabs --account      the plan, its voice slots and characters left
  python3 -I scripts/voices-direct.py --backend elevenlabs --library      Hindi voices in the Voice Library, with previews
  python3 -I scripts/voices-direct.py --backend elevenlabs --add Sameer=<voice_id>,…   put library voices in the account's
                                                                          My Voices (one slot each) and into ELEVEN below
  python3 -I scripts/voices-direct.py --backend elevenlabs --render Meera,Bhasin <work dir>
                                                                          three slots on the free plan: voices go in, their
                                                                          lines render into the cache, the voices come out;
                                                                          then a plain build needs no slot at all

Needs macOS's afconvert. Every synthesised line is cached in the work dir
by its voice, direction and words, so a re-run only pays for what changed.
"""
import base64, hashlib, json, os, sys, time, urllib.error, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib.voicedsp import ROOT, load_manifest, mix, pcm_to_floats, write_voices_ts  # noqa: E402

# --- The cast -------------------------------------------------------------------
# Who each character is, for the model: this is read before every line.
# The names are from RAAKH-V3 §3 and §16 ("Voice") and VOICE-SCRIPTS.md.

WHO = {
    "Sameer": "Sameer Khurrana, 28, a Delhi wedding planner. Fluent, quick, a little performed; he talks like someone who films things.",
    "Sameer-low": "Sameer Khurrana, 28, a Delhi wedding planner, a week after he shot a boy by accident and lied about it. Low, close, tired; he corrects himself mid-sentence; long pauses.",
    "Bhasin": "Bhasin Sehgal, 58, a retired Delhi police officer who paid for the wedding. Low, unhurried, practical. His threats sound like advice. He never raises his voice.",
    "Dilip": "Dilip Kumar Mahto, 19, a catering boy from Samastipur, Bihar, practising his English for a job in Mumbai. Earnest and specific, never comic; a Bihari lilt.",
    "Dilip-weak": "Dilip Kumar Mahto, 19, in a hospital bed a week after being shot in the shoulder. Hoarse, weak, slow; every sentence costs him something; still polite.",
    "Raju": "Raju Mahto, 24, Dilip's elder brother, a delivery rider, calling from a Delhi roadside at night. Exhausted, direct, frightened under it; a Bihari lilt.",
    "Kunal": "Kunal Sehgal, 25, the bride's brother, drunk and delighted with himself at the wedding. Loud, mocking, entitled.",
    "Guard": "Ram Kishan ji, the night guard at Gate 2 of a Malviya Nagar apartment block, middle-aged, woken, respectful and unimpressed.",
    "SHO": "The station house officer at the local police station. Bored, already on the other side.",
    "Meera": "Meera Arora, 28, an advocate at the Saket courts, Sameer's ex. Precise, fast, warm under control. Never a therapist, never a fixer. She knows exactly who she is talking to.",
    "Anita": "Sister Anita, a night nurse at a small nursing home, recording a voice note at the end of a shift where nobody can hear her. Careful, procedural, then brave.",
    "Boy": "A new catering boy, about 18, holding a light at a Mumbai wedding. Keen.",
}

# How the phone heard it, which is also how it was said.
STYLE = {
    "call": "On a phone call, at night, in Hindi.",
    "note": "A WhatsApp voice note, the phone held close to the mouth, a quiet room behind it, in Hindi.",
    "memo": "A voice memo recorded alone, the phone held close, in Hindi.",
    "clip": "Spoken outdoors at a night wedding, a few steps from the phone that is filming, in Hindi.",
    "whisper": "Whispered into the phone so as not to be overheard, in Hindi.",
}

# --- Gemini --------------------------------------------------------------------
# The prebuilt voices (aistudio.google.com/docs/speech-generation), one each.
# `--audition` renders the alternatives so the cast can be heard before a build.

GEMINI = {
    "Sameer": ("Enceladus", ["Umbriel", "Achird"]),
    "Sameer-low": ("Enceladus", ["Umbriel", "Achird"]),
    "Bhasin": ("Algenib", ["Gacrux", "Charon"]),
    "Dilip": ("Puck", ["Leda", "Zubenelgenubi"]),
    "Dilip-weak": ("Puck", ["Leda", "Zubenelgenubi"]),
    "Raju": ("Iapetus", ["Schedar", "Alnilam"]),
    "Kunal": ("Fenrir", ["Sadachbia", "Zubenelgenubi"]),
    "Guard": ("Gacrux", ["Sadaltager", "Algenib"]),
    "SHO": ("Rasalgethi", ["Charon"]),
    "Meera": ("Kore", ["Erinome", "Pulcherrima"]),
    "Anita": ("Achernar", ["Vindemiatrix", "Despina"]),
    "Boy": ("Leda", ["Puck"]),
}
GEMINI_MODEL = "gemini-3.8-flash-tts"
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/interactions"

# --- ElevenLabs ------------------------------------------------------------------
# Voice IDs from the account's library (Hindi voices from the Voice Library,
# added to My Voices). Empty until cast; the build says so.

ELEVEN = {
    "Sameer": "MWJv8XGO5EdlNYBzkxpb",      # designed in the editor, 2026-11-15 (Samar, the account's own voice, is UI-only on free)
    "Sameer-low": "MWJv8XGO5EdlNYBzkxpb",
    "Bhasin": "1hKpLwpmMf5yntLhe7So",      # designed in the editor, 2026-11-15
    "Dilip": "9j90Riwx7vMHgvRVGtsS",       # designed in the editor, 2026-11-15
    "Dilip-weak": "9j90Riwx7vMHgvRVGtsS",
    "Raju": "vW0iDYsPpQrvzaue2D4b",      # designed in the editor, 2026-11-15
    "Kunal": "CcOSlgXn6DQAUPzBYXka",      # designed in the editor, 2026-11-15
    "Guard": "gMUuhE6M5UtTcOhbK4J5",      # designed in the editor, 2026-11-15
    "SHO": "gMUuhE6M5UtTcOhbK4J5",      # designed in the editor, 2026-11-15
    "Meera": "q50uFLBPH4a5xWp9aH6s",       # designed in the editor, 2026-11-14 (free plan: library voices are UI-only)
    "Anita": "YCm9i1UVrkiRKkgwtAD7",      # designed in the editor, 2026-11-15
    "Boy": "9j90Riwx7vMHgvRVGtsS",         # the new boy behind the light: Dilip's echo, on purpose
}
# How each designed voice was made (Voice Design in the ElevenLabs editor, eleven_v3, guidance at the default,
# the first of three previews kept). On the free plan only three designed voices fit in the account, so a voice
# leaves once its lines are in the cache; to redo a line, design the voice again from this prompt, put the new
# ID in ELEVEN, and render that character again. The prompt is also the voice's description in the account.
DESIGNED = {
    "Meera": "A 28-year-old Indian woman from Delhi, an advocate who argues in court, speaking Hindi on a late-night phone call. Precise, quick, controlled, quietly warm underneath. Natural Delhi Hindi with no foreign accent; a real person on a phone, not a narrator.",
    "Dilip": "A 19-year-old young man from Samastipur, Bihar, working as a catering boy at a Delhi wedding, speaking Hindi with a light Bihari lilt. Earnest, eager, specific, a little shy; practising to sound grown-up. Never comic. A real young voice recorded on a phone, not a narrator.",
    "Sameer": "A 28-year-old man from Delhi, a wedding planner who films everything on his phone, speaking Hindi with easy Delhi Hinglish. Mid-range, warm, quick and a little performed when he talks to a camera; underneath, tired and guilty. A real voice recorded close on a phone, not a narrator.",
    "Bhasin": "A 58-year-old Indian man, a retired Delhi police officer who now runs things with money, speaking Hindi with a Punjabi-Delhi accent. Low, deep, unhurried and calm; his threats sound like friendly advice. He never raises his voice. A real voice note on a phone, not a narrator, not a film villain.",
    "Raju": "A 24-year-old man from Samastipur, Bihar, a delivery rider in Delhi, calling at night from a roadside about his missing younger brother. Hindi with a Bihari lilt. Exhausted, direct, frightened underneath; his voice cracks when he is scared. A real voice on a mobile phone call, not a narrator.",
    "Anita": "A woman in her late forties from Kerala who has worked as a night nurse in Delhi for twenty years, speaking Hindi with a light South Indian accent, half-whispering into her phone at the end of a shift so nobody hears. Careful, procedural, quiet; brave underneath. A real voice note close to the mic, not a narrator.",
    "Guard": "A man in his mid-fifties from western Uttar Pradesh, the night guard at the gate of a Delhi apartment block, calling a resident in the middle of the night. Hindi, plain and respectful, saying sahab often; apologetic, a little hurt, unimpressed by money. A real voice on a cheap mobile phone, not a narrator.",
    "Kunal": "A 25-year-old rich Delhi boy, the bride's brother, drunk and delighted with himself at his sister's wedding, shouting over a dhol and a crowd. Punjabi-Delhi Hinglish. Loud, mocking, entitled, laughing. A real voice caught on someone's phone video at a party, not a narrator.",
}
# The library's public owner for each voice, needed to add it to the account.
ELEVEN_OWNER = {
    "M3Bm3Dh38u6AnJuEOcXR": "e494e9bf8e7e632a9facd8beaddea47de26231c14b1e1ad5fec37600471a66cb",
    "UQ8yRa4VXzkXzDzxsYzL": "f3e541807235996ca0f939bfe6e39aef26e6e0f32969de8b00ac6c56a4be69ae",
    "89PWJcokWe2GMrimKjht": "57a609e52d921f25e98295ab7f89a07d4431f357dfbd65b796615e28b23d6472",
    "3GWSpjn7tfVISB5tun6E": "61a761dc270d433d9282d5e8d519d23709d407e7045776cf1cbc06df29f04839",
    "nzAfMLWbcsRz3lvui57b": "a4ca55757a0117c72f95c6486e26a548992c9f5018c0bacd59391a8226220b97",
    "0c7l9Fb7faXcnYj2TAQG": "7398804d9eaf2f463899a907587c33a390591775784f87857b6d0e1e4e3e66f6",
    "ersfAjrmSe390RN4j9pI": "7398804d9eaf2f463899a907587c33a390591775784f87857b6d0e1e4e3e66f6",
}
# Eleven v3 takes its direction as short bracketed tags, and bills every
# character, so these are terse: the character in a few words, and a line's
# own `tag` from the manifest where it has one.
ELEVEN_TAG = {
    "Sameer": "[quick, performed]",
    "Sameer-low": "[low, tired, close]",
    "Bhasin": "[low, unhurried, calm]",
    "Dilip": "[young, earnest]",
    "Dilip-weak": "[hoarse, weak, slow]",
    "Raju": "[exhausted, scared]",
    "Kunal": "[drunk, loud]",
    "Guard": "[sleepy, quiet]",
    "SHO": "[bored]",
    "Meera": "[precise, fast, cool]",
    "Anita": "[whispers, careful]",
    "Boy": "[young, keen]",
}
ELEVEN_MODEL = "eleven_v3"
ELEVEN_URL = "https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=pcm_24000"

# One representative line per character, for the audition.
AUDITION = {
    "Sameer": "हाँ, वहीं। रोलिंग, भाई?",
    "Sameer-low": "दूसरी… मैं पोज़ कर रहा था। मुझे लगा ख़ाली है।",
    "Bhasin": "सुबह सात बजे तक फ़ोन गेट दो पे छोड़ देना। बाक़ी हम देख लेंगे।",
    "Dilip": "भैया… मुंबई पक्की ना?",
    "Dilip-weak": "भैया… आप आ रहे हो ना?",
    "Raju": "तो समीर भैया कहाँ हैं? सात दिन से फ़ोन कर रहा हूँ।",
    "Kunal": "ओए होए!",
    "Guard": "खुराना साहब, माफ़ करना, इतनी रात को।",
    "Meera": "मैं तुझे नहीं बताऊँगी क्या करना है।",
    "Anita": "रोड एक्सीडेंट नहीं है। गोली का घाव है, कंधे में।",
    "Boy": "सर, लाइट यहाँ ठीक है?",
}


def env(name):
    v = os.environ.get(name)
    if v:
        return v
    try:
        for raw in open(os.path.join(ROOT, ".env.local"), encoding="utf-8"):
            if raw.startswith(name + "="):
                return raw.split("=", 1)[1].strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    return None


def direction(line, entry):
    """The direction for one line: who, how the phone heard it, and anything the line itself says."""
    parts = [WHO[line["who"]], STYLE[entry["style"]]]
    if line.get("style"):
        parts.append(line["style"])
    parts.append("Natural pace, with the pauses a person takes. No narration, no added words: say only the line.")
    return " ".join(parts)


def post(url, headers, body, tries=5):
    data = json.dumps(body).encode("utf-8")
    for n in range(tries):
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json", **headers}, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            text = e.read().decode("utf-8", "replace")
            if e.code in (429, 500, 502, 503) and n < tries - 1:
                wait = 2 ** n * 3
                print(f"  {e.code}; waiting {wait}s", file=sys.stderr)
                time.sleep(wait)
                continue
            raise SystemExit(f"{url}\n{e.code} {text[:800]}")


def get(url, headers):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise SystemExit(f"{url}\n{e.code} {e.read().decode('utf-8', 'replace')[:800]}")


def eleven_account(key):
    """The plan: how many voices it can hold, and how many characters are left this month."""
    s = get("https://api.elevenlabs.io/v1/user/subscription", {"xi-api-key": key})
    print(f"plan: {s.get('tier')}  voices: {s.get('voice_limit')} slots  characters: {s.get('character_count')}/{s.get('character_limit')} used this cycle")
    need = sum(len(l["text"]) for e in load_manifest() for l in e["lines"])
    print(f"the whole chapter is about {need} characters of Hindi; a full build with direction tags is roughly twice that.")
    voices = get("https://api.elevenlabs.io/v1/voices", {"xi-api-key": key}).get("voices", [])
    mine = [v for v in voices if v.get("category") not in ("premade",)]
    print(f"in My Voices now: {len(mine)}")
    for v in mine:
        print(f"  {v['voice_id']}  {v['name']}  ({v.get('labels', {})})")


def eleven_library(key):
    """Hindi voices in the Voice Library: who they are, and a preview to listen to."""
    for gender in ("male", "female"):
        page = get(f"https://api.elevenlabs.io/v1/shared-voices?language=hi&gender={gender}&page_size=40", {"xi-api-key": key})
        print(f"\n== {gender}")
        for v in page.get("voices", []):
            free = "" if v.get("free_users_allowed", True) else "  (paid plans only)"
            print(f"{v['voice_id']}  owner {v['public_owner_id']}")
            print(f"  {v['name']} · {v.get('age', '?')} · {v.get('accent', '?')} · {v.get('descriptive', '')} · {v.get('use_case', '')}{free}")
            print(f"  {v.get('preview_url', '')}")


def eleven_add(key, pairs):
    """Add library voices to the account, one slot each, and write their IDs into ELEVEN."""
    by_id = {}
    for gender in ("male", "female"):
        for v in get(f"https://api.elevenlabs.io/v1/shared-voices?language=hi&gender={gender}&page_size=100", {"xi-api-key": key}).get("voices", []):
            by_id[v["voice_id"]] = v
    added = {}
    for pair in pairs.split(","):
        who, vid = pair.split("=")
        v = by_id.get(vid)
        if not v:
            raise SystemExit(f"{vid} isn't in the Hindi library listing; --library shows what is.")
        out = json.loads(post(f"https://api.elevenlabs.io/v1/voices/add/{v['public_owner_id']}/{vid}", {"xi-api-key": key}, {"new_name": f"Raakh · {who}"}))
        added[who] = out.get("voice_id", vid)
        print(f"{who}: {v['name']} → {added[who]}")
    src = open(__file__, encoding="utf-8").read()
    for who, vid in added.items():
        src = src.replace(f'    "{who}": "",', f'    "{who}": "{vid}",', 1)
        if who == "Sameer":
            src = src.replace('    "Sameer-low": "",', f'    "Sameer-low": "{vid}",', 1)
        if who == "Dilip":
            src = src.replace('    "Dilip-weak": "",', f'    "Dilip-weak": "{vid}",', 1)
    open(__file__, "w", encoding="utf-8").write(src)
    print("ELEVEN updated in this script.")


def gemini(voice, text, style, key):
    body = {
        "model": GEMINI_MODEL,
        "input": [{"type": "user_input", "content": [{"type": "text", "text": text, "annotations": [{"type": "speech_metadata", "style": style}]}]}],
        "response_format": {"type": "audio", "mime_type": "audio/l16", "sample_rate": 24000},
        "generation_config": {"speech_config": [{"voice": voice}]},
    }
    out = json.loads(post(GEMINI_URL, {"x-goog-api-key": key}, body))
    for step in out.get("steps", []):
        for c in step.get("content", []):
            if c.get("type") == "audio" and c.get("data"):
                return base64.b64decode(c["data"])
    raise SystemExit(f"Gemini sent no audio: {json.dumps(out)[:600]}")


def elevenlabs(voice, text, style, key):
    if not voice:
        raise SystemExit("ELEVEN has no voice ID for this character yet.")
    body = {"text": f"{style} {text}".strip(), "model_id": ELEVEN_MODEL, "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": True}}
    return post(ELEVEN_URL.format(voice=voice), {"xi-api-key": key}, body)


def eleven_tags(line, entry):
    """The direction as Eleven v3 tags: the character's, then the line's own."""
    return " ".join(t for t in (ELEVEN_TAG[line["who"]], f"[{line['tag']}]" if line.get("tag") else "") if t)


def eleven_mine(key):
    return {v["voice_id"] for v in get("https://api.elevenlabs.io/v1/voices", {"xi-api-key": key}).get("voices", []) if v.get("category") != "premade"}


def eleven_render(key, who_list, render):
    """Three slots on the free plan: put these characters' voices in, render every line of theirs into the
    cache, and take the voices out again (never one that was there before). The build then needs no slot."""
    before = eleven_mine(key)
    added = []
    for who in who_list:
        vid = ELEVEN[who]
        if vid in before or vid in added:
            continue
        out = json.loads(post(f"https://api.elevenlabs.io/v1/voices/add/{ELEVEN_OWNER[vid]}/{vid}", {"xi-api-key": key}, {"new_name": f"Raakh · {who}"}))
        if out.get("voice_id", vid) != vid:
            raise SystemExit(f"{who}: the account gave the voice a different ID ({out.get('voice_id')}); put it in ELEVEN and run again.")
        added.append(vid)
        print(f"+ {who} ({vid}) in the account")
    try:
        n = 0
        for e in load_manifest():
            for l in e["lines"]:
                if l["who"] in who_list:
                    render(ELEVEN[l["who"]], l["text"], eleven_tags(l, e))
                    n += 1
                    print(f"  {l['who']:11} {l['text'][:48]}", flush=True)
        print(f"{n} lines rendered for {', '.join(who_list)}")
    finally:
        for vid in added:
            req = urllib.request.Request(f"https://api.elevenlabs.io/v1/voices/{vid}", headers={"xi-api-key": key}, method="DELETE")
            try:
                urllib.request.urlopen(req, timeout=60).read()
                print(f"- {vid} out of the account again")
            except urllib.error.HTTPError as e:
                print(f"could not remove {vid}: {e.code}", file=sys.stderr)


def main(argv):
    # --flag=value or --flag value; anything else is the work dir.
    args, flags = [], {}
    i = 0
    while i < len(argv):
        a = argv[i]
        if a.startswith("--"):
            name, _, value = a.partition("=")
            if not value and name in ("--only", "--backend", "--add", "--render") and i + 1 < len(argv):
                value, i = argv[i + 1], i + 1
            flags[name] = value or True
        else:
            args.append(a)
        i += 1
    backend = flags.get("--backend", "gemini")
    only = set(str(flags["--only"]).split(",")) if flags.get("--only") else None
    entries = [e for e in load_manifest() if not only or e["key"] in only]

    if "--dry-run" in flags:
        for e in entries:
            print(f"## {e['key']}  [{e['style']}, {e.get('seconds', '-')}s]")
            for l in e["lines"]:
                voice = GEMINI[l["who"]][0] if backend == "gemini" else ELEVEN[l["who"]] or "?"
                print(f"  {l['who']} · {voice} · at {l.get('at', 0)}s")
                print(f"    {l['text']}")
                print(f"    → {direction(l, e)}")
        return

    if backend == "elevenlabs" and flags.get("--render"):
        if not args:
            raise SystemExit("--render needs the work dir, where the lines are cached.")
        key = env("ELEVENLABS_API_KEY")
        work = args[0]
        os.makedirs(work, exist_ok=True)

        def render_one(voice, text, style):
            h = hashlib.sha1(f"{backend}|{voice}|{style}|{text}".encode()).hexdigest()[:16]
            pcm = os.path.join(work, h + ".pcm")
            if not os.path.exists(pcm):
                open(pcm, "wb").write(elevenlabs(voice, text, style, key))
            return pcm

        eleven_render(key, str(flags["--render"]).split(","), render_one)
        return

    if "--cached" in flags:
        # How much of each character is already in the work dir: a voice can leave the account once it is all there.
        work = args[0] if args else os.path.join(ROOT, "samples-src", "voices-eleven")
        have = {}
        for e in load_manifest():
            for l in e["lines"]:
                voice = ELEVEN[l["who"]] if backend == "elevenlabs" else GEMINI[l["who"]][0]
                style = eleven_tags(l, e) if backend == "elevenlabs" else direction(l, e)
                h = hashlib.sha1(f"{backend}|{voice}|{style}|{l['text']}".encode()).hexdigest()[:16]
                done, total = have.get(l["who"], (0, 0))
                have[l["who"]] = (done + os.path.exists(os.path.join(work, h + ".pcm")), total + 1)
        for who, (done, total) in have.items():
            print(f"  {who:11} {done:3}/{total:<3} {ELEVEN[who] if backend == 'elevenlabs' else ''}")
        return

    if backend == "elevenlabs" and any(f in flags for f in ("--account", "--library", "--add")):
        key = env("ELEVENLABS_API_KEY")
        if not key:
            raise SystemExit("No key: set ELEVENLABS_API_KEY in the environment or .env.local.")
        if "--account" in flags:
            eleven_account(key)
        if "--library" in flags:
            eleven_library(key)
        if flags.get("--add"):
            eleven_add(key, str(flags["--add"]))
        return

    if not args:
        raise SystemExit(__doc__)
    work = args[0]
    os.makedirs(work, exist_ok=True)
    key = env("GEMINI_API_KEY" if backend == "gemini" else "ELEVENLABS_API_KEY")
    if not key:
        raise SystemExit(f"No key: set {'GEMINI_API_KEY' if backend == 'gemini' else 'ELEVENLABS_API_KEY'} in the environment or .env.local.")

    def render(voice, text, style):
        h = hashlib.sha1(f"{backend}|{voice}|{style}|{text}".encode()).hexdigest()[:16]
        pcm = os.path.join(work, h + ".pcm")
        if not os.path.exists(pcm):
            raw = gemini(voice, text, style, key) if backend == "gemini" else elevenlabs(voice, text, style, key)
            open(pcm, "wb").write(raw)
        return pcm_to_floats(open(pcm, "rb").read())

    if "--audition" in flags:
        from lib.voicedsp import treat, write_wav

        where = os.path.join(work, "audition")
        os.makedirs(where, exist_ok=True)
        for who, text in AUDITION.items():
            first, others = GEMINI[who]
            for voice in [first, *others] if backend == "gemini" else [ELEVEN[who]]:
                style = " ".join([WHO[who], STYLE["call"], "Natural pace. Say only the line."])
                floats = treat(render(voice, text, style), "note")
                path = os.path.join(where, f"{who}-{voice}.wav")
                write_wav(path, floats)
                print(path)
        print(f"\nListen in {where}; the first voice of each is the cast, the rest are the alternatives in GEMINI.")
        return

    def synth(line, entry):
        if backend == "gemini":
            return render(GEMINI[line["who"]][0], line["text"], direction(line, entry))
        return render(ELEVEN[line["who"]], line["text"], eleven_tags(line, entry))

    built = {}
    for e in entries:
        k, path, secs = mix(e, synth, work)
        built[k] = path
        print(f"{k:28} {secs:5.1f}s  (planned {e.get('seconds', '-')})", flush=True)
    write_voices_ts(built)
    print(f"\n{len(built)} recordings; content/raakh/voices.ts updated.")


if __name__ == "__main__":
    main(sys.argv[1:])
