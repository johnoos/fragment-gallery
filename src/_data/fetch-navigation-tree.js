import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// --- INITIALIZATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import sorting configuration
import contentConfig from './contentConfig.json' with { type: 'json' };
const CATEGORY_ORDER = contentConfig.categories || [];

const PATHS = {
  pdfSource: path.resolve(__dirname, '../assets/pdfs')
};

// --- DATA TRANSFORMERS (Low Coupling) ---

/** Standardises strings for URLs and IDs */
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '-');

/** Converts filenames to clean, readable display titles */
const formatTitle = (filename) => {
  return filename
    .replace('.pdf', '')           // Remove extension
    .replace(/^(cert|doc)-/i, '')  // Remove utility prefixes (optional)
    .replace(/-/g, ' ');           // Replace hyphens with spaces
};

/** Maps a single PDF file to our standard Document Object */
const mapPdfToDoc = (filename, categoryName) => {
  const slug = slugify(filename.replace('.pdf', ''));
  
  return {
    docname: filename,
    title: formatTitle(filename),
    url: `/assets/pdfs/${categoryName}/${filename}`,
    slug: slug,
    previewUrl: `/assets/previews/${slug}-1.png` // Points to the generated PNG
  };
};

// --- MAIN DATA GENERATOR ---

export default () => {
  console.log("🔍 Mapping PDF Data Cascade...");

  if (!fs.existsSync(PATHS.pdfSource)) {
    console.error("❌ PDF Source not found:", PATHS.pdfSource);
    return [];
  }

  // 1. Scan for Category Folders
  const categoryFolders = fs.readdirSync(PATHS.pdfSource, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'));

  // 2. Build the Category Objects
  const categories = categoryFolders.map(folder => {
    const categoryName = folder.name;
    const catPath = path.join(PATHS.pdfSource, categoryName);

    // Get all PDFs in this category
    const pdfFiles = fs.readdirSync(catPath)
      .filter(file => file.toLowerCase().endsWith('.pdf'));

    return {
      category: categoryName,
      slug: slugify(categoryName),
      pdfs: pdfFiles.map(file => mapPdfToDoc(file, categoryName))
    };
  });

  // 3. Filter and Sort the Results
  return categories
    .filter(cat => cat.pdfs.length > 0) // Only show folders with content
    .sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a.category.toLowerCase());
      const indexB = CATEGORY_ORDER.indexOf(b.category.toLowerCase());

      // Priority sort based on JSON config
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // Fallback: Alphabetical
      return a.category.localeCompare(b.category);
    });
};