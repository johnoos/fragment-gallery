import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import contentConfig from './contentConfig.json' with { type: 'json' };
const ORDER = contentConfig.categories || [];

// the following fields appear in the export default () function below:
// categories is 
// __filename
// __dirname is 
// basedir is
// dirent is a directory entry (PDF file) in  
// categoryName
// slug
// catPath
// pdfs
// the following methods appear in the export default () function below:

// aString.localeCompare(aString)

export default () => {
  const basedir = path.resolve(__dirname, '../assets/pdfs');
                    console.log("__filename -> " + __filename);
                    console.log("__dirname -> " + __dirname);
                    console.log('baseDir -> ' + basedir);

  if (!fs.existsSync(basedir)) return [];

  // This entire block is one single assignment to 'categories'
  const categories = fs.readdirSync(basedir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      const pdfSlug = file.replace('.pdf', '').toLowerCase().replace(/[^a-z0-9]/g, '-');

      return {
        docname: file,
        title: file.replace('.pdf', '').replace(/-/g, ' '),
        url: `/assets/pdfs/${categoryName}/${file}`,
        slug: pdfSlug,
        // Update the extension here so Nunjucks sees .png
        previewUrl: `/assets/previews/${pdfSlug}-1.png` 
      };
    });

                      console.log('categories -> ' + categories);

  // Now 'categories' is defined and safe to sort
  return categories.sort((a, b) => {
    let indexA = ORDER.indexOf(a.category.toLowerCase());
    let indexB = ORDER.indexOf(b.category.toLowerCase());

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
                      console.log('returned by menuItemsWithDocs.js -> ' + a.category.localeCompare(b.category));
    return a.category.localeCompare(b.category);
  });
};