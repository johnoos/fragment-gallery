const path = require("path");
const pdf = require("pdf-poppler");
const fs = require("fs");

module.exports = async function() {
  const pdfDir = "./src/assets/pdfs/";
  const outputDir = "./src/assets/images/previews/";
  const files = fs.readdirSync(pdfDir).filter(f => f.endsWith(".pdf"));

  // This is the array that will be "globally available"
  let pdfData = [];

  for (const file of files) {
    const name = path.parse(file).name;
    const options = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: name,
        page: 1,
        // Add these for high resolution
        scale: 1024      // Option A: Scales the long side to 1024px  - better for web performance
        // OR
        // resolution: 300   // Option B: Sets fixed 300 DPI for crisp text
    };
    
    const expectedImage = `${name}.png`;
    
    if (!fs.existsSync(path.join(outputDir, expectedImage))) {
      await pdf.convert(path.join(pdfDir, file), options);
    }

    // Add this file's info to our array
    pdfData.push({
      
      filename: name,
      imagePath: `/assets/images/previews/${expectedImage}`
    });
  }

  return pdfData; // This makes 'previewPDFs' an array in Nunjucks
};