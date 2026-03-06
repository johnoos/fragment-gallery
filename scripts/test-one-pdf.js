import { pdf } from 'pdf-to-img';
import sharp from 'sharp';

async function test() {
  const pdfPath = './src/assets/pdfs/examiner-reports/doc-antoni.pdf';
  const outputPath = './test-output.png';

  try {
    console.log(`Converting: ${pdfPath}`);
    
    // 1. Convert PDF with a specific scale (2 = 144 DPI, good for web)
    const document = await pdf(pdfPath, { scale: 2 });
    const page = await document.getPage(1);

    // 2. Get the metadata (width/height) of the rendered PDF page
    const metadata = await sharp(page).metadata();

    // 3. Create a white background of the EXACT same size
    await sharp({
      create: {
        width: metadata.width,
        height: metadata.height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([{ input: page }]) // Paste the PDF on top
    .png()
    .toFile(outputPath);

    console.log(`✅ Success! Perfectly sized image saved to: ${outputPath}`);
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

test();