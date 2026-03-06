import { pdf } from 'pdf-to-img';
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pdfRoot = path.resolve(__dirname, '../src/assets/pdfs');
const outputDir = path.resolve(__dirname, '../_site/assets/previews');

async function run() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const folders = fs.readdirSync(pdfRoot, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.'));

  for (const folder of folders) {
    const folderPath = path.join(pdfRoot, folder.name);
    const files = fs.readdirSync(folderPath).filter(f => f.toLowerCase().endsWith('.pdf'));

    for (const file of files) {
      const slug = file.replace('.pdf', '').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const outputFile = path.join(outputDir, `${slug}-1.png`);

      if (fs.existsSync(outputFile)) continue;

      console.log(`[PDF] Processing: ${file}`);
      try {
        const document = await pdf(path.join(folderPath, file), { scale: 1.5 });
        const page = await document.getPage(1);
        const meta = await sharp(page).metadata();

        await sharp({
          create: {
            width: meta.width,
            height: meta.height,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          }
        })
        .composite([{ input: page }])
        .png()
        .toFile(outputFile);

        console.log(`✅ Success: ${file}`);
      } catch (err) {
        console.error(`❌ Failed: ${file}`, err);
      }
    }
  }
}

run();