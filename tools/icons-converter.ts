import fs from 'node:fs';
import path from 'node:path';

// Directories
const INPUT_ICONS_DIR: string = 'tools/icons';
const OUTPUT_ICONS_DIR: string = 'src/app/icons';
const ICON_SIZE: number = 48;
const ICON_VIEWBOX_REGEXP: RegExp =
  /viewBox *= *["'](?<minX>\d+(?:\.\d+)?) +(?<minY>\d+(?:\.\d+)?) +(?<width>\d+(?:\.\d+)?) +(?<height>\d+(?:\.\d+)?)["']/i;
const ICON_WIDTH_REGEXP: RegExp = /width *= *["'](?<width>\d+(?:\.\d+)?)["']/i;
const ICON_HEIGHT_REGEXP: RegExp = /height *= *["'](?<height>\d+(?:\.\d+)?)["']/i;
const ICON_FILL_ATTRIBUTE_REGEXP: RegExp = /fill *= *["'].+?["']/i;
const ICON_STYLE_FILL_ATTRIBUTE_REGEXP: RegExp = /fill *:.+?(?=["'])/i;

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

// Sets the default icon size and color properties
function normalizeIcon(iconCode: string): string {
  let height: number = ICON_SIZE;
  let width: number = ICON_SIZE;

  const viewBoxMatch = iconCode.match(ICON_VIEWBOX_REGEXP);
  if (viewBoxMatch && viewBoxMatch.groups) {
    const viewBoxWidth = Number(viewBoxMatch.groups['width']);
    const viewBoxHeight = Number(viewBoxMatch.groups['height']);

    if (viewBoxWidth !== 0 && viewBoxHeight !== 0)
      if (viewBoxWidth > viewBoxHeight) width = Math.round(width * (viewBoxWidth / viewBoxHeight));
      else if (viewBoxHeight > viewBoxWidth) height = Math.round(height * (viewBoxHeight / viewBoxWidth));

    iconCode = iconCode.replace(/viewBox *= */gi, 'viewBox=');
  } else iconCode = iconCode.replace(/<svg/i, `<svg viewBox="0 0 ${Math.round(width / 2)} ${Math.round(height / 2)}"`);

  iconCode = iconCode.replace(/<!--(?:.|\r?\n)+?-->(?:(?:\r?\n)+)?/g, '');

  iconCode = !/height/i.test(iconCode)
    ? iconCode.replace(/<svg/i, `<svg height="${height}"`)
    : iconCode.replace(/height *= *".+?"/, `height="${height}"`);

  iconCode = !/width/i.test(iconCode)
    ? iconCode.replace(/<svg/i, `<svg width="${width}"`)
    : iconCode.replace(/width *= *".+?"/, `width="${width}"`);

  if (!ICON_FILL_ATTRIBUTE_REGEXP.test(iconCode) && !ICON_STYLE_FILL_ATTRIBUTE_REGEXP.test(iconCode))
    iconCode = iconCode.replace(/<svg/i, '<svg fill="currentColor"');
  else {
    iconCode = iconCode.replace(/fill *= */gi, 'fill=');
    iconCode = iconCode.replace(/fill *: */gi, 'fill:');
  }

  return iconCode;
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
    let iconCode = fs
      .readFileSync(path.join(INPUT_ICONS_DIR, file), 'utf8')
      .replace(/<\?xml.+?>/, '')
      .trim();

    iconCode = normalizeIcon(iconCode);

    // Getting width
    let width: number = ICON_SIZE;
    const widthMatch = iconCode.match(ICON_WIDTH_REGEXP);
    if (widthMatch && widthMatch.groups) width = Number(widthMatch.groups['width']);
    iconCode = iconCode.replace(ICON_WIDTH_REGEXP, 'width="100%"');

    // Getting height
    let height: number = ICON_SIZE;
    const heightMatch = iconCode.match(ICON_HEIGHT_REGEXP);
    if (heightMatch && heightMatch.groups) height = Number(heightMatch.groups['height']);
    iconCode = iconCode.replace(ICON_HEIGHT_REGEXP, 'height="100%"');

    // Getting viewBox
    // let viewBoxValuesCode: string = '';
    // const viewBoxMatch = iconCode.match(ICON_VIEWBOX_REGEXP);
    // if (viewBoxMatch && viewBoxMatch.groups) {
    //   const viewBoxMinX = Number(viewBoxMatch.groups['minX']);
    //   const viewBoxMinY = Number(viewBoxMatch.groups['minY']);
    //   const viewBoxWidth = Number(viewBoxMatch.groups['width']);
    //   const viewBoxHeight = Number(viewBoxMatch.groups['height']);
    //   viewBoxValuesCode = `viewBoxMinX: ${viewBoxMinX}, viewBoxMinY: ${viewBoxMinY}, viewBoxWidth: ${viewBoxWidth}, viewBoxHeight: ${viewBoxHeight}`;
    // }

    const outputCode: string = `import { type Icon } from '.';\n\nconst icon: Icon = { width: ${width}, height: ${height}, code: ${JSON.stringify(iconCode)} };\n\nexport default icon;\n`;

    fs.writeFileSync(`${OUTPUT_ICONS_DIR}/${icon.file}.ts`, outputCode, 'utf8');
    icons.push(icon);
  });

// Creating index file
let importsCode: string = '';
let iconNameTypeCode: string = 'export type IconName = string;';
const iconTypeCode: string = 'export type Icon = { width: number, height: number, code: string };';
let exportCode: string = 'export const Icons: Record<IconName, Icon> = {};';
if (icons.length) {
  iconNameTypeCode = 'export type IconName =';
  exportCode = 'export const icons: Record<IconName, Icon> = {';
}

icons.forEach((icon, index) => {
  const isFirst: boolean = index === 0;
  const isLast: boolean = index + 1 === icons.length;
  importsCode += `import ${icon.name.toUpperCase()}_ICON from './${icon.file}';\n`;

  iconNameTypeCode += (isFirst ? ' ' : index % 6 !== 0 ? ' | ' : '\n | ') + `'${icon.name}'` + (!isLast ? '' : ';');
  exportCode += `\n  '${icon.name}': ${icon.name.toUpperCase()}_ICON,`;
});

if (icons.length) exportCode += '\n};';

fs.writeFileSync(
  `${OUTPUT_ICONS_DIR}/index.ts`,
  (importsCode + '\n' + iconTypeCode + '\n\n' + iconNameTypeCode + '\n\n' + exportCode).trim() + '\n',
);

console.log(icons.length, 'íconos registrados ✅');
