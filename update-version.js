import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const versionFilePath = path.resolve(__dirname, 'src/version.ts');
const newVersion = process.argv[2];

fs.writeFileSync(versionFilePath, `export const VERSION = '${newVersion}';\n`, 'utf8');