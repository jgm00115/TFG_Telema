#!/usr/bin/env bash
#
# Usage:
#   ./transcode_12k_clip.sh /absolute/path/to/CAM03-BALCONY.mkv 00:10:00 60
#
# This script:
#   1. Takes a 12K input .mkv (or .mp4, etc.) file using an absolute path
#   2. Skips to the START_TIME (e.g., 00:10:00)
#   3. Extracts DURATION seconds (e.g., 60s) from that point
#   4. Produces 3 WebM (VP9) outputs at different resolutions: 12K, 8K, 4K
#   5. Saves them in the same directory as the input file

if [ -z "$1" ]; then
  echo "Usage: $0 <input_12k_video> [start_time] [duration]"
  echo "Example: $0 /Users/chris/Downloads/video.mkv 00:10:00 60"
  exit 1
fi

INPUT="$1"
START_TIME=${2:-0}  # Default to 0 if not provided
DURATION=${3:-60}   # Default to 60 seconds if not provided

# Extract directory and filename
INPUT_DIR="$(dirname "$INPUT")"
BASENAME="$(basename "$INPUT" | sed 's/\.[^.]*$//')"  # Remove extension

# Output filenames
OUTPUT_12K="$INPUT_DIR/${BASENAME}_12k_clip.webm"
OUTPUT_8K="$INPUT_DIR/${BASENAME}_8k_clip.webm"
OUTPUT_4K="$INPUT_DIR/${BASENAME}_4k_clip.webm"

echo "Input: $INPUT"
echo "Start time: $START_TIME"
echo "Duration: ${DURATION}s"
echo "Outputs:"
echo "  $OUTPUT_12K"
echo "  $OUTPUT_8K"
echo "  $OUTPUT_4K"
echo "-----------------------------------"

# 1) 12K -> ~50 Mbps
echo "Transcoding 12K clip..."
ffmpeg -y -ss "$START_TIME" -t "$DURATION" -i "$INPUT" \
  -vf scale=12288:6144:force_original_aspect_ratio=decrease \
  -c:v libvpx-vp9 -b:v 50M -row-mt 1 -threads 8 \
  -pix_fmt yuv420p \
  "$OUTPUT_12K"

# 2) 8K -> ~25 Mbps
echo "Transcoding 8K clip..."
ffmpeg -y -ss "$START_TIME" -t "$DURATION" -i "$INPUT" \
  -vf scale=8192:4096:force_original_aspect_ratio=decrease \
  -c:v libvpx-vp9 -b:v 25M -row-mt 1 -threads 8 \
  -pix_fmt yuv420p \
  "$OUTPUT_8K"

# 3) 4K -> ~10 Mbps
echo "Transcoding 4K clip..."
ffmpeg -y -ss "$START_TIME" -t "$DURATION" -i "$INPUT" \
  -vf scale=4096:2048:force_original_aspect_ratio=decrease \
  -c:v libvpx-vp9 -b:v 10M -row-mt 1 -threads 8 \
  -pix_fmt yuv420p \
  "$OUTPUT_4K"

echo "Done!"
