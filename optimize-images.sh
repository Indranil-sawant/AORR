#!/bin/bash
# AORR Global Trading - Image Optimization Script
# This script converts all images to WebP and creates responsive sizes
# Expected file size reduction: 70-90%

echo "🚀 AORR Image Optimization Starting..."
echo "================================================"

# Check if required tools are installed
command -v convert >/dev/null 2>&1 || { echo "❌ ImageMagick not installed. Run: sudo apt-get install imagemagick"; exit 1; }
command -v cwebp >/dev/null 2>&1 || { echo "❌ WebP tools not installed. Run: sudo apt-get install webp"; exit 1; }

# Create backup directory
mkdir -p images/backup
echo "📁 Created backup directory"

# Change to images directory
cd images/ || exit

# Counter for statistics
total_files=0
total_original_size=0
total_optimized_size=0

echo ""
echo "🖼️  Processing JPEG images..."
echo "================================================"

# Process all JPG/JPEG files
for img in *.jpg *.jpeg; do
    if [ -f "$img" ]; then
        # Get base name without extension
        base="${img%.*}"
        
        # Skip if already processed (has responsive versions)
        if [ -f "${base}-768.webp" ]; then
            echo "⏭️  Skipping $img (already optimized)"
            continue
        fi
        
        # Get original file size
        original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img")
        total_original_size=$((total_original_size + original_size))
        
        echo ""
        echo "📸 Processing: $img ($(numfmt --to=iec-i --suffix=B $original_size))"
        
        # Backup original
        cp "$img" "backup/$img"
        
        # Generate responsive JPG sizes
        echo "   → Creating responsive JPG versions..."
        convert "$img" -resize 480x -quality 85 -strip "${base}-480.jpg"
        convert "$img" -resize 768x -quality 85 -strip "${base}-768.jpg"
        convert "$img" -resize 1200x -quality 85 -strip "${base}-1200.jpg"
        convert "$img" -resize 1920x -quality 80 -strip "${base}-1920.jpg"
        
        # Generate WebP versions
        echo "   → Creating WebP versions..."
        cwebp -q 80 "${base}-480.jpg" -o "${base}-480.webp" 2>/dev/null
        cwebp -q 80 "${base}-768.jpg" -o "${base}-768.webp" 2>/dev/null
        cwebp -q 80 "${base}-1200.jpg" -o "${base}-1200.webp" 2>/dev/null
        cwebp -q 75 "${base}-1920.jpg" -o "${base}-1920.webp" 2>/dev/null
        
        # Also create a default WebP for direct usage
        cwebp -q 80 "$img" -o "${base}.webp" 2>/dev/null
        
        # Calculate savings
        webp_size=$(stat -f%z "${base}-768.webp" 2>/dev/null || stat -c%s "${base}-768.webp")
        total_optimized_size=$((total_optimized_size + webp_size))
        savings=$(( (original_size - webp_size) * 100 / original_size ))
        
        echo "   ✅ Saved ${savings}% ($(numfmt --to=iec-i --suffix=B $original_size) → $(numfmt --to=iec-i --suffix=B $webp_size))"
        
        total_files=$((total_files + 1))
    fi
done

echo ""
echo "🎨 Processing PNG images..."
echo "================================================"

# Process all PNG files
for img in *.png; do
    if [ -f "$img" ]; then
        base="${img%.*}"
        
        # Skip if already processed
        if [ -f "${base}.webp" ]; then
            echo "⏭️  Skipping $img (already optimized)"
            continue
        fi
        
        original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img")
        total_original_size=$((total_original_size + original_size))
        
        echo ""
        echo "📸 Processing: $img ($(numfmt --to=iec-i --suffix=B $original_size))"
        
        # Backup original
        cp "$img" "backup/$img"
        
        # For PNGs, create WebP only (preserve transparency if needed)
        echo "   → Creating WebP version..."
        cwebp -q 85 "$img" -o "${base}.webp" 2>/dev/null
        
        # Also create responsive sizes if it's a large image
        img_width=$(identify -format "%w" "$img")
        if [ "$img_width" -gt 800 ]; then
            echo "   → Creating responsive versions..."
            convert "$img" -resize 480x -quality 85 "${base}-480.png"
            convert "$img" -resize 768x -quality 85 "${base}-768.png"
            cwebp -q 85 "${base}-480.png" -o "${base}-480.webp" 2>/dev/null
            cwebp -q 85 "${base}-768.png" -o "${base}-768.webp" 2>/dev/null
        fi
        
        webp_size=$(stat -f%z "${base}.webp" 2>/dev/null || stat -c%s "${base}.webp")
        total_optimized_size=$((total_optimized_size + webp_size))
        savings=$(( (original_size - webp_size) * 100 / original_size ))
        
        echo "   ✅ Saved ${savings}% ($(numfmt --to=iec-i --suffix=B $original_size) → $(numfmt --to=iec-i --suffix=B $webp_size))"
        
        total_files=$((total_files + 1))
    fi
done

# Calculate total savings
total_savings=$(( (total_original_size - total_optimized_size) * 100 / total_original_size ))

echo ""
echo "================================================"
echo "✨ OPTIMIZATION COMPLETE!"
echo "================================================"
echo "📊 Statistics:"
echo "   Files processed: $total_files"
echo "   Original size: $(numfmt --to=iec-i --suffix=B $total_original_size)"
echo "   Optimized size: $(numfmt --to=iec-i --suffix=B $total_optimized_size)"
echo "   Total savings: ${total_savings}% ($(numfmt --to=iec-i --suffix=B $((total_original_size - total_optimized_size))))"
echo ""
echo "💾 Original files backed up to: images/backup/"
echo "🎯 Next steps:"
echo "   1. Update HTML files to use WebP with <picture> tags"
echo "   2. Add lazy loading to images"
echo "   3. Test on various browsers"
echo ""
echo "🚀 Your site will now load MUCH faster!"
