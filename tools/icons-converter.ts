import fs from 'node:fs';
import path from 'node:path';

// Directories
const INPUT_ICONS_DIR: string = 'tools/icons';
const OUTPUT_ICONS_DIR: string = 'src/app/icons';

// Icon output type
interface IconOutput {
  file: string;
  name: string;
}

// Parses the file name to a system file name
function getIconOutput(fileName: string): IconOutput {
  const systemFileName: string = fileName
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/\.svg$/i, '');
  return { file: systemFileName + '.icon', name: systemFileName.replace(/-/g, '_').toLowerCase() };
}

// Deleting current files
fs.readdirSync(OUTPUT_ICONS_DIR).forEach(file => {
  if (file.endsWith('.icon.ts') || file === 'index.ts') fs.unlinkSync(path.join(OUTPUT_ICONS_DIR, file));
});

// Creating new icon files
const icons: IconOutput[] = [];

fs.readdirSync(INPUT_ICONS_DIR)
  .sort()
  .forEach(file => {
    if (!file.toLowerCase().endsWith('.svg')) return;

    const icon: IconOutput = getIconOutput(file);
    const iconCode = fs.readFileSync(path.join(INPUT_ICONS_DIR, file), 'utf8');

    fs.writeFileSync(`${OUTPUT_ICONS_DIR}/${icon.file}.ts`, `export default ${JSON.stringify(iconCode)};\n`, 'utf8');
    icons.push(icon);
  });

// Creating index file
let importsCode: string = '';
let typeCode: string = 'export type IconName = string;';
let exportCode: string = 'export const Icons: Record<IconName, string> = {};';
if (icons.length) {
  typeCode = 'export type IconName =';
  exportCode = 'export const Icons: Record<IconName, string> = {';
}

icons.forEach((icon, index) => {
  const isFirst: boolean = index === 0;
  const isLast: boolean = index + 1 === icons.length;
  importsCode += `import ${icon.name.toUpperCase()}_ICON_CODE from './${icon.file}';\n`;

  typeCode += (isFirst ? ' ' : index % 6 !== 0 ? ' | ' : '\n | ') + `'${icon.name}'` + (!isLast ? '' : ';');
  exportCode += `\n  '${icon.name}': ${icon.name.toUpperCase()}_ICON_CODE,`;
});

if (icons.length) exportCode += '\n};';

fs.writeFileSync(`${OUTPUT_ICONS_DIR}/index.ts`, (importsCode + '\n' + typeCode + '\n\n' + exportCode).trim() + '\n');

console.log(icons.length, 'íconos registrados ✅');
