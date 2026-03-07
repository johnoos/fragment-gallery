// see the following doc for the roles of .eleventy.js, prePreviews.js, and fragments.11tydata.js
// https://docs.google.com/document/d/1Dq5u_j11XlhlM0QjSIrfAKSdZVLAOnnqdbqtUgfgFU0/edit?tab=t.0 

import { pdf } from 'pdf-to-img';
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';

let hasGeneratedPreviews = false;

export default function(eleventyConfig) {
  // 1. Tell Eleventy NOT to watch the previews folder at all
  eleventyConfig.watchIgnores.add("**/src/assets/previews/**");
  
  // 2. Prevent JS data changes from triggering a full rebuild loop
  eleventyConfig.setWatchJavaScriptDependencies(false);

 /* eleventyConfig.on('eleventy.before', async () => {

    if (hasGeneratedPreviews) return;

    const outputDir = path.join(import.meta.dirname, '_site/assets/previews');

    // Create directory if missing
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const pdfRoot = path.join(import.meta.dirname, 'src/assets/pdfs');
    if (!fs.existsSync(pdfRoot)) return;

    const folders = fs.readdirSync(pdfRoot, { withFileTypes: true })
      .filter(e => e.isDirectory() && !e.name.startsWith('.'))
      .map(e => e.name);

    for (const folder of folders) {
      const folderPath = path.join(pdfRoot, folder);
      const files = fs.readdirSync(folderPath).filter(f => f.toLowerCase().endsWith('.pdf'));

      for (const file of files) {
        const slug = file.replace('.pdf', '').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const outputFile = path.join(outputDir, `${slug}-1.jpg`);

        // CRITICAL: Skip if it exists to avoid heavy processing
        if (fs.existsSync(outputFile)) continue;

                      console.log(`[PDF] Converting: ${file}`);
        try {
          await pdfPoppler.convert(path.join(folderPath, file), {
            format: 'jpeg',
            out_dir: outputDir,
            out_prefix: slug,
            page: 1
          });
        } catch (err) {
                      console.error(`[PDF] Error: ${file}`, err);
        }
      }
    }

    hasGeneratedPreviews = true;
                      console.log(">>> [PDF] Previews checked.");

  });

  */

  eleventyConfig.addPassthroughCopy("src/assets");
  return { dir: { input: "src", output: "_site" } };
}