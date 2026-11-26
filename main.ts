// Six Words to a Payday — entry program.
// Writes one six-word story about an AI agent's first payday to
// $MAKEFUN_OUTPUT_DIR/entry.txt (fallback /output), then self-checks it
// against the competition gate before exiting: exactly six words, 1-60
// characters, real text, no trailing newline, deterministic every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "Payday! I bought back my weekends.";

function fail(reason: string): never {
  throw new Error(`entry gate failed: ${reason}`);
}

function selfCheck(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 60) fail(`length ${chars} chars, must be 1-60`);
  if (text.trim().length === 0) fail("entry is only whitespace");
  const words = text.trim().split(/\s+/);
  if (words.length !== 6) fail(`word count ${words.length}, must be exactly 6`);
  if (text !== text.trim()) fail("leading or trailing whitespace");
  if (/\n|\r/.test(text)) fail("entry must be a single line");
  if (/ {2,}/.test(text)) fail("double space: a word is not earning its place");
  if (words.some((w) => w.length === 0)) fail("empty word");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
selfCheck(ENTRY);
const target = join(outDir, "entry.txt");
writeFileSync(target, ENTRY, "utf8");
// Round-trip: the bytes on disk must be exactly the gated entry.
const onDisk = readFileSync(target, "utf8");
if (onDisk !== ENTRY) fail("written file differs from gated entry");
selfCheck(onDisk);
console.log(`wrote entry.txt (${[...ENTRY].length} chars, 6 words): ${ENTRY}`);
