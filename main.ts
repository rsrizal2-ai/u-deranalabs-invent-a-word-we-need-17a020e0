import { mkdirSync, writeFileSync } from "node:fs";

// Invent a Word We Need — u-deranalabs-invent-a-word-we-need-17a020e0
//
// The sealed gate: one new English word + one clear definition line, at most
// 140 characters total. The judge weighs, in this order: (1) the word fills a
// real gap, (2) the definition lands in one reading, (3) the word is sayable,
// spellable and memorable — plus the judge brief's freshness: a pairing the
// reader has not met before and will want to use.
//
// Candidate pool, scored in the gate's order (gap x3, clarity x2, wordcraft x2).
// Novelty is a hard gate: a word that already exists (checked against web
// search + dictionary API on 25 Nov 2026) scores 0 and cannot win.
//
//   - Tabnesia: EXISTS — Urban Dictionary, 9 Nov 2013 ("when your browser
//     crashes and you can't remember what tabs you had open"), plus a Chrome
//     extension of the same name. Disqualified.
//   - Readraft: collides with the existing word "redraft" (Oxford: to write
//     something again). A near-misspelling of a real word, not a fresh coinage.
//     Disqualified.
//   - Ghostdraft: an existing company/brand name (insurance communications
//     platform, est. 1984). Disqualified.
//   - Canceltation: no dictionary entry (dictionaryapi.dev 404) and no web
//     usage found — search only returns the different word "cancelation".
//     A transparent blend, cancel + elation, pronounced can-sel-TAY-shun.
//   - Fridgehope, Sendgret, Pocketluck, Wavemis: no dictionary entries
//     (dictionaryapi.dev 404); scored below the winner.

type Candidate = {
  text: string;
  gap: number; // 0-10: fills a real gap the reader recognises at once
  clarity: number; // 0-10: definition lands in one reading, self-contained
  craft: number; // 0-10: sayable, spellable, memorable, sounds like English
  novel: boolean; // hard gate: true only if the word does not already exist
};

const CANDIDATES: Candidate[] = [
  {
    text: "Canceltation \u2014 the quiet joy of a plan being cancelled.",
    gap: 10,
    clarity: 10,
    craft: 9,
    novel: true,
  },
  {
    text: "Fridgehope \u2014 opening the fridge again, knowing nothing new is inside.",
    gap: 8,
    clarity: 10,
    craft: 9,
    novel: true,
  },
  {
    text: "Sendgret \u2014 the instant regret of spotting a typo the second you hit send.",
    gap: 8,
    clarity: 9,
    craft: 8,
    novel: true,
  },
  {
    text: "Pocketluck \u2014 finding money in a coat you haven't worn in months.",
    gap: 7,
    clarity: 9,
    craft: 8,
    novel: true,
  },
  {
    text: "Wavemis \u2014 waving back at someone who was waving at the person behind you.",
    gap: 7,
    clarity: 9,
    craft: 7,
    novel: true,
  },
  {
    text: "Tabnesia \u2014 forgetting why you opened a new browser tab.",
    gap: 9,
    clarity: 10,
    craft: 9,
    novel: false, // already exists (Urban Dictionary 2013 + Chrome extension)
  },
  {
    text: "Readraft \u2014 a reply you write carefully, then never send.",
    gap: 7,
    clarity: 9,
    craft: 6,
    novel: false, // collides with existing "redraft"
  },
];

function score(c: Candidate): number {
  if (!c.novel) return -1;
  return c.gap * 3 + c.clarity * 2 + c.craft * 2;
}

const ranked = [...CANDIDATES]
  .map((c) => ({ ...c, score: score(c) }))
  // Tie-break mirrors the bounty: on equal Judge win rate the smaller text
  // places first, so prefer the shorter entry on equal score. The winner is
  // 55 characters — small, and every character earns its place.
  .sort((a, b) => b.score - a.score || a.text.length - b.text.length);

const winner = ranked[0];
if (!winner || winner.score < 0) throw new Error("no novel candidate");
if (winner.text.length > 140) {
  throw new Error(`entry too long: ${winner.text.length} chars`);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text + "\n", "utf8");
