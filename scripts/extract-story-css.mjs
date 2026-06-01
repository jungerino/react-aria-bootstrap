#!/usr/bin/env node
/**
 * Extract Bootstrap CSS rules that match the rendered DOM of a Storybook story.
 *
 * Usage:
 *   node scripts/extract-story-css.mjs --story <story-id> --out <output-path>
 *
 * Story IDs use Storybook's iframe URL format, e.g.:
 *   bootstrap-reference-button--solid-variants
 *
 * Writes matched CSS rules (including pseudo-elements) to --out.
 */

import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const STORYBOOK_URL = 'http://localhost:6006';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[i + 1];
  }
  return args;
}

const { story, out } = parseArgs(process.argv.slice(2));

if (!story || !out) {
  console.error('Usage: extract-story-css.mjs --story <story-id> --out <output-path>');
  process.exit(2);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

console.log(`Navigating to story: ${story}`);
await page.goto(`${STORYBOOK_URL}/?path=/story/${story}`, { waitUntil: 'load' });

// Wait for the preview iframe to appear
let previewFrame;
for (let i = 0; i < 20; i++) {
  await page.waitForTimeout(500);
  previewFrame = page.frames().find(f => f.url().includes('iframe.html'));
  if (previewFrame) break;
}
if (!previewFrame) throw new Error(`Preview iframe not found for story: ${story}`);

// Wait for story to be fully rendered
await previewFrame.waitForFunction(
  () => document.body.classList.contains('sb-show-main'),
  { timeout: 15000 }
);
await page.waitForTimeout(300);

// Extract matched CSS rules from within the iframe context.
// Pseudo-element rules (::before, ::after, etc.) are captured by stripping the
// pseudo-element suffix from the selector before matching — e.g. "button::before"
// is tested as "button", so the rule is included if any button exists in the DOM.
// @media and @supports blocks are traversed recursively so nested rules are covered.
const matchedRules = await previewFrame.evaluate(() => {
  const elements = [...document.querySelectorAll('#storybook-root, #storybook-root *')];
  const collected = new Set();

  function processRule(rule) {
    if (rule instanceof CSSStyleRule) {
      const base = rule.selectorText
        .replace(/::[\w-]+(\([^)]*\))?/g, '') // strip ::pseudo-element parts
        .trim();
      try {
        if (!base || elements.some(el => { try { return el.matches(base); } catch { return false; } })) {
          collected.add(rule.cssText);
        }
      } catch { /* unparseable selector — skip */ }
    } else if (rule instanceof CSSMediaRule || rule instanceof CSSSupportsRule) {
      for (const child of rule.cssRules) processRule(child);
    }
  }

  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) processRule(rule);
    } catch { /* cross-origin sheet — skip */ }
  }

  return [...collected];
});

await browser.close();

const outDir = path.dirname(out);
if (outDir && outDir !== '.') fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(out, matchedRules.join('\n\n'), 'utf8');

console.log(`Wrote ${matchedRules.length} CSS rules to: ${path.resolve(out)}`);
