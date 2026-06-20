#!/usr/bin/env node
/**
 * Compare two Storybook stories visually using Playwright + pixelmatch.
 *
 * Usage:
 *   node scripts/compare-stories.js \
 *     --reference        <story-id>  \
 *     --impl             <story-id>  \
 *     [--out             <dir>]      \
 *     [--threshold       <0–1>]      \
 *     [--pixel-threshold <0–1>]      \
 *     [--width           <px>]       \
 *     [--height          <px>]
 *
 * Story IDs use Storybook's iframe URL format, e.g.:
 *   bootstrap-reference-button--solid-variants
 *   bootstrap-test-button--default
 *
 * Exits 0 if diff pixel count is within threshold, 1 otherwise.
 * Writes two PNGs to --out (default: .story-diffs/):
 *   implementation.png, diff.png
 * Creates the --out directory if it does not exist.
 */

import { chromium } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import os from 'os';
import path from 'path';

const STORYBOOK_URL = 'http://localhost:6006';
const DEFAULTS = { out: '.story-diffs', threshold: 0.1, pixelThreshold: 0.1, width: 1280, height: 900 };

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[i + 1];
  }
  return args;
}

async function screenshot(page, storyId, outPath, width, height) {
  // Load the full Storybook UI — the manager frame must run to signal the preview
  // iframe to render. Loading the iframe URL alone leaves it in sb-show-preparing-story.
  await page.goto(`${STORYBOOK_URL}/?path=/story/${storyId}`, { waitUntil: 'load' });

  // Find the preview iframe frame (loads asynchronously)
  let previewFrame;
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(500);
    previewFrame = page.frames().find(f => f.url().includes('iframe.html'));
    if (previewFrame) break;
  }
  if (!previewFrame) throw new Error(`Preview iframe not found for story: ${storyId}`);

  // Wait for Storybook to signal the story is ready (sb-show-main replaces sb-show-preparing-story)
  await previewFrame.waitForFunction(
    () => document.body.classList.contains('sb-show-main'),
    { timeout: 15000 }
  );
  // Small settle for fonts and CSS variables
  await page.waitForTimeout(300);

  // Screenshot the iframe element itself, clipped to viewport size
  const iframeEl = await page.locator('#storybook-preview-iframe').elementHandle();
  await iframeEl.screenshot({ path: outPath });
}

function diffImages(pathA, pathB, diffPath, pixelThreshold) {
  const a = PNG.sync.read(fs.readFileSync(pathA));
  const b = PNG.sync.read(fs.readFileSync(pathB));
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const diff = new PNG({ width, height });
  const numDiff = pixelmatch(a.data, b.data, diff.data, width, height, {
    threshold: pixelThreshold,
    includeAA: false,
  });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  return { numDiff, width, height, totalPixels: width * height };
}

const raw = parseArgs(process.argv.slice(2));
const { reference, impl } = raw;

if (!reference || !impl) {
  console.error('Usage: compare-stories.mjs --reference <id> --impl <id> [--out <dir>] [--threshold <0-1>] [--pixel-threshold <0-1>] [--width <px>] [--height <px>]');
  process.exit(2);
}

const out = raw.out ?? DEFAULTS.out;
const threshold = parseFloat(raw.threshold ?? DEFAULTS.threshold);
const pixelThreshold = parseFloat(raw['pixel-threshold'] ?? DEFAULTS.pixelThreshold);
const width = parseInt(raw.width ?? DEFAULTS.width, 10);
const height = parseInt(raw.height ?? DEFAULTS.height, 10);

fs.mkdirSync(out, { recursive: true });

const implOut = path.join(out, 'implementation.png');
const diffOut = path.join(out, 'diff.png');

// Temporary file for reference screenshot — written to system temp, not the output directory
const refTmp = path.join(os.tmpdir(), `compare-stories-ref-${process.pid}.png`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });

console.log(`Capturing reference: ${reference}`);
await screenshot(page, reference, refTmp, width, height);

console.log(`Capturing implementation: ${impl}`);
await screenshot(page, impl, implOut, width, height);

await browser.close();

const { numDiff, totalPixels } = diffImages(refTmp, implOut, diffOut, pixelThreshold);
fs.unlinkSync(refTmp);
const pct = ((numDiff / totalPixels) * 100).toFixed(2);

console.log(`Diff pixels: ${numDiff} / ${totalPixels} (${pct}%)`);
console.log(`Output: ${path.resolve(out)}/`);

if (numDiff / totalPixels > threshold) {
  console.error(`FAIL — diff ${pct}% exceeds threshold ${(threshold * 100).toFixed(0)}%`);
  process.exit(1);
}

console.log('PASS');
