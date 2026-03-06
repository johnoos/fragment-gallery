// see the following doc for the roles of .eleventy.js, prePreviews.js, and fragments.11tydata.js
// https://docs.google.com/document/d/1Dq5u_j11XlhlM0QjSIrfAKSdZVLAOnnqdbqtUgfgFU0/edit?tab=t.0 

// firstpages - 


import path from "path";
import fs from "fs";
import { Poppler } from "node-poppler";

// Leave empty; it will now find 'pdftocairo' in your system PATH
const poppler = new Poppler(); 

export default async function() {
  const pdfdir = "./src/assets/pdfs/";
  const outputdir = "./src/assets/previews/";

  if (!fs.existsSync(outputdir)) {
    fs.mkdirSync(outputdir, { recursive: true });
  }

  const files = fs.readdirSync(pdfdir).filter(f => f.endsWith(".pdf"));
  let firstpages = [];

                                        console.log(`[PDF] Found ${files.length} files. Processing...`);

  for (const file of files) {
    const name = path.parse(file).name;
    const expectedimage = `${name}-1.png`;
    const outputpath = path.join(outputdir, name);

    if (!fs.existsSync(path.join(outputdir, expectedimage))) {
        const options = {
            firstPageToConvert: 1,
            lastPageToConvert: 1,
            pngFile: true,
            scalePageTo: 1024 // Changed from scaleTo
        };

        try {
            // This will now use the working system binary
            await poppler.pdfToCairo(path.join(pdfdir, file), outputpath, options);
                                        console.log(`[PDF] Created preview for: ${file}`);
        } catch (err) {
                                        console.error(`[PDF] Failed to convert ${file}:`, err);
        }
    }

    firstpages.push({
        filename: name,
        imagepath: `/assets/previews/${expectedimage}`
    });
  }

                                        console.log("[PDF] All previews ready.");
                                        console.log()
  return firstpages;
};