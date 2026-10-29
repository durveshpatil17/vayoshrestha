#!/usr/bin/env node
/**
 * design-lint.mjs — v3.1 Vayoshreshtha design token enforcer
 * Enforces:
 * - Forest Green #1F5F4B theme (NO blue accents)
 * - IBM Plex Sans + Source Serif 4 (font-serif allowed for headings)
 * - No gradients, no monospace, no uppercase/tracking
 * - Font weight max 600
 * - Box-shadow only on popovers, drawers, dialogs, menus, tooltips, toasts
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC = './src';
const errors = [];

// 1. Blue accent colors (strictly banned per Section 11 & intro)
const BANNED_BLUE = [
  /#0070F2/i, /#005FD1/i, /#004EB0/i, /#EBF4FE/i, /#EAF3FE/i,
  /#0064D9/i, /#0078D4/i, /#106EBE/i,
];

// 2. Gradients
const BANNED_GRADIENT = /bg-gradient|linear-gradient|radial-gradient|conic-gradient/;

// 3. Uppercase labels & tracking
const BANNED_UPPERCASE = /\buppercase\b|\btracking-wide(?:r|st)?\b|\btracking-\[/;

// 4. Bold > 600
const BANNED_BOLD = /\bfont-bold\b|\bfont-extrabold\b|\bfont-black\b/;

// 5. Monospace
const BANNED_MONO = /\bfont-mono\b/;

// 6. Box shadow outside popovers, drawers, dialogs, menus, tooltips
const BANNED_SHADOW = /\bshadow(?!-none|-popover|-drawer|-menu|-dialog|-\[var)\b/;

// 7. Zebra stripes
const BANNED_ZEBRA = /\beven:bg-|\bodd:bg-/;

// 8. Purple/violet/indigo
const BANNED_PURPLE = /purple|violet|indigo/i;

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

    // 1. Blue accent colors
    for (const pattern of BANNED_BLUE) {
      if (pattern.test(line)) {
        errors.push(`${file}:${ln} — BANNED blue accent color: ${line.trim()}`);
      }
    }

    // 2. Gradients
    if (BANNED_GRADIENT.test(line)) {
      errors.push(`${file}:${ln} — BANNED gradient: ${line.trim()}`);
    }

    // 3. Monospace
    if (BANNED_MONO.test(line)) {
      errors.push(`${file}:${ln} — BANNED font-mono: ${line.trim()}`);
    }

    // 4. Uppercase
    if (BANNED_UPPERCASE.test(line)) {
      errors.push(`${file}:${ln} — BANNED uppercase/tracking class: ${line.trim()}`);
    }

    // 5. Font weight > 600
    if (BANNED_BOLD.test(line)) {
      errors.push(`${file}:${ln} — BANNED font weight > 600: ${line.trim()}`);
    }

    // 6. Box shadow outside popover/drawer
    if (BANNED_SHADOW.test(line) && !file.includes('Popover') && !file.includes('Drawer')) {
      errors.push(`${file}:${ln} — BANNED box shadow outside popover/drawer: ${line.trim()}`);
    }

    // 7. Zebra stripes
    if (BANNED_ZEBRA.test(line)) {
      errors.push(`${file}:${ln} — BANNED zebra-stripe: ${line.trim()}`);
    }

    // 8. Purple/violet/indigo
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
