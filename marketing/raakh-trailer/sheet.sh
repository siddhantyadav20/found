#!/bin/bash
# sheet.sh <ffmpeg> <out> files... : 3 per row, 640 wide each
FF=$1; out=$2; shift 2; files=("$@"); n=${#files[@]}; args=(); f=""
for ((i=0;i<n;i++)); do args+=(-i "${files[$i]}"); f+="[$i]scale=640:360,drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:text='$(basename ${files[$i]} .jpg)':x=8:y=8:fontsize=18:fontcolor=yellow[v$i];"; done
rows=$(( (n+2)/3 )); pad=$((rows*3-n))
for ((i=0;i<pad;i++)); do args+=(-f lavfi -i color=black:s=640x360:d=1); f+="[$((n+i))]null[v$((n+i))];"; done
for ((r=0;r<rows;r++)); do f+="[v$((r*3))][v$((r*3+1))][v$((r*3+2))]hstack=3[r$r];"; done
for ((r=0;r<rows;r++)); do f+="[r$r]"; done; f+="vstack=$rows"
$FF -nostdin -v error -y "${args[@]}" -filter_complex "$f" -frames:v 1 -q:v 3 "$out"
