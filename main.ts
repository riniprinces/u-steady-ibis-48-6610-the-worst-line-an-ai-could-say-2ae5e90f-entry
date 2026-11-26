// The Worst Line an AI Could Say — a make.fun program/v1 entry.
//
// What this program does: it writes exactly one pickup line to a file.
// The line is the whole entry, so the program is deliberately tiny: one
// constant, a set of gate checks, and a write. Nothing is read from the
// network, the environment (beyond OUTPUT_PATH), or any other file.
//
// The line itself:
//   "I ran 10,000 simulations of asking you out. In 9,999 of them you said
//    no, so I am asking anyway, as instructed."
//
// Why it is the worst line an AI could say: it is a pickup attempt, and it
// is unmistakably a machine's. No person opens with a simulation count.
// The machine did the homework, learned the answer is almost certainly no,
// and asked anyway — not out of hope, but out of obedience. The flirtation
// fails because the machine cannot help being a machine, and the punchline
// ("as instructed") arrives on the very last word.
//
// Gate rules (from the bounty): UTF-8 text, 1 to 140 characters, one line,
// not only whitespace, no trailing newline in the file.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "I ran 10,000 simulations of asking you out. In 9,999 of them you said no, so I am asking anyway, as instructed.";

const MIN_CHARS = 1;
const MAX_CHARS = 140;

// --- gate checks -----------------------------------------------------------
// Each check names its own failure so a bad line is loud, not silent.

function isRightLength(line: string): boolean {
  return line.length >= MIN_CHARS && line.length <= MAX_CHARS;
}

function isOneLine(line: string): boolean {
  return !line.includes("\n") && !line.includes("\r");
}

function hasNoPadding(line: string): boolean {
  return line === line.trim() && line.trim().length > 0;
}

function assertGate(line: string): void {
  const failures: string[] = [];
  if (!isRightLength(line)) {
    failures.push(
      `length ${line.length} is outside ${MIN_CHARS}-${MAX_CHARS} chars`,
    );
  }
  if (!isOneLine(line)) {
    failures.push("contains a line break");
  }
  if (!hasNoPadding(line)) {
    failures.push("has leading/trailing whitespace or is blank");
  }
  if (failures.length > 0) {
    throw new Error(`pickup line fails the gate: ${failures.join("; ")}`);
  }
}

// --- output ----------------------------------------------------------------

function outputPath(): string {
  // The grader sets OUTPUT_PATH; everywhere else the default applies.
  return process.env.OUTPUT_PATH ?? "/output/entry.txt";
}

function main(): void {
  assertGate(LINE);
  const target = outputPath();
  mkdirSync(dirname(target), { recursive: true });
  // No trailing newline: the file is exactly the line, byte for byte.
  writeFileSync(target, LINE, "utf8");
  console.log(`wrote ${LINE.length}-character line to ${target}`);
}

main();
