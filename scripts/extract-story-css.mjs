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
//
// Two-pass matching strategy:
//
// Pass 1 — DOM element match: strips ::pseudo-element suffixes and tests each
//   rule against all elements in the document (including <html> and <body> so
//   :root and body rules are captured). This picks up base class rules and
//   browser normalizer rules for element types present in the story.
//
// Pass 2 — class-pattern match: collects every CSS class name that appears on
//   story elements, then includes any rule whose selectorText contains one of
//   those class names as a substring. This captures pseudo-class variants
//   (.btn:hover, .btn:focus-visible, .btn:disabled) and compound selectors
//   (.btn-check:checked + .btn) that Pass 1 misses because no element is in
//   the required dynamic state at page load.
//
// @media and @supports blocks are traversed recursively in both passes.
const matchedRules = await previewFrame.evaluate(() => {
  const storyElements = [...document.querySelectorAll('#storybook-root, #storybook-root *')];
  // Include <html> and <body> so :root and body rules are captured by Pass 1
  const allElements = [document.documentElement, document.body, ...storyElements];

  // Collect every CSS class name present on story elements for Pass 2
  const domClasses = new Set();
  for (const el of storyElements) {
    for (const cls of el.classList) domClasses.add('.' + cls);
  }

  const collected = new Set();

  function processRule(rule, mediaContext = '') {
    if (rule instanceof CSSStyleRule) {
      const base = rule.selectorText
        .replace(/::[\w-]+(\([^)]*\))?/g, '') // strip ::pseudo-element parts
        .trim();

      // Pass 1: direct element match (static DOM state, includes :root via allElements)
      const domMatch = !base || allElements.some(el => {
        try { return el.matches(base); } catch { return false; }
      });

      // Pass 2: class-pattern match — include if the selector references a class
      // present in the story DOM, regardless of dynamic pseudo-class state
      const classMatch = domClasses.size > 0 && [...domClasses].some(cls =>
        rule.selectorText.includes(cls)
      );

      if (domMatch || classMatch) {
        const text = mediaContext
          ? `${mediaContext} {\n  ${rule.cssText}\n}`
          : rule.cssText;
        collected.add(text);
      }
    } else if (rule instanceof CSSMediaRule) {
      for (const child of rule.cssRules)
        processRule(child, `@media ${rule.conditionText}`);
    } else if (rule instanceof CSSSupportsRule) {
      for (const child of rule.cssRules)
        processRule(child, `@supports ${rule.conditionText}`);
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
