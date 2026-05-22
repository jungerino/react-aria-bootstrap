#!/usr/bin/env node
/**
 * Compare two Storybook stories visually using Playwright + pixelmatch.
 *
 * Usage:
 *   node scripts/compare-stories.js \
 *     --reference  <story-id>  \
 *     --impl       <story-id>  \
 *     [--out       <dir>]      \
 *     [--threshold <0–1>]      \
 *     [--width     <px>]       \
 *     [--height    <px>]
 *
 * Story IDs use Storybook's iframe URL format, e.g.:
 *   bootstrap-reference-button--solid-variants
 *   bootstrap-test-button--default
 *
 * Exits 0 if diff pixel count is within threshold, 1 otherwise.
 * Writes three PNGs to --out (default: .story-diffs/):
 *   reference.png, implementation.png, diff.png
 */

const { chromium } = require('@playwright/test');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const fs = require('fs');
const path = require('path');

const STORYBOOK_URL = 'http://localhost:6006';
const DEFAULTS = { out: '.story-diffs', threshold: 0.1, width: 1280, height: 900 };

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[i + 1];
  }
  return args;
}

async function screenshot(page, storyId, outPath, width, height) {
  const url = `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;
  await page.goto(url, { waitUntil: 'networkidle' });
  // Give React time to settle after network idle
  await page.waitForTimeout(300);
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width, height } });
}

function diffImages(pathA, pathB, diffPath) {
  const a = PNG.sync.read(fs.readFileSync(pathA));
  const b = PNG.sync.read(fs.readFileSync(pathB));
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const diff = new PNG({ width, height });
  const numDiff = pixelmatch(a.data, b.data, diff.data, width, height, {
    threshold: 0.1,
    includeAA: false,
  });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  return { numDiff, width, height, totalPixels: width * height };
}

(async () => {
  const raw = parseArgs(process.argv.slice(2));
  const { reference, impl } = raw;

  if (!reference || !impl) {
    console.error('Usage: compare-stories.js --reference <id> --impl <id> [--out <dir>] [--threshold <0-1>] [--width <px>] [--height <px>]');
    process.exit(2);
  }

  const out = raw.out ?? DEFAULTS.out;
  const threshold = parseFloat(raw.threshold ?? DEFAULTS.threshold);
  const width = parseInt(raw.width ?? DEFAULTS.width, 10);
  const height = parseInt(raw.height ?? DEFAULTS.height, 10);

  fs.mkdirSync(out, { recursive: true });

  const refOut = path.join(out, 'reference.png');
  const implOut = path.join(out, 'implementation.png');
  const diffOut = path.join(out, 'diff.png');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });

  console.log(`Capturing reference: ${reference}`);
  await screenshot(page, reference, refOut, width, height);

  console.log(`Capturing implementation: ${impl}`);
  await screenshot(page, impl, implOut, width, height);

  await browser.close();

  const { numDiff, totalPixels } = diffImages(refOut, implOut, diffOut);
  const pct = ((numDiff / totalPixels) * 100).toFixed(2);

  console.log(`Diff pixels: ${numDiff} / ${totalPixels} (${pct}%)`);
  console.log(`Output: ${path.resolve(out)}/`);

  if (numDiff / totalPixels > threshold) {
    console.error(`FAIL — diff ${pct}% exceeds threshold ${(threshold * 100).toFixed(0)}%`);
    process.exit(1);
  }

  console.log('PASS');
})();
