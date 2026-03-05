import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Import your configuration
import contentConfig from './contentConfig.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ORDER = contentConfig.categoryOrder || [];

export default () => {
  const baseDir = path.resolve(__dirname, '../assets/pdfs');
  if (!fs.existsSync(baseDir)) return [];

  const categories = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      const category = dirent.name;
      // ... (your existing PDF mapping logic here) ...
      return { category, pdfs: [] }; // Simplified for example
    });

  // SORTING using the JSON file
  return categories.sort((a, b) => {
    let indexA = ORDER.indexOf(a.category.toLowerCase());
    let indexB = ORDER.indexOf(b.category.toLowerCase());

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.category.localeCompare(b.category);
  });
};

/* Visualising the returned array using json

[
  {
    "category": "certificates",
    "pdfs": [
      {
        "filename": "PhD-Music-(2025).pdf",
        "title": "PhD Music (2025)",
        "url": "/assets/pdfs/certificates/PhD-Music-(2025).pdf",
        "previewUrl": "/assets/previews/phd-music--2025--1.jpg",
        "slug": "phd-music--2025-",
        "category": "certificates"
      }
    ]
  },
  {
    "category": "transcripts",
    "pdfs": [ ... more objects ... ]
  }
]

Explanation  of code (old version but possibly still useful):
Breakdown of the Logic:

baseDir Setup: It finds the root folder (src/assets/pdfs). If that folder doesn't exist, it returns an empty array [] so the build doesn't crash.

readdirSync (Categories): It looks at every item in that root folder. The .filter(dirent => dirent.isDirectory()) ensures it only looks at folders (the categories) and ignores loose files.

The .map (Processing Categories): For every folder found (like "CV" or "transcripts"):
- It enters that folder (catPath).
- It looks for files ending in .pdf.

The Nested .map (Processing Files): For every PDF found, it creates an object with:
slug: A "URL-friendly" version of the name (lowercase, no spaces).
title: The filename with .pdf removed and hyphens turned into spaces (e.g., My-CV becomes My CV).
previewUrl: The path where your pdf-poppler script will save the JPG.

Final .filter: This removes any category folders that happen to be empty. If you have a folder called drafts with no PDFs in it, it won't show up in your navigation.

Why is this better than JSON?
If you add a new folder src/assets/pdfs/awards/ and drop 5 PDFs in it, this code automatically detects them. You never have to manually edit a JSON file again.

*/