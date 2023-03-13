#!/bin/zsh

mkdir -p ../audio/Unaligned_webm

ffmpeg \
-i ../audio/Unaligned/vn_1.wav \
-i ../audio/Unaligned/flute.wav \
-i ../audio/Unaligned/cello.wav \
-i ../audio/Unaligned/main.wav \
-map 0:a -c:a libopus -ac 2 -mapping_family 255 -vn -f webm -dash 1 ../audio/Unaligned_webm/vn_1.webm \
-map 1:a -c:a libopus -ac 2 -mapping_family 255 -vn -f webm -dash 1 ../audio/Unaligned_webm/flute.webm \
-map 2:a -c:a libopus -ac 2 -mapping_family 255 -vn -f webm -dash 1 ../audio/Unaligned_webm/cello.webm \
-map 3:a -c:a libopus -b:a 1920k -ac 30 -mapping_family 255 -vn -f webm -dash 1 ../audio/Unaligned_webm/main.webm