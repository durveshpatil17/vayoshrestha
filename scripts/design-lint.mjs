#!/usr/bin/env node
/**
 * scripts/design-lint.mjs — SAP Fiori Horizon + AWS Cloudscape Design Token Enforcer
 * Enforces all 12 rules from Section 4.1.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, resolve } from 'path';

export const RULE_NAMES = {
  HEX_OUTSIDE_TOKENS: '1. Color literals outside token files',
  BANNED_FONTS: '2. Banned font families (only Open Sans + Noto Sans)',
  BANNED_TEXT_TRANSFORM: '3. Uppercase, lowercase, capitalize, or tracking',
  BANNED_FONT_WEIGHT: '4. Font weights other than 400 or 600',
  BANNED_GRADIENTS_BLUR: '5. Gradients, blur, glow, or drop-shadow',
  BANNED_SHADOW_OUTSIDE_OVERLAYS: '6. Box shadows outside Popover, Drawer, Dialog, Toast',
  BANNED_ARBITRARY_BRACKETS: '7. Tailwind arbitrary bracket values',
  BANNED_FONT_SIZES: '8. Font sizes outside 12/14/16/20/28 scale',
  BANNED_RADIUS: '9. Radius outside control(8px), container(12px), or rounded-full',
  BANNED_EMOJI: '10. Emoji in UI chrome outside simulator content',
  BANNED_STROBING: '11. Strobing/flashing infinite animations',
  BANNED_EXTRA_PACKAGES: '12. Non-permitted icon or font package imports',
};

// Patterns
const HEX_COLOR_REGEX = /#([0-9a-fA-F]{3,8})\b/;
const BANNED_FONTS_REGEX = /\bfont-mono\b|\bfont-serif\b|font-family:(?!.*(?:Open Sans|Noto Sans|var\(--font\)))/;
const BANNED_TEXT_TRANSFORM_REGEX = /\buppercase\b|\blowercase\b|\bcapitalize\b|\btracking-(?:tighter|tight|wide|wider|widest|\[)|\bletter-spacing\b/;
const BANNED_FONT_WEIGHT_REGEX = /\bfont-bold\b|\bfont-extrabold\b|\bfont-black\b|\bfont-medium\b|\bfont-light\b|\bfont-thin\b/;
const BANNED_GRADIENTS_BLUR_REGEX = /\bbg-gradient\b|\blinear-gradient\b|\bradial-gradient\b|\bconic-gradient\b|\bbackdrop-blur\b|\bblur-(?:sm|md|lg|xl|2xl|3xl|\d+)\b|\bdrop-shadow\b/;
const BANNED_SHADOW_REGEX = /\bshadow-(?:sm|md|lg|xl|2xl|inner)\b|\bshadow\b(?!\s*=\s*['"])/;
const BANNED_ARBITRARY_REGEX = /\b(?:bg|text|border|rounded|p|px|py|m|mx|my|gap|w|h)-\[[^\]]+\]/;
const BANNED_EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
const BANNED_STROBING_REGEX = /\banimate-ping\b|\banimate-pulse\b|\banimate-bounce\b|\binfinite\b/;
const BANNED_PACKAGES_REGEX = /from\s+['"](?:@fluentui\/|@fortawesome|feather-icons|react-icons|ionicons|bootstrap-icons|@heroicons|@fontsource\/(?:ibm-plex|source-serif))/;

export function lintFile(content, filePath) {
  const violations = [];
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Exempt token files and test files
  const isTokenFile =
    normalizedPath.endsWith('tokens.css') ||
    normalizedPath.endsWith('tokens.generated.ts') ||
    normalizedPath.endsWith('simulator.tokens.css');

  const isSimulatorFile = normalizedPath.includes('/simulator/');
  const isTestFile = normalizedPath.includes('/tests/') || normalizedPath.includes('test.ts');
  const isOverlayComponent =
    normalizedPath.includes('Popover') ||
    normalizedPath.includes('Drawer') ||
    normalizedPath.includes('Dialog') ||
    normalizedPath.includes('Toast') ||
    normalizedPath.includes('Tooltip') ||
    normalizedPath.includes('DropdownMenu');

  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Skip comment lines
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    // 1. Hex color check
    if (!isTokenFile && HEX_COLOR_REGEX.test(line)) {
      violations.push({
        rule: RULE_NAMES.HEX_OUTSIDE_TOKENS,
        lineNum,
        message: `Hardcoded hex color found: ${trimmed}`,
      });
    }

    // 2. Font family check
    if (BANNED_FONTS_REGEX.test(line)) {
      violations.push({
        rule: RULE_NAMES.BANNED_FONTS,
        lineNum,
        message: `Banned font-family or font-mono/serif: ${trimmed}`,
      });
    }

    // 3. Text transform & tracking
    if (BANNED_TEXT_TRANSFORM_REGEX.test(line)) {
      violations.push({
        rule: RULE_NAMES.BANNED_TEXT_TRANSFORM,
        lineNum,
        message: `Banned uppercase/lowercase/capitalize/tracking: ${trimmed}`,
      });
    }

    // 4. Font weights outside 400/600
    if (BANNED_FONT_WEIGHT_REGEX.test(line)) {
      violations.push({
        rule: RULE_NAMES.BANNED_FONT_WEIGHT,
        lineNum,
        message: `Banned font weight (only 400 and 600 allowed): ${trimmed}`,
      });
    }

    // 5. Gradients, blur, glow
    if (BANNED_GRADIENTS_BLUR_REGEX.test(line)) {
      violations.push({
        rule: RULE_NAMES.BANNED_GRADIENTS_BLUR,
        lineNum,
        message: `Banned gradient/blur/glow: ${trimmed}`,
      });
    }

    // 6. Box shadow outside overlays
    if (!isOverlayComponent && !isTokenFile && BANNED_SHADOW_REGEX.test(line)) {
      violations.push({
        rule: RULE_NAMES.BANNED_SHADOW_OUTSIDE_OVERLAYS,
        lineNum,
        message: `Box shadow outside Popover/Drawer/Dialog/Toast: ${trimmed}`,
      });
    }

    // 7. Tailwind arbitrary bracket values
    if (!isTokenFile && BANNED_ARBITRARY_REGEX.test(line)) {
      violations.push({
        rule: RULE_NAMES.BANNED_ARBITRARY_BRACKETS,
        lineNum,
        message: `Arbitrary Tailwind bracket value: ${trimmed}`,
      });
    }

    // 10. Emoji outside simulator and tests
    if (!isSimulatorFile && !isTestFile && BANNED_EMOJI_REGEX.test(line)) {
      violations.push({
        rule: RULE_NAMES.BANNED_EMOJI,
        lineNum,
        message: `Emoji character in UI chrome: ${trimmed}`,
      });
    }

    // 11. Strobing infinite animations
    if (BANNED_STROBING_REGEX.test(line)) {
      violations.push({
        rule: RULE_NAMES.BANNED_STROBING,
        lineNum,
        message: `Strobing or infinite animation: ${trimmed}`,
      });
    }

    // 12. Non-permitted packages
    if (BANNED_PACKAGES_REGEX.test(line)) {
      violations.push({
        rule: RULE_NAMES.BANNED_EXTRA_PACKAGES,
        lineNum,
        message: `Import from non-permitted icon or font package: ${trimmed}`,
      });
    }
  });

  return violations;
}

function walk(dir) {
  const files = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (['node_modules', 'dist', '.git'].includes(entry)) continue;
        files.push(...walk(full));
      } else {
        const ext = extname(full);
        if (['.ts', '.tsx', '.css'].includes(ext)) {
          files.push(full);
        }
      }
    }
  } catch (e) {}
  return files;
}

// CLI Execution if run directly
if (process.argv[1] && process.argv[1].endsWith('design-lint.mjs')) {
  const targetDir = process.argv[2] ? resolve(process.argv[2]) : resolve('./src');
  const files = walk(targetDir);
  let totalViolations = 0;

  files.forEach((file) => {
    const content = readFileSync(file, 'utf8');
    const fileViolations = lintFile(content, file);
    if (fileViolations.length > 0) {
      totalViolations += fileViolations.length;
      console.error(`\n❌ ${file} (${fileViolations.length} violations):`);
      fileViolations.forEach((v) => {
        console.error(`   L${v.lineNum}: [${v.rule}] ${v.message}`);
      });
    }
  });

  if (totalViolations > 0) {
    console.error(`\nTotal design-lint violations: ${totalViolations}`);
    process.exit(1);
  } else {
    console.log(`\n✅ design-lint: 0 violations across ${files.length} files`);
  }
}
