#!/bin/bash
set -e

INPUT_DIR="."
FULL_DIR="$INPUT_DIR/full"
THUMB_DIR="$INPUT_DIR/thumbs"

mkdir -p "$FULL_DIR" "$THUMB_DIR"

counter=1

shopt -s nullglob
for file in "$INPUT_DIR"/*.HEIC "$INPUT_DIR"/*.heic; do
  filename=$(printf "%03d" "$counter")   # 001, 002, 003... (change to %d for no zero padding)

  full_output="$FULL_DIR/${filename}.avif"
  thumb_output="$THUMB_DIR/${filename}.webp"

  echo "Converting $file -> $full_output"
  magick "$file" -resize 4000x4000\> -quality 95 "$full_output"

  echo "Generating thumbnail -> $thumb_output"
  magick "$full_output" -resize 600x600\> -quality 80 "$thumb_output"

  counter=$((counter + 1))
done
