#!/bin/sh
# Copies the game's own photos, clips and voices into media/, named by the beat
# that uses them (see 2-NIGHT.md), plus the kit-only art in art/.
# Run from anywhere: sh make-media.sh (it clears media/ first).
set -e
here="$(cd "$(dirname "$0")" && pwd)"
root="$here/../.."
img="$root/public/found/raakh"
game="$root/public/found/game"
vo="$root/public/voices/raakh"
out="$here/media"
rm -rf "$out"
mkdir -p "$out/dp"

cp_() { cp "$1" "$out/$2"; }

# Act 1
cp_ "$img/poster-dilip.jpg"            B02-poster.jpg
cp_ "$vo/call-raju-0.m4a"              B02-raju-1.m4a
cp_ "$vo/call-raju-1.m4a"              B02-raju-2.m4a
cp_ "$vo/call-raju-2.m4a"              B02-raju-3.m4a
cp_ "$vo/msg-rc-1.m4a"                 B02-raju-denial.m4a
cp_ "$vo/msg-rc-2.m4a"                 B02-raju-time.m4a
cp_ "$vo/msg-rc-3.m4a"                 B02-raju-who.m4a
cp_ "$vo/msg-r-code.m4a"               B05-raju-code.m4a
cp_ "$vo/msg-r-10.m4a"                 B05-raju-pakki.m4a
cp_ "$vo/msg-r-11.m4a"                 B05-raju-sehgal.m4a
cp_ "$vo/memo-memo-code.m4a"           B05-memo-15.m4a
cp_ "$vo/voice-d-2c.m4a"               B05-dilip-voice.m4a
cp_ "$img/dp-dilip.jpg"                B05-dilip-hello.jpg
cp_ "$vo/clip-d-2v.m4a"                B05-dilip-hello.m4a
cp_ "$vo/voice-b-vn-stranger.m4a"      B06-bhasin-stranger.m4a
cp_ "$vo/voice-b-vn-fine.m4a"          B06-bhasin-fine.m4a
cp_ "$vo/voice-b-vn-none.m4a"          B06-bhasin-none.m4a

# Midpoint
cp_ "$vo/call-meera-0.m4a"             B07-meera-1.m4a
cp_ "$vo/call-meera-1.m4a"             B07-meera-2.m4a
cp_ "$vo/msg-mc-1.m4a"                 B07-meera-whoever.m4a
cp_ "$vo/msg-mc-2.m4a"                 B07-meera-yes.m4a
cp_ "$vo/msg-mc-3.m4a"                 B07-meera-box.m4a
cp_ "$vo/msg-mc-3a.m4a"                B07-meera-whoever2.m4a
cp_ "$vo/msg-mc-4.m4a"                 B07-meera-knew.m4a
cp_ "$vo/call-meera-meera-keep-0.m4a"  B07-meera-mother.m4a
cp_ "$vo/call-meera-meera-keep-1.m4a"  B07-meera-refused.m4a
cp_ "$vo/call-meera-meera-keep-2.m4a"  B07-meera-habit.m4a
cp_ "$vo/call-meera-reveal-0.m4a"      B07-meera-enough.m4a
cp_ "$vo/msg-mr-1.m4a"                 B07-meera-camera.m4a
cp_ "$vo/call-meera-reveal-early-0.m4a" B07-meera-look.m4a
cp_ "$img/viewfinder-2.jpg"            B08-front-camera.jpg
cp_ "$img/bts.jpg"                     B08-album-1229.jpg
cp_ "$vo/reveal-away.m4a"              B08-meera-dontlook.m4a
cp_ "$vo/call-meera-meera-keep-early-0.m4a" B08-meera-delete.m4a

# Act 2
cp_ "$img/clip-reel-take.mp4"          B10-reel-take.mp4
cp_ "$vo/memo-memo-458.m4a"            B10-memo-14.m4a
cp_ "$img/clip-fire-whole.mp4"         B11-fire-whole.mp4
cp_ "$img/kunal-frame.jpg"             B13-kunal-frame.jpg
cp_ "$vo/call-guard-0.m4a"             B16-guard.m4a
cp_ "$vo/voice-b-gate.m4a"             B16-bhasin-gate.m4a
cp "$here/art/B16-proof.jpg"           "$out/B16-proof.jpg"
cp_ "$vo/voice-an-v.m4a"               B17-anita.m4a
cp_ "$img/nurse-bag-2.jpg"             B17-belongings.jpg
cp_ "$img/slip.jpg"                    B17-slip.jpg
cp_ "$vo/voice-an-4.m4a"               B18-dilip-plea.m4a

# The phone's contents
cp_ "$img/poster-dilip.jpg"            P-poster.jpg
cp_ "$img/w-portrait-2.jpg"            P-portrait.jpg
cp_ "$img/clip-fire.mp4"               P-fire-trim.mp4
cp_ "$img/clip-k-3.mp4"                P-kunal-dancefloor.mp4
cp_ "$vo/voice-m-1.m4a"                P-m-voice-1.m4a
cp_ "$vo/voice-m-2.m4a"                P-m-voice-2.m4a
cp_ "$vo/voice-m-3.m4a"                P-m-voice-3.m4a
cp_ "$vo/voice-m-4.m4a"                P-m-voice-4.m4a
cp_ "$vo/memo-memo-rangmanch.m4a"      P-memo-pitch.m4a
n=1; for w in w-baraat w-couple w-family w-pheras w-0; do cp_ "$img/$w.jpg" "P-wedding-$n.jpg"; n=$((n+1)); done

# Endings
cp_ "$game/corridor.jpg"               E-corridor.jpg
cp_ "$img/room6.jpg"                   E-room6.jpg
cp_ "$vo/media-room6.m4a"              E-room6.m4a
cp_ "$img/poster-dilip.jpg"            E-poster.jpg
cp_ "$vo/ending-dilip-thanks.m4a"      E-dilip-thanks.m4a
cp_ "$img/dilip-chhath.jpg"            E-chhath.jpg
cp_ "$game/counter.jpg"                E-counter.jpg

# Group photos
for who in raju meera bhasin kunal nitin dilip; do cp "$img/dp-$who.jpg" "$out/dp/$who.jpg"; done
cp "$root/public/found/raakh-wallpaper.jpg" "$out/dp/phone.jpg"

python3 "$here/make-poster.py" "$img/poster-dilip.jpg" "$out"

echo "media/: $(ls "$out" | wc -l | tr -d ' ') files, $(du -sh "$out" | cut -f1)"
