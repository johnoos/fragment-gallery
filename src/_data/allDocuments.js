// src/_data/allDocuments.js

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default function() {
  // 1. Resolve path to the renamed file in the same directory
  // If on older Node < 20.11, use new URL('allDocuments.data', import.meta.url)
  const filePath = resolve(import.meta.dirname, 'menuItemsWithDocuments.json');

  // 2. Read the file as a UTF-8 string
  const rawContent = readFileSync(filePath, 'utf8');

  // 3. Parse and return the data
  const data = JSON.parse(rawContent);
  
  const flatList = [];
  let url = ``;

  data.forEach(item => {
    // 1. Handle items that are a direct single PDF
    if (item.menuItemType === "single") {
      url = `/assets/pdfs/${item.docSlug}.pdf`;
      flatList.push({
        docTitle: item.menuItemTitle,
        docSlug: item.menuItemSlug,
        docUrl: url,
        categoryTitle: item.menuItemTitle,
        categorySlug: item.docSlug
      });
    } 
    // 2. Handle items that are a grid (contain a documents array)
    else if (item.documents && Array.isArray(item.documents)) {
      item.documents.forEach(doc => {
        url = `/assets/pdfs/${doc.docSlug}.pdf`;
        flatList.push({
          ...doc,
          docUrl: url, 
          categoryTitle: doc.docTitle,
          categorySlug: doc.docSlug
        });
      });
    }
  });
  // console.log("FlatList contents:", flatList);  // debug point
  return flatList;
};