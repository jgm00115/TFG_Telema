#!/usr/bin/env bash
#
# Usage:
#   ./batch_transcode_12k_dash.sh video1.mkv video2.mkv video3.mkv [start_time] [duration]
#
# This script:
#   1. Takes a list of 12K input video files (any format supported by ffmpeg) as arguments
#   2. Optional start time (e.g., 10:00:00) and duration (in seconds)
#   3. For each input, creates 12K, 8K (from 12K), and 4K (from 8K) versions
#   4. Outputs are MPEG-DASH compatible (fragmented MP4)

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <input1.mkv> [input2.mkv] [...] [start_time] [duration]"
  exit 1
fi

# Default values
START_TIME=0
DURATION=60

# Check if last two arguments are time/duration (in the format HH:MM:SS and numeric duration)
if [[ "${@: -2:1}" =~ ^[0-9]{2}:[0-9]{2}:[0-9]{2}$ ]] && [[ "${@: -1}" =~ ^[0-9]+$ ]]; then
  START_TIME="${@: -2:1}"
  DURATION="${@: -1}"
  FILE_COUNT=$(($#-2))
else
  FILE_COUNT=$#
fi

for ((i=1; i<=FILE_COUNT; i++))
do
  INPUT=${!i}
  if [ ! -f "$INPUT" ]; then
    echo "File not found: $INPUT"
    continue
  fi

  INPUT_DIR=$(dirname "$INPUT")
  BASENAME=$(basename "$INPUT" | sed 's/\.[^.]*$//')

  # Output filenames
  OUTPUT_12K=$INPUT_DIR/${BASENAME}_12k_dash.mp4
  OUTPUT_8K=$INPUT_DIR/${BASENAME}_8k_dash.mp4
  OUTPUT_4K=$INPUT_DIR/${BASENAME}_4k_dash.mp4

  echo "Transcoding $INPUT to 12K HEVC..."
  ffmpeg -y -ss "$START_TIME" -t "$DURATION" -i "$INPUT" \
    -vf scale=12288:6144:force_original_aspect_ratio=decrease \
    -c:v hevc_videotoolbox -b:v 50M \
    -pix_fmt yuv420p \
    -movflags +faststart+frag_keyframe+empty_moov \
    "$OUTPUT_12K"

  echo "Transcoding $OUTPUT_12K to 8K HEVC..."
  ffmpeg -y -i "$OUTPUT_12K" \
    -vf scale=8192:4096:force_original_aspect_ratio=decrease \
    -c:v hevc_videotoolbox -b:v 25M \
    -pix_fmt yuv420p \
    -movflags +faststart+frag_keyframe+empty_moov \
    "$OUTPUT_8K"

  echo "Transcoding $OUTPUT_8K to 4K HEVC..."
  ffmpeg -y -i "$OUTPUT_8K" \
    -vf scale=4096:2048:force_original_aspect_ratio=decrease \
    -c:v hevc_videotoolbox -b:v 10M \
    -pix_fmt yuv420p \
    -movflags +faststart+frag_keyframe+empty_moov \
    "$OUTPUT_4K"

  echo "Finished processing $INPUT"
  echo "Generated files:"
  echo "  12K: $OUTPUT_12K"
  echo "  8K:  $OUTPUT_8K"
  echo "  4K:  $OUTPUT_4K"
  echo "----------------------------------"
done

echo "All done!"
