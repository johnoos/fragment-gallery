import path from "path";
import fs from "fs";
import { Poppler } from "node-poppler";

// Leave empty; it will now find 'pdftocairo' in your system PATH
const poppler = new Poppler(); 

export default async function() {
  const pdfDir = "./src/assets/pdfs/";
  const outputDir = "./src/assets/images/previews/";

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(pdfDir).filter(f => f.endsWith(".pdf"));
  let pdfData = [];

  console.log(`[PDF] Found ${files.length} files. Processing...`);

  for (const file of files) {
    const name = path.parse(file).name;
    const expectedImage = `${name}-1.png`;
    const outputPath = path.join(outputDir, name);

    if (!fs.existsSync(path.join(outputDir, expectedImage))) {
        const options = {
            firstPageToConvert: 1,
            lastPageToConvert: 1,
            pngFile: true,
            scalePageTo: 1024 // Changed from scaleTo
        };

        try {
            // This will now use the working system binary
            await poppler.pdfToCairo(path.join(pdfDir, file), outputPath, options);
            console.log(`[PDF] Created preview for: ${file}`);
        } catch (err) {
            console.error(`[PDF] Failed to convert ${file}:`, err);
        }
    }

    pdfData.push({
        filename: name,
        imagePath: `/assets/images/previews/${expectedImage}`
    });
  }

  console.log("[PDF] All previews ready.");
  return pdfData;
};