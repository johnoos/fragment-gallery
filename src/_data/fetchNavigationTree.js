// builds the hierarchical "Tree" used for the sidebar and galleries

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PATHS = { pdfSource: path.resolve(__dirname, '../assets/pdfs') };

/** 
 * THE MASTER CLEANER: Use this for both Folders and PDFs 
 * Preserves PhD, ATCL, etc.
 */
const getCleanedTitle = (str) => {
  if (!str) return "";
  return str.replace('.pdf', '')
    .replace(/^\d+[-_]*/, "")    // Remove 01-
    .replace(/[-_]+/g, " ")      // Hyphens to spaces
    .trim()
    .split(" ")
    .map(word => {
      if (/^phd$/i.test(word)) return "PhD"; 
      if (/[A-Z]{2,}/.test(word) || /\d/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(" ");
};

const getSlug = (str) => str.toLowerCase().replace('.pdf', '').replace(/^\d+[-_]*/, "").replace(/[^a-z0-9]/g, '-');

// --- THE DATA GENERATOR ---

export default () => {
  if (!fs.existsSync(PATHS.pdfSource)) return [];

  return fs.readdirSync(PATHS.pdfSource, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(folder => {
      // 1. FOLDERIDENTIFIER
      const folderNameOnDisk = folder.name;
      const catPath = path.join(PATHS.pdfSource, folderNameOnDisk);

      const pdfFiles = fs.readdirSync(catPath)
        .filter(file => file.toLowerCase().endsWith('.pdf'))
        .map(filename => {
          // 2. PDFIDENTIFIER
          const pdfNameOnDisk = filename;
          const baseNoExt = filename.replace('.pdf', '');

          return {
            nameOnDisk: pdfNameOnDisk,
            cleanedTitle: getCleanedTitle(baseNoExt),
            slug: getSlug(baseNoExt),
            // Asset paths use lowercase disk name for 404 safety
            url: `/assets/pdfs/${folderNameOnDisk}/${pdfNameOnDisk}`,
            previewUrl: `/assets/previews/${baseNoExt.toLowerCase()}-1.png`
          };
        });

      return {
        nameOnDisk: folderNameOnDisk,
        cleanedTitle: getCleanedTitle(folderNameOnDisk),
        slug: getSlug(folderNameOnDisk),
        pdfs: pdfFiles
      };
    })
    .filter(cat => cat.pdfs.length > 0)
    .sort((a, b) => {
      const getOrder = (n) => {
        const match = n.match(/^(\d+)-/);
        return match ? parseInt(match[1], 10) : 999;
      };
      return getOrder(a.nameOnDisk) - getOrder(b.nameOnDisk);
    });
};