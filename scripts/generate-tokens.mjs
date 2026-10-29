#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const tokensCssPath = resolve(rootDir, 'src/styles/tokens.css');
const outputTsPath = resolve(rootDir, 'src/styles/tokens.generated.ts');

const cssContent = readFileSync(tokensCssPath, 'utf8');

// Parse CSS variables
const varRegex = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
const tokens = {};

let match;
while ((match = varRegex.exec(cssContent)) !== null) {
  const name = match[1];
  const value = match[2].trim();
  tokens[name] = value;
}

const tsContent = `/**
 * AUTO-GENERATED FILE — DO NOT EDIT DIRECTLY.
 * Generated from src/styles/tokens.css by scripts/generate-tokens.mjs
 */

export const TOKENS = ${JSON.stringify(tokens, null, 2)} as const;

export type TokenName = keyof typeof TOKENS;

export const COLOR_TOKENS = {
  page: '${tokens['page'] || '#F5F6F7'}',
  surface: '${tokens['surface'] || '#FFFFFF'}',
  border: '${tokens['border'] || '#D5DADD'}',
  text: '${tokens['text'] || '#1D2D3E'}',
  textSecondary: '${tokens['text-secondary'] || '#556B82'}',
  textDisabled: '${tokens['text-disabled'] || '#8396A9'}',
  accent: '${tokens['accent'] || '#0070F2'}',
  accentHover: '${tokens['accent-hover'] || '#0064D9'}',
  accentActive: '${tokens['accent-active'] || '#0055B8'}',
  accentTint: '${tokens['accent-tint'] || '#EBF5FE'}',
  negative: '${tokens['negative'] || '#D20A0A'}',
  negativeTint: '${tokens['negative-tint'] || '#FDECEC'}',
  critical: '${tokens['critical'] || '#E76500'}',
  criticalTint: '${tokens['critical-tint'] || '#FFF1E3'}',
  positive: '${tokens['positive'] || '#256F3A'}',
  positiveTint: '${tokens['positive-tint'] || '#EAF5EC'}',
  informative: '${tokens['informative'] || '#0070F2'}',
  informativeTint: '${tokens['informative-tint'] || '#EBF5FE'}',
  chart1: '${tokens['chart-1'] || '#0070F2'}',
  chart2: '${tokens['chart-2'] || '#1D2D3E'}',
  chart3: '${tokens['chart-3'] || '#556B82'}',
  chart4: '${tokens['chart-4'] || '#5BA3FF'}',
  chart5: '${tokens['chart-5'] || '#A9B4C0'}',
} as const;

export const CHART_PALETTE = [
  COLOR_TOKENS.chart1,
  COLOR_TOKENS.chart2,
  COLOR_TOKENS.chart3,
  COLOR_TOKENS.chart4,
  COLOR_TOKENS.chart5,
];
`;

writeFileSync(outputTsPath, tsContent, 'utf8');
console.log(`Generated ${outputTsPath} with ${Object.keys(tokens).length} tokens.`);

