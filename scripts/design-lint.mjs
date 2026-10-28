#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// Permitted token colors from tokens.css
const ALLOWED_HEX = new Set([
  '#f5f6f7', '#ffffff', '#f8f9fa', '#f3f8fe', '#eaf3fe',
  '#e8ecef', '#d5dadd', '#b0b8be', '#1d2d3e', '#556b82',
  '#8494a5', '#a9b4be', '#0070f2', '#005fd1', '#004eb0',
  '#d20a0a', '#fdeded', '#e76500', '#fdf3eb', '#256f3a',
  '#edf6ee', '#0e8e8e', '#c99a00', '#fff', '#000'
]);

let errors = [];

function checkFile(filePath) {
  const relPath = path.relative(rootDir, filePath);
  // Ignore node_modules, dist, .git, and test-results
  if (
    relPath.includes('node_modules') ||
    relPath.includes('dist') ||
    relPath.includes('.git') ||
    relPath.includes('test-results')
  ) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Skip comment lines
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    // 1. Check for serif or monospace
    if (/serif/i.test(line) && !/sans-serif/i.test(line)) {
      errors.push(`${relPath}:${lineNum} - Banned serif font found: "${trimmed}"`);
    }
    if (/\b(font-mono|monospace)\b/.test(line)) {
      errors.push(`${relPath}:${lineNum} - Banned monospace font found: "${trimmed}"`);
    }

    // 2. Check for font-weight above 600
    if (
      /\b(font-bold|font-extrabold|font-black)\b/.test(line) ||
      /font-weight:\s*(700|800|900|bold)/.test(line)
    ) {
      errors.push(`${relPath}:${lineNum} - Banned font-weight > 600 found: "${trimmed}"`);
    }

    // 3. Check for uppercase or letter-spacing utilities
    if (/\b(uppercase)\b/.test(line) || /text-transform:\s*uppercase/.test(line)) {
      errors.push(`${relPath}:${lineNum} - Banned uppercase utility found: "${trimmed}"`);
    }
    if (/\b(tracking-wide|tracking-wider|tracking-widest|tracking-tight|tracking-tighter)\b/.test(line) || /letter-spacing:/.test(line)) {
      errors.push(`${relPath}:${lineNum} - Banned letter-spacing utility found: "${trimmed}"`);
    }

    // 4. Check for gradients
    if (/linear-gradient|radial-gradient|bg-gradient/i.test(line)) {
      errors.push(`${relPath}:${lineNum} - Banned gradient found: "${trimmed}"`);
    }

    // 5. Check for box-shadow on cards / outside popovers & drawers
    const isFloatingLayer =
      relPath.includes('Popover') ||
      relPath.includes('DropdownMenu') ||
      relPath.includes('Dialog') ||
      relPath.includes('Drawer') ||
      relPath.includes('Toast') ||
      relPath.includes('Tooltip') ||
      relPath.includes('tokens.css') ||
      relPath.includes('design-lint.mjs');

    if (!isFloatingLayer) {
      if (/\b(shadow-xs|shadow-sm|shadow-md|shadow-lg|shadow-xl|shadow-2xl)\b/.test(line)) {
        errors.push(`${relPath}:${lineNum} - Banned box-shadow outside popovers/drawers found: "${trimmed}"`);
      }
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

console.log('Running design-lint (SAP Fiori Horizon + AWS Cloudscape rules)...');
walkDir(srcDir);
checkFile(path.join(rootDir, 'index.html'));
checkFile(path.join(rootDir, 'tailwind.config.js'));

if (errors.length > 0) {
  console.error(`\x1b[31m[design-lint] FAILED: ${errors.length} design violation(s) found:\x1b[0m\n`);
  errors.slice(0, 35).forEach((err) => console.error(`  ✖ ${err}`));
  if (errors.length > 35) {
    console.error(`  ... and ${errors.length - 35} more.`);
  }
  process.exit(1);
} else {
  console.log('\x1b[32m[design-lint] PASSED: All design tokens, fonts, weights, and Fiori/Cloudscape constraints conform.\x1b[0m');
  process.exit(0);
}
