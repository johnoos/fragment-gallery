import pdfPoppler from 'pdf-poppler';
import path from 'node:path';
import fs from 'node:fs';

export default function(eleventyConfig) {
  
  // 1. AUTOMATION: Generate previews before the build starts
  eleventyConfig.on('eleventy.before', async () => {
    const pdfRoot = './src/assets/pdfs';
    const outputDir = './src/assets/previews';

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const categories = fs.readdirSync(pdfRoot);
    for (const cat of categories) {
      const catPath = path.join(pdfRoot, cat);
      if (!fs.statSync(catPath).isDirectory()) continue;

      const files = fs.readdirSync(catPath).filter(f => f.endsWith('.pdf'));
      for (const file of files) {
        const filePath = path.join(catPath, file);
        const slug = file.replace('.pdf', '').toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Skip if preview already exists to save build time
        if (fs.existsSync(path.join(outputDir, `${slug}-1.jpg`))) continue;

        let opts = {
          format: 'jpeg',
          out_dir: outputDir,
          out_prefix: slug,
          page: 1
        };

        try {
          console.log(`Generating preview for: ${file}`);
          await pdfPoppler.convert(filePath, opts);
        } catch (err) {
          console.error(`Failed to convert ${file}:`, err);
        }
      }
    }
  });

  // 2. YOUR EXISTING PASSTHROUGHS
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css");

  // 3. YOUR EXISTING CONFIG
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};