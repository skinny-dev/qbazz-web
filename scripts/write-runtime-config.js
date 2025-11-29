import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Read API_BASE from env (preferred) or fall back to VITE_API_BASE
const apiBase = process.env.API_BASE || process.env.VITE_API_BASE || 'https://api.qbazz.com';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '..', 'public', 'runtime-config.js');
const content = `<script>window.__QBAZZ_API_BASE__='${apiBase}';</script>`;

try {
  fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  console.log(`[runtime-config] Wrote runtime-config.js -> ${filePath} (API_BASE=${apiBase})`);
} catch (err) {
  console.error('[runtime-config] Failed to write runtime-config.js', err);
  process.exit(1);
}
