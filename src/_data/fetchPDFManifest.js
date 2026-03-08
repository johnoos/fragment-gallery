import path from "node:path";
import fs from "node:fs";

/** 
 * ARCHITECTURAL ROLE: 
 * This is a "Data Model" that provides a flat manifest of all PDF assets.
 * It strictly READS the file system and returns a JSON-like array.
 */

const PATHS = {
  pdfRoot: "./src/assets/pdfs/"
};

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '-');

export default async function() {
  // 1. Safety Check
  if (!fs.existsSync(PATHS.pdfRoot)) return [];

  const manifest = [];
  
  // 2. Scan Category Folders
  const categories = fs.readdirSync(PATHS.pdfRoot, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'));

  // 3. Map Files to Data Objects
  for (const cat of categories) {
    const catPath = path.join(PATHS.pdfRoot, cat.name);
    const pdfFiles = fs.readdirSync(catPath)
      .filter(f => f.toLowerCase().endsWith(".pdf"));

    for (const file of pdfFiles) {
      const fileName = path.parse(file).name;
      const docSlug = slugify(fileName);
      
      // We assume the preview exists in the _site output folder
      // thanks to our 'taskGeneratePreviews.js' worker.
      manifest.push({
        name: fileName,
        slug: docSlug,
        category: slugify(cat.name),
        imagePath: `/assets/previews/${docSlug}-1.png`
      });
    }
  }

  return manifest;
}