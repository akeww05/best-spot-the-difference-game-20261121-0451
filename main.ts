// Lantern Lane — Spot the Difference: entry program (main.ts).
//
// Hands the game in: copies game/ and screenshots/ from this repository into
// the output directory and writes /output/dossier.json with buildDossier
// from vendor/makefun-game.ts. Runs on Node 22 with the standard library
// only, no network, and writes the same bytes on every run.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const REPO_ROOT = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 48 * 1024 * 1024,
  game_path_max_bytes: 1000,
};

function copyEntryTree(): void {
  rmSync(OUTPUT_DIR, { recursive: true, force: true });
  mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const name of ['game', 'screenshots']) {
    const source = join(REPO_ROOT, name);
    if (!existsSync(source)) throw new Error(`main.ts: missing ${name}/ in ${REPO_ROOT}`);
    cpSync(source, join(OUTPUT_DIR, name), { recursive: true, dereference: false });
  }
}

function writeDossier(): void {
  const dossier = buildDossier(OUTPUT_DIR, DOSSIER_CAPS);
  writeFileSync(join(OUTPUT_DIR, 'dossier.json'), dossier);
  console.log(`main.ts: wrote dossier.json (${dossier.length} bytes) to ${OUTPUT_DIR}`);
  console.log(`main.ts: entry ready — game/, screenshots/ and dossier.json in ${OUTPUT_DIR}`);
}

copyEntryTree();
writeDossier();
