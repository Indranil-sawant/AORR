const fs = require('fs');
const path = require('path');
const sharp = require('./node_modules/sharp');

async function runOptimization() {
    const imagesDir = 'images';
    const backupDir = 'images_backup_original';
    
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    
    const files = fs.readdirSync(imagesDir);
    console.log(`Auditing and optimizing ${files.length} items in images/ ...`);
    
    let totalOriginalBytes = 0;
    let totalOptimizedBytes = 0;
    const report = [];

    for (const file of files) {
        const fullPath = path.join(imagesDir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            continue;
        }
        
        const ext = path.extname(file).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext)) {
            continue;
        }
        
        // Backup original if not already backed up
        const backupPath = path.join(backupDir, file);
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(fullPath, backupPath);
        }
        
        if (stat.size === 0) {
            continue;
        }
        
        totalOriginalBytes += stat.size;
        
        if (ext === '.svg') {
            totalOptimizedBytes += stat.size;
            continue;
        }
        
        try {
            // Read entire file into buffer to avoid Windows file lock
            const inputBuffer = fs.readFileSync(fullPath);
            const meta = await sharp(inputBuffer).metadata();
            let pipeline = sharp(inputBuffer);
            
            // If image is ridiculously oversized (e.g. > 2000px width/height), scale down to max 2000px while keeping aspect ratio
            const maxDimension = 2000;
            if (meta.width > maxDimension || meta.height > maxDimension) {
                if (meta.width >= meta.height) {
                    pipeline = pipeline.resize({ width: maxDimension, withoutEnlargement: true });
                } else {
                    pipeline = pipeline.resize({ height: maxDimension, withoutEnlargement: true });
                }
            }
            
            let optBuffer;
            if (ext === '.png') {
                if (file === 'datta_maharaj.png') {
                    // Preserve 100% visual fidelity for sacred deity image
                    optBuffer = await pipeline
                        .png({ quality: 90, compressionLevel: 9, effort: 10 })
                        .toBuffer();
                } else if (file === 'logo.png') {
                    // Crisp sharp logo
                    optBuffer = await pipeline
                        .png({ quality: 90, compressionLevel: 9, effort: 10 })
                        .toBuffer();
                } else {
                    optBuffer = await pipeline
                        .png({ quality: 85, compressionLevel: 9, effort: 8 })
                        .toBuffer();
                }
            } else if (ext === '.webp') {
                optBuffer = await pipeline
                    .webp({ quality: 84, effort: 6 })
                    .toBuffer();
            } else if (ext === '.jpg' || ext === '.jpeg') {
                optBuffer = await pipeline
                    .jpeg({ quality: 82, mozjpeg: true })
                    .toBuffer();
            }
            
            // Overwrite safely if size reduced
            if (optBuffer && optBuffer.length < stat.size && optBuffer.length > 100) {
                fs.writeFileSync(fullPath, optBuffer);
                const saved = stat.size - optBuffer.length;
                totalOptimizedBytes += optBuffer.length;
                report.push({
                    file,
                    dims: `${meta.width}x${meta.height}`,
                    origKb: (stat.size / 1024).toFixed(1),
                    optKb: (optBuffer.length / 1024).toFixed(1),
                    savedKb: (saved / 1024).toFixed(1),
                    pct: ((saved / stat.size) * 100).toFixed(1)
                });
            } else {
                totalOptimizedBytes += stat.size;
            }
        } catch (err) {
            console.error(`Error optimizing ${file}:`, err.message);
            totalOptimizedBytes += stat.size;
        }
    }
    
    // Regenerate any 0-byte webp files from their jpg counterparts
    for (const file of files) {
        const fullPath = path.join(imagesDir, file);
        if (file.endsWith('.webp') && fs.existsSync(fullPath) && fs.statSync(fullPath).size === 0) {
            const jpgName = file.replace(/\.webp$/i, '.jpg');
            const jpgPath = path.join(imagesDir, jpgName);
            if (fs.existsSync(jpgPath) && fs.statSync(jpgPath).size > 0) {
                console.log(`Generating valid WebP from JPG: ${file} <- ${jpgName}`);
                const jpgBuffer = fs.readFileSync(jpgPath);
                const webpBuffer = await sharp(jpgBuffer)
                    .resize({ width: 2000, withoutEnlargement: true })
                    .webp({ quality: 84, effort: 6 })
                    .toBuffer();
                fs.writeFileSync(fullPath, webpBuffer);
                console.log(`Generated ${file}: ${(webpBuffer.length / 1024).toFixed(1)} KB`);
            }
        }
    }
    
    console.log('\n=== IMAGE OPTIMIZATION SUMMARY ===');
    console.log(`Original total size: ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Optimized total size: ${(totalOptimizedBytes / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Total space saved: ${((totalOriginalBytes - totalOptimizedBytes) / (1024 * 1024)).toFixed(2)} MB (${(((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100).toFixed(1)}% reduction!)`);
    
    report.sort((a, b) => parseFloat(b.savedKb) - parseFloat(a.savedKb));
    console.log('\nTop 30 biggest image reductions:');
    report.slice(0, 30).forEach(r => {
        console.log(`  ${r.file.padEnd(42)}: ${r.origKb.padStart(8)} KB -> ${r.optKb.padStart(7)} KB (${r.pct}% saved)`);
    });
}

runOptimization();
