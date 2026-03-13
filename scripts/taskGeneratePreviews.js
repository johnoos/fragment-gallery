// a standalone Task run via npm to set up pdf previews (using page 1 of each pdf)

import { pdf } from 'pdf-to-img'; // importing a named export
import sharp from 'sharp';        // importing a default export
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// --- INITIALIZATION & CONSTANTS ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PATHS = {
  pdfSource: path.resolve(__dirname, '../src/assets/pdfs'),
  imgOutput: path.resolve(__dirname, '../src/assets/previews'),
  siteOutput: path.resolve(__dirname, '../_site')
};

// --- CORE UTILITIES ---

/** Ensures the output directory exists before processing */
function ensureOutputDirectory() {
  if (!fs.existsSync(PATHS.imgOutput)) {
    fs.mkdirSync(PATHS.imgOutput, { recursive: true });
    console.log(`📁 Created output directory: ${PATHS.imgOutput}`);
  }
}

/** Removes all existing preview images before regeneration */
function clearPreviewDirectory() {
  const files = fs.readdirSync(PATHS.imgOutput);

  for (const file of files) {
    const filePath = path.join(PATHS.imgOutput, file);

    // Only delete files, not subdirectories (extra safety)
    if (fs.lstatSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  }

  console.log(`🧹 Cleared preview directory: ${PATHS.imgOutput}`);
}

/** Deletes the Eleventy output folder to ensure a clean build */
function clearSiteOutput() {
  if (fs.existsSync(PATHS.siteOutput)) {
    fs.rmSync(PATHS.siteOutput, { recursive: true, force: true });
    console.log(`🧹 Cleared Eleventy output: ${PATHS.siteOutput}`);
  }
}

/** Converts a single PDF page to a white-background PNG */
async function convertPdfToImage(pdfPath, outputPath, slug) {
  try {
    // Render PDF page (Scale 1.5 is the "sweet spot" for gallery thumbnails)
    const document = await pdf(pdfPath, { scale: 1.5 });
    const pageBuffer = await document.getPage(1);
    
    // Get dimensions for the white background "canvas"
    const { width, height } = await sharp(pageBuffer).metadata();

    // Composite: Create white canvas -> Layer PDF on top -> Save
    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([{ input: pageBuffer }])
    .png()
    .toFile(outputPath);

    return true;
  } catch (err) {
    console.error(`❌ Conversion Error [${slug}]:`, err.message);
    return false;
  }
}

// --- MAIN EXECUTION LOGIC ---

async function main() {
  console.log("🚀 Starting Preview Generation...");
  clearSiteOutput();        
  ensureOutputDirectory();
  clearPreviewDirectory();

  if (!fs.existsSync(PATHS.pdfSource)) {
    console.error("❌ Source folder not found:", PATHS.pdfSource);
    return;
  }

  // 1. Identify Category Folders
  const categories = fs.readdirSync(PATHS.pdfSource, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'));

  // 2. Process each Category
  for (const cat of categories) {
    const catPath = path.join(PATHS.pdfSource, cat.name);
    const files = fs.readdirSync(catPath).filter(f => f.toLowerCase().endsWith('.pdf'));

    console.log(`📂 Processing Category: [${cat.name}] (${files.length} files)`);

    // 3. Process each PDF within the Category
    for (const file of files) {
      const slug = file.replace('.pdf', '').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const outputPath = path.join(PATHS.imgOutput, `${slug}-1.png`);

      // Incremental Build: Skip if exists
      if (fs.existsSync(outputPath)) continue;

      const success = await convertPdfToImage(path.join(catPath, file), outputPath, slug);
      if (success) console.log(`   ✅ ${file}`);
    }
  }

  console.log("✨ Preview Generation Complete.");
}

// Execute the process
main().catch(console.error);