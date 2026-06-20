#!/usr/bin/env node
/**
 * Capture a Storybook reference story screenshot.
 *
 * Usage:
 *   node scripts/reference-images.mjs \
 *     --reference <story-id> \
 *     --out       <path.png>
 *
 * Story IDs use Storybook's iframe URL format, e.g.:
 *   bootstrap-reference-button--solid-variants
 *
 * Polls http://localhost:6006/index.json until the story ID appears,
 * then screenshots the rendered story and saves it to --out.
 * Creates the output directory if it does not exist.
 */

import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const STORYBOOK_URL = 'http://localhost:6006';
const DEFAULTS = { width: 1280, height: 900, pollMs: 500, pollMax: 60 };

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) args[argv[i].slice(2)] = argv[i + 1];
  }
  return args;
}

async function waitForStoryId(storyId, pollMs, pollMax) {
  for (let i = 0; i < pollMax; i++) {
    try {
      const res = await fetch(`${STORYBOOK_URL}/index.json`);
      if (res.ok) {
        const data = await res.json();
        const entries = data.entries ?? data.stories ?? {};
        if (entries[storyId]) return;
      }
    } catch {
      // Storybook not yet ready — continue polling
    }
    await new Promise(r => setTimeout(r, pollMs));
  }
  throw new Error(`Story "${storyId}" not found in index.json after ${pollMax * pollMs / 1000}s`);
}

async function screenshot(page, storyId, outPath, width, height) {
  await page.goto(`${STORYBOOK_URL}/?path=/story/${storyId}`, { waitUntil: 'load' });

  let previewFrame;
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(500);
    previewFrame = page.frames().find(f => f.url().includes('iframe.html'));
    if (previewFrame) break;
  }
  if (!previewFrame) throw new Error(`Preview iframe not found for story: ${storyId}`);

  await previewFrame.waitForFunction(
    () => document.body.classList.contains('sb-show-main'),
    { timeout: 15000 }
  );
  await page.waitForTimeout(300);

  const iframeEl = await page.locator('#storybook-preview-iframe').elementHandle();
  await iframeEl.screenshot({ path: outPath });
}

const raw = parseArgs(process.argv.slice(2));
const { reference, out } = raw;

if (!reference || !out) {
  console.error('Usage: reference-images.mjs --reference <story-id> --out <path.png>');
  process.exit(2);
}

const width = parseInt(raw.width ?? DEFAULTS.width, 10);
const height = parseInt(raw.height ?? DEFAULTS.height, 10);

fs.mkdirSync(path.dirname(out), { recursive: true });

console.log(`Waiting for story "${reference}" in index.json…`);
await waitForStoryId(reference, DEFAULTS.pollMs, DEFAULTS.pollMax);
console.log(`Story found. Capturing screenshot…`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });

await screenshot(page, reference, out, width, height);
await browser.close();

console.log(`Saved: ${path.resolve(out)}`);
