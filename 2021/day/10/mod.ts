const PARENS = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
} as const;
type OpenParen = keyof typeof PARENS;
type ClosingParen = typeof PARENS[OpenParen];

const ILLEGAL_CHARACTER_SCORES = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

function isOpenParen(c: string): c is OpenParen {
  return c in PARENS;
}

function getIllegalCharacterScore(c: string): number {
  if (c in ILLEGAL_CHARACTER_SCORES) {
    return ILLEGAL_CHARACTER_SCORES[c as ClosingParen];
  }
  return 0;
}

export function parseInput(input: string): string[] {
  return Array.from(input.match(/\S+/g)!);
}

type CheckResult =
  | { ok: true }
  | { ok: false; expected: ClosingParen | undefined; found: string };

export function checkLine(line: string): CheckResult {
  const stack: ClosingParen[] = [];
  for (const c of line) {
    if (isOpenParen(c)) {
      stack.push(PARENS[c]);
    } else {
      const expected = stack.pop();
      if (c !== expected) {
        return { ok: false, expected, found: c };
      }
    }
  }
  return { ok: true };
}

export function getSyntaxErrorScore(results: CheckResult[]): number {
  let score = 0;
  for (const result of results) {
    if (!result.ok) {
      score += getIllegalCharacterScore(result.found);
    }
  }
  return score;
}
