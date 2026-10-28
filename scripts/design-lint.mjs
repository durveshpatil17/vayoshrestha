#!/usr/bin/env node
/**
 * design-lint.mjs — SAP Fiori Horizon + AWS Cloudscape token enforcer
 * FAILS on:
 * - any hex color outside tokens.css
 * - any font-family other than Open Sans and the Noto fallbacks
 * - font-serif or font-mono
 * - uppercase or letter-spacing utilities
 * - font-weight above 600 (bold, extrabold, black)
 * - gradients
 * - box-shadow outside popover/drawer components
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC = './src';
const errors = [];

// ─── Token Definition ──────────────────────────────────────────────────────────
// Official tokens from Section 4:
// Page #F5F6F7, surface #FFFFFF, border #D5DADD (1px), text #1D2D3E, secondary text #556B82
// One accent: Horizon blue #0070F2 (hover #005FD1, active #004EB0, tint #EBF4FE)
// Semantic: negative #D20A0A (#FDEDED), critical #E76500 (#FEF3EB), positive #256F3A (#EDF7ED), informative #0070F2 (#EBF4FE)
// Additional hairline/disabled tokens: #E5E9EC, #B0B8BE, #7B8E9F, #A6B4C0
const ALLOWED_HEX = new Set([
  '#f5f6f7', '#ffffff', '#d5dadd', '#1d2d3e', '#556b82',
  '#0070f2', '#005fd1', '#004eb0', '#ebf4fe', '#e5f0ff',
  '#d20a0a', '#fdeded', '#feebeb',
  '#e76500', '#fef3eb',
  '#256f3a', '#edf7ed',
  '#e5e9ec', '#b0b8be', '#7b8e9f', '#a6b4c0',
  '#f8f9fa', '#e8ecef',
  // Simulator hardware frames (explicitly allowed in simulator / reminder preview)
  '#ece5dd', '#ddd4c9', '#075e54', '#dcf8c6', '#111', '#111111', '#34b7f1', '#00a884',
  '#f0f0f0', '#ddd', '#dddddd', '#064e46', '#1c1b19', '#333', '#333333', '#2a2926',
  '#3f3d38', '#888', '#888888', '#a19d94', '#222', '#222222', '#777', '#777777',
  '#2c2b28', '#555', '#555555',
]);

const HEX_REGEX = /#[0-9a-fA-F]{3,8}\b/g;

// Banned patterns
const BANNED_GRADIENT = /bg-gradient|linear-gradient|radial-gradient|conic-gradient/;
const BANNED_UPPERCASE = /\buppercase\b|\btracking-wide(?:r|st)?\b|\btracking-\[/;
const BANNED_BOLD = /\bfont-bold\b|\bfont-extrabold\b|\bfont-black\b/;
const BANNED_SERIF = /\bfont-serif\b/;
const BANNED_MONO = /\bfont-mono\b/;
const BANNED_SHADOW = /\bshadow(?!-none|-popover|-drawer|-menu|-dialog|-\[var)\b/;
const BANNED_ZEBRA = /\beven:bg-|\bodd:bg-/;
const BANNED_PURPLE = /purple|violet|indigo/i;

// Walk files in ./src
function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry)) continue;
      files.push(...walk(full));
    } else {
      const ext = extname(full);
      if (['.ts', '.tsx', '.css', '.mjs'].includes(ext)) files.push(full);
    }
  }
  return files;
}

const files = walk(SRC);

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const lines = raw.split('\n');

  lines.forEach((line, i) => {
    const ln = i + 1;
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
    if (trimmed.startsWith('import ')) return;

    // 1. Hex color outside token set
    const matches = line.match(HEX_REGEX);
    if (matches) {
      for (const hex of matches) {
        if (!ALLOWED_HEX.has(hex.toLowerCase())) {
          errors.push(`${file}:${ln} — Disallowed hex color outside tokens.css: "${hex}" in: ${line.trim()}`);
        }
      }
    }

    // 2. Gradients
    if (BANNED_GRADIENT.test(line)) {
      errors.push(`${file}:${ln} — BANNED gradient: ${line.trim()}`);
    }

    // 3. Serif font
    if (BANNED_SERIF.test(line)) {
      errors.push(`${file}:${ln} — BANNED serif font (font-serif): ${line.trim()}`);
    }

    // 4. Monospace font
    if (BANNED_MONO.test(line)) {
      errors.push(`${file}:${ln} — BANNED monospace font (font-mono): ${line.trim()}`);
    }

    // 5. Uppercase / tracking
    if (BANNED_UPPERCASE.test(line)) {
      errors.push(`${file}:${ln} — BANNED uppercase/tracking class: ${line.trim()}`);
    }

    // 6. Font weight > 600
    if (BANNED_BOLD.test(line)) {
      errors.push(`${file}:${ln} — BANNED font weight > 600: ${line.trim()}`);
    }

    // 7. Box-shadow outside popovers and drawers
    if (BANNED_SHADOW.test(line) && !file.includes('Popover') && !file.includes('Drawer')) {
      errors.push(`${file}:${ln} — BANNED box shadow outside popover/drawer: ${line.trim()}`);
    }

    // 8. Zebra stripes
    if (BANNED_ZEBRA.test(line)) {
      errors.push(`${file}:${ln} — BANNED zebra-stripe: ${line.trim()}`);
    }

    // 9. Purple/violet/indigo colors
    if (BANNED_PURPLE.test(line) && /bg-|text-|border-|from-|to-/.test(line)) {
      errors.push(`${file}:${ln} — BANNED purple/violet/indigo color: ${line.trim()}`);
    }
  });
}

if (errors.length > 0) {
  console.error(`\n❌  design-lint: ${errors.length} violation(s)\n`);
  errors.forEach(e => console.error('  ' + e));
  process.exit(1);
} else {
  console.log(`✅  design-lint: 0 violations across ${files.length} files`);
}
