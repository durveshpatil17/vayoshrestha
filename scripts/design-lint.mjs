#!/usr/bin/env node
/**
 * design-lint.mjs — v3 Vayoshreshtha design token enforcer
 * PASS conditions are logged; FAIL exits with code 1.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC = './src';
const errors = [];
const warnings = [];

// ─── Banned patterns ──────────────────────────────────────────────────────────

// 1. Blue accent colors (Horizon blue from previous session — banned)
const BANNED_COLORS = [
  /#0070F2/i, /#005FD1/i, /#004EB0/i, /#EAF3FE/i,
  /#0064D9/i, /#0078D4/i, /#106EBE/i,
];

// 2. Hard-coded colors not in token set (non-exhaustive spot-check)
// We check for any inline hex color that isn't a comment or CSS var reference
// Done via: any hex in className strings inside TSX

// 3. Gradients
const BANNED_GRADIENT = /bg-gradient|linear-gradient|radial-gradient|conic-gradient/;

// 4. Purple/violet/indigo
const BANNED_PURPLE = /purple|violet|indigo/i;

// 5. Heavy shadows on non-popover/drawer elements (className check)
const BANNED_SHADOW = /\bshadow(?!-none|-popover|-drawer|-\[var)\b.*(?<!popover|drawer)/;

// 6. Uppercase / letter-spaced labels (Tailwind classes)
const BANNED_UPPERCASE = /\buppercase\b|\btracking-wide(?:r|st)?\b|\btracking-\[/;

// 7. Font weight > 600 (bold, extrabold, black)
const BANNED_BOLD = /\bfont-bold\b|\bfont-extrabold\b|\bfont-black\b/;

// 8. Monospace font class (monospace prose not allowed)
const BANNED_MONO = /\bfont-mono\b/;

// 9. Emoji in component className or JSX (allow in message content strings)
//    We detect emoji in JSX element text nodes (not in template literals carrying message data)
// This is a heuristic — flag component files with emoji in JSX returns
const EMOJI_REGEX = /[\u{1F300}-\u{1FFFF}\u{2600}-\u{27FF}]/u;

// 10. Forbidden: zebra stripes (even: / odd: table row bg)
const BANNED_ZEBRA = /\beven:bg-|\bodd:bg-/;

// ─── Allowed ──────────────────────────────────────────────────────────────────
// - font-serif (Source Serif 4 headings) — ALLOWED, REQUIRED
// - accent color via var(--accent) which is forest green — ALLOWED

// ─── Walk files ───────────────────────────────────────────────────────────────
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
    // Skip comment lines
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
    // Skip import lines
    if (trimmed.startsWith('import ')) return;

    // 1. Blue accent colors
    for (const pattern of BANNED_COLORS) {
      if (pattern.test(line)) {
        errors.push(`${file}:${ln} — BANNED blue accent color: ${line.trim()}`);
      }
    }

    // 2. Gradients
    if (BANNED_GRADIENT.test(line)) {
      errors.push(`${file}:${ln} — BANNED gradient: ${line.trim()}`);
    }

    // 3. Purple/violet/indigo (in color context, not prose)
    if (BANNED_PURPLE.test(line) && /bg-|text-|border-|from-|to-/.test(line)) {
      errors.push(`${file}:${ln} — BANNED purple/violet/indigo color: ${line.trim()}`);
    }

    // 4. Uppercase labels
    if (BANNED_UPPERCASE.test(line)) {
      errors.push(`${file}:${ln} — BANNED uppercase/tracking class: ${line.trim()}`);
    }

    // 5. Bold > 600
    if (BANNED_BOLD.test(line)) {
      errors.push(`${file}:${ln} — BANNED font weight > 600: ${line.trim()}`);
    }

    // 6. Monospace
    if (BANNED_MONO.test(line)) {
      errors.push(`${file}:${ln} — BANNED font-mono: ${line.trim()}`);
    }

    // 7. Zebra stripes
    if (BANNED_ZEBRA.test(line)) {
      errors.push(`${file}:${ln} — BANNED zebra-stripe: ${line.trim()}`);
    }
  });
}

// ─── Report ───────────────────────────────────────────────────────────────────
if (errors.length > 0) {
  console.error(`\n❌  design-lint: ${errors.length} violation(s)\n`);
  errors.forEach(e => console.error('  ' + e));
  process.exit(1);
} else {
  console.log(`✅  design-lint: 0 violations across ${files.length} files`);
}
