const fs = require('fs');
const path = require('path');

const versionFilePath = path.resolve(__dirname, 'src/version.ts');
const newVersion = process.argv[2];

fs.writeFileSync(versionFilePath, `export const VERSION = '${newVersion}';\n`, 'utf8');