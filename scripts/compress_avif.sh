#!/bin/bash

# Check if input file is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <path_to_avif_file>"
    exit 1
fi

INPUT_FILE="$1"

# Check if file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: File '$INPUT_FILE' not found."
    exit 1
fi

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed."
    exit 1
fi

# Generate output filename
FILENAME=$(basename -- "$INPUT_FILE")
EXTENSION="${FILENAME##*.}"
FILENAME="${FILENAME%.*}"
OUTPUT_FILE="$(dirname "$INPUT_FILE")/${FILENAME}_compressed.${EXTENSION}"

# Get original size
ORIG_SIZE=$(du -h "$INPUT_FILE" | cut -f1)
echo "Compressing '$INPUT_FILE' ($ORIG_SIZE)..."

# Run ffmpeg compression
# Parameters used:
# -c:v libsvtav1 : Use SVT-AV1 encoder
# -crf 40        : Constant Rate Factor (Quality). Lower is better quality/larger size. 40 is a good balance.
# -preset 6      : Encoding speed/efficiency. Lower is slower/better compression. 6 is a good balance.
ffmpeg -i "$INPUT_FILE" -c:v libsvtav1 -crf 40 -preset 6 "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    NEW_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo "Compression successful!"
    echo "Original size: $ORIG_SIZE"
    echo "New size:      $NEW_SIZE"
    
    # Prompt to overwrite
    read -p "Do you want to replace the original file? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mv "$OUTPUT_FILE" "$INPUT_FILE"
        echo "Original file replaced."
    else
        echo "Compressed file saved as: $OUTPUT_FILE"
    fi
else
    echo "Compression failed."
    rm -f "$OUTPUT_FILE"
    exit 1
fi
