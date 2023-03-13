#!/bin/zsh

mkdir -p ../media/Unaligned

ffmpeg \
-i ../audio/Unaligned_webm/vn_1.webm \
-i ../audio/Unaligned_webm/flute.webm \
-i ../audio/Unaligned_webm/cello.webm \
-i ../audio/Unaligned_webm/main.webm \
-map 0 -map 1 -map 2 -map 3 \
-c copy \
-f dash \
-adaptation_sets "id=0,streams=0 id=1,streams=1 id=2,streams=2 id=3,streams=3" \
-seg_duration 10 \
../media/Unaligned/manifest.mpd
