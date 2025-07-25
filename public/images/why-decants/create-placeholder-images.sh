#!/bin/bash

# Create placeholder images for Why Decants page
# This script creates basic placeholder images with text

# Function to create a placeholder image with text
create_placeholder() {
  local filename=$1
  local text=$2
  
  convert -size 800x800 \
    -gravity center \
    -background "#f8f5f2" \
    -fill "#333333" \
    -font "Arial" \
    -pointsize 36 \
    label:"$text" \
    "$filename"
}

# Create all placeholder images
create_placeholder "decants-hero.jpg" "Hero: Forvr Murr 8ml bottles with full-size perfume bottle"
create_placeholder "expensive-mistake.jpg" "Full Bottles = High Risk"
create_placeholder "multiple-scents.jpg" "Try 3 Scents Instead of One"
create_placeholder "signature-scent.jpg" "Find Your Signature, Without Pressure"
create_placeholder "luxury-packaging.jpg" "Designed to Be Desired"
create_placeholder "layering-scents.jpg" "Perfect for Layering"

echo "Placeholder images created successfully!"
