import { describe, it, expect } from 'vitest';
// @ts-ignore - loading mjs script helper directly
import { lintFile, RULE_NAMES } from '../../scripts/design-lint.mjs';

interface Violation {
  rule: string;
  lineNum: number;
  message: string;
}

describe('Design Lint Suite (Section 4.1 Specification)', () => {
  it('Rule 1: fails on hex color literals outside tokens files and passes inside token files', () => {
    const failingCode = `const cardBg = '#F5F6F7';`;
    const passingCode = `const cardBg = 'var(--page)';`;

    const failViolations: Violation[] = lintFile(failingCode, 'src/components/Card.tsx');
    expect(failViolations.some((v: Violation) => v.rule === RULE_NAMES.HEX_OUTSIDE_TOKENS)).toBe(true);

    const passViolations: Violation[] = lintFile(failingCode, 'src/styles/tokens.css');
    expect(passViolations.some((v: Violation) => v.rule === RULE_NAMES.HEX_OUTSIDE_TOKENS)).toBe(false);

    const normalPassViolations: Violation[] = lintFile(passingCode, 'src/components/Card.tsx');
    expect(normalPassViolations.some((v: Violation) => v.rule === RULE_NAMES.HEX_OUTSIDE_TOKENS)).toBe(false);
  });

  it('Rule 2: fails on font-mono or font-serif and passes on standard font stack', () => {
    const failMono = `<div className="font-mono text-xs">VV-001</div>`;
    const failSerif = `<h1 className="font-serif text-2xl">Title</h1>`;
    const passFont = `<div className="font-sans text-sm tabular-nums">VV-001</div>`;

    expect(lintFile(failMono, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_FONTS)).toBe(true);
    expect(lintFile(failSerif, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_FONTS)).toBe(true);
    expect(lintFile(passFont, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_FONTS)).toBe(false);
  });

  it('Rule 3: fails on uppercase, lowercase, capitalize, or tracking utilities and passes on sentence case', () => {
    const failUpper = `<span className="uppercase">Overview</span>`;
    const failTracking = `<span className="tracking-wide">Overview</span>`;
    const passSentence = `<span className="text-sm text-text">Overview</span>`;

    expect(lintFile(failUpper, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_TEXT_TRANSFORM)).toBe(true);
    expect(lintFile(failTracking, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_TEXT_TRANSFORM)).toBe(true);
    expect(lintFile(passSentence, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_TEXT_TRANSFORM)).toBe(false);
  });

  it('Rule 4: fails on font weights other than 400 or 600', () => {
    const failBold = `<h2 className="font-bold">Summary</h2>`;
    const failMedium = `<p className="font-medium">Details</p>`;
    const passRegular = `<p className="font-normal">Details</p>`;
    const passSemibold = `<h2 className="font-semibold">Summary</h2>`;

    expect(lintFile(failBold, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_FONT_WEIGHT)).toBe(true);
    expect(lintFile(failMedium, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_FONT_WEIGHT)).toBe(true);
    expect(lintFile(passRegular, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_FONT_WEIGHT)).toBe(false);
    expect(lintFile(passSemibold, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_FONT_WEIGHT)).toBe(false);
  });

  it('Rule 5: fails on gradients, blur, and drop-shadow', () => {
    const failGrad = `<div className="bg-gradient-to-r from-blue-500 to-indigo-500">Banner</div>`;
    const failBlur = `<div className="backdrop-blur-md">Modal</div>`;
    const passClean = `<div className="bg-surface border border-border">Banner</div>`;

    expect(lintFile(failGrad, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_GRADIENTS_BLUR)).toBe(true);
    expect(lintFile(failBlur, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_GRADIENTS_BLUR)).toBe(true);
    expect(lintFile(passClean, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_GRADIENTS_BLUR)).toBe(false);
  });

  it('Rule 6: fails on box shadow outside Popover, Drawer, Dialog, Toast', () => {
    const failCardShadow = `<div className="rounded-container bg-surface shadow-md">Card</div>`;
    const passCard = `<div className="rounded-container bg-surface border border-border">Card</div>`;
    const passDrawer = `<div className="shadow-overlay bg-surface">Drawer content</div>`;

    expect(lintFile(failCardShadow, 'src/components/Card.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_SHADOW_OUTSIDE_OVERLAYS)).toBe(true);
    expect(lintFile(passCard, 'src/components/Card.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_SHADOW_OUTSIDE_OVERLAYS)).toBe(false);
    expect(lintFile(passDrawer, 'src/components/ui/Drawer.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_SHADOW_OUTSIDE_OVERLAYS)).toBe(false);
  });

  it('Rule 7: fails on Tailwind arbitrary bracket values', () => {
    const failArbitrary = `<div className="w-[342px] bg-[#123456]">Box</div>`;
    const passTokens = `<div className="w-64 bg-surface">Box</div>`;

    expect(lintFile(failArbitrary, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_ARBITRARY_BRACKETS)).toBe(true);
    expect(lintFile(passTokens, 'src/components/Item.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_ARBITRARY_BRACKETS)).toBe(false);
  });

  it('Rule 10: fails on emoji in UI chrome outside simulator files', () => {
    const failEmoji = `<button>🚨 SOS Trigger</button>`;
    const passSimulator = `<div className="message">🚨 Help needed</div>`;
    const passChrome = `<button><AlertTriangle className="w-4 h-4 stroke-[1.5]" /> SOS trigger</button>`;

    expect(lintFile(failEmoji, 'src/components/Button.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_EMOJI)).toBe(true);
    expect(lintFile(passSimulator, 'src/simulator/PhoneFrame.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_EMOJI)).toBe(false);
    expect(lintFile(passChrome, 'src/components/Button.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_EMOJI)).toBe(false);
  });

  it('Rule 11: fails on strobing infinite animations', () => {
    const failPulse = `<div className="animate-pulse">Loading</div>`;
    const failPing = `<span className="animate-ping">Active</span>`;
    const passStatic = `<div className="opacity-50">Loading</div>`;

    expect(lintFile(failPulse, 'src/components/Skeleton.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_STROBING)).toBe(true);
    expect(lintFile(failPing, 'src/components/Status.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_STROBING)).toBe(true);
    expect(lintFile(passStatic, 'src/components/Skeleton.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_STROBING)).toBe(false);
  });

  it('Rule 12: fails on banned icon/font package imports', () => {
    const failFluent = `import { Calendar16Regular } from '@fluentui/react-icons';`;
    const failFontAwesome = `import { faCalendar } from '@fortawesome/free-solid-svg-icons';`;
    const passLucide = `import { Calendar } from 'lucide-react';`;

    expect(lintFile(failFluent, 'src/components/Calendar.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_EXTRA_PACKAGES)).toBe(true);
    expect(lintFile(failFontAwesome, 'src/components/Calendar.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_EXTRA_PACKAGES)).toBe(true);
    expect(lintFile(passLucide, 'src/components/Calendar.tsx').some((v: Violation) => v.rule === RULE_NAMES.BANNED_EXTRA_PACKAGES)).toBe(false);
  });
});
