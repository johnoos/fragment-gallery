import path from "node:path";
import fs from "node:fs";
import { Poppler } from "node-poppler";

// --- INITIALIZATION ---
const poppler = new Poppler();

const PATHS = {
  pdfRoot: "./src/assets/pdfs/",
  outputDir: "./src/assets/previews/"
};

// --- CORE UTILITIES ---

/** Ensures the target preview directory exists */
function initializeDirectories() {
  if (!fs.existsSync(PATHS.outputDir)) {
    fs.mkdirSync(PATHS.outputDir, { recursive: true });
    console.log(`📁 Created: ${PATHS.outputDir}`);
  }
}

/** 
 * Wraps the binary conversion in a clean try/catch.
 * Uses the system's 'pdftocairo' to generate the PNG.
 */
async function generatePngFromPdf(sourcePath, outputPrefix) {
  const options = {
    firstPageToConvert: 1,
    lastPageToConvert: 1,
    pngFile: true,
    scalePageTo: 1024 
  };

  try {
    await poppler.pdfToCairo(sourcePath, outputPrefix, options);
    return true;
  } catch (err) {
    console.error(`❌ Conversion Failed: ${path.basename(sourcePath)}`, err.message);
    return false;
  }
}

/** Standardises document strings for slugs and filenames */
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '-');

// --- MAIN DATA GENERATOR ---

export default async function() {
  console.log("🚀 Initializing PDF Preview Generator...");
  initializeDirectories();

  if (!fs.existsSync(PATHS.pdfRoot)) {
    console.error("❌ PDF Root not found:", PATHS.pdfRoot);
    return [];
  }

  const manifest = [];
  
  // 1. Scan Category Folders
  const categories = fs.readdirSync(PATHS.pdfRoot, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'));

  // 2. Process Categories & Files
  for (const cat of categories) {
    const catPath = path.join(PATHS.pdfRoot, cat.name);
    const pdfFiles = fs.readdirSync(catPath)
      .filter(f => f.toLowerCase().endsWith(".pdf"));

    for (const file of pdfFiles) {
      const fileName = path.parse(file).name;
      const docSlug = slugify(fileName);
      const expectedImage = `${docSlug}-1.png`;
      
      const fullPdfPath = path.join(catPath, file);
      const outputPrefix = path.join(PATHS.outputDir, docSlug);
      const finalImagePath = path.join(PATHS.outputDir, expectedImage);

      // Incremental Build: Skip if the preview already exists
      if (!fs.existsSync(finalImagePath)) {
        console.log(`📸 Generating: ${file}`);
        await generatePngFromPdf(fullPdfPath, outputPrefix);
      }

      // 3. Map to Global Data Object
      manifest.push({
        name: fileName,
        slug: docSlug,
        category: slugify(cat.name),
        imagePath: `/assets/previews/${expectedImage}`
      });
    }
  }

  console.log(`✨ Preview Manifest Complete: ${manifest.length} items.`);
  return manifest;
}