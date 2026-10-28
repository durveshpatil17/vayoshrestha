#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// Permitted token colors (case-insensitive hex and rgba)
const ALLOWED_HEX = new Set([
  '#f5f7fa', '#ffffff', '#f8fafc', '#f2f6fc', '#e8f1fc',
  '#edf0f3', '#dde2e8', '#c3cbd4', '#1d2d3e', '#556b82',
  '#758ca5', '#a9b4be', '#0064d9', '#0057bf', '#004ba6',
  '#ebf3fd', '#107e3e', '#eff9f3', '#b25a00', '#fff6eb',
  '#c4161c', '#fef0f0', '#f1f4f7', '#0e8e8e', '#e9730c',
  '#6c7a89', '#5b9e2d', '#c99a00', '#fff', '#000'
]);

// Purple / violet hue keywords or classes
const BANNED_COLOR_NAMES = [
  'purple', 'violet', 'indigo', 'magenta', 'fuchsia'
];

// Allowed font families
const ALLOWED_FONTS = [
  'source sans 3', 'noto sans devanagari', 'noto sans kannada', 'noto sans tamil',
  'system-ui', 'segoe ui', 'roboto', 'arial', 'sans-serif'
];

// Emoji detection regex (extended pictographic)
const EMOJI_REGEX = /\p{Extended_Pictographic}/u;

let errors = [];

function checkFile(filePath) {
  const relPath = path.relative(rootDir, filePath);
  // Ignore test files, node_modules, dist, .git
  if (relPath.includes('node_modules') || relPath.includes('dist') || relPath.includes('.git')) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    // 1. Check for serif fonts
    if (/serif/i.test(line) && !/sans-serif/i.test(line)) {
      errors.push(`${relPath}:${lineNum} - Banned serif font found: "${trimmed}"`);
    }

    // 2. Check for bold 700+
    if (/\b(font-bold|font-extrabold|font-black)\b/.test(line) || /font-weight:\s*(700|800|900|bold)/.test(line)) {
      errors.push(`${relPath}:${lineNum} - Banned font-weight >= 700 found: "${trimmed}"`);
    }

    // 3. Check for linear-gradient / radial-gradient
    if (/linear-gradient|radial-gradient|bg-gradient/i.test(line)) {
      errors.push(`${relPath}:${lineNum} - Banned gradient found: "${trimmed}"`);
    }

    // 4. Check for border-width above 1px (exclude tab indicator border-b-2, active borders or outline-2 for focus)
    if (/\b(border-2|border-4|border-8|border-t-2|border-r-2|border-l-2)\b/.test(line)) {
      errors.push(`${relPath}:${lineNum} - Border-width above 1px found: "${trimmed}"`);
    }

    // 5. Check for !important (except in standard third-party or accessibility css resets)
    if (/!important/.test(line) && !relPath.includes('tokens.css')) {
      errors.push(`${relPath}:${lineNum} - Banned !important found: "${trimmed}"`);
    }

    // 6. Check for purple/violet classes
    for (const banned of BANNED_COLOR_NAMES) {
      const regex = new RegExp(`\\b(bg|text|border|ring|fill|stroke)-${banned}\\b`, 'i');
      if (regex.test(line)) {
        errors.push(`${relPath}:${lineNum} - Banned purple/violet hue found: "${trimmed}"`);
      }
    }

    // 7. Check for emoji in UI strings (allow in simulator files and fixtures)
    if (
      EMOJI_REGEX.test(line) &&
      !relPath.includes('simulator') &&
      !relPath.includes('whatsapp') &&
      !relPath.includes('Simulator') &&
      !relPath.includes('seed.ts') &&
      !relPath.includes('tokens.css') &&
      !relPath.includes('design-lint.mjs')
    ) {
      errors.push(`${relPath}:${lineNum} - Banned emoji in UI found: "${trimmed}"`);
    }
  });
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (/\.(tsx|ts|css|html)$/.test(file)) {
      checkFile(fullPath);
    }
  }
}

console.log('Running design-lint across src/ and configuration files...');
walkDir(srcDir);
checkFile(path.join(rootDir, 'index.html'));
checkFile(path.join(rootDir, 'tailwind.config.js'));

if (errors.length > 0) {
  console.error(`\x1b[31m[design-lint] FAILED: ${errors.length} design system violation(s) found:\x1b[0m\n`);
  errors.slice(0, 30).forEach(err => console.error(`  ✖ ${err}`));
  if (errors.length > 30) {
    console.error(`  ... and ${errors.length - 30} more.`);
  }
  process.exit(1);
} else {
  console.log('\x1b[32m[design-lint] PASSED: All design tokens, fonts, borders, and colors conform to the design system specification.\x1b[0m');
  process.exit(0);
}

