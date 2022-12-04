export type Round = `${"A" | "B" | "C"} ${"X" | "Y" | "Z"}`;

export function* parse(input: string): IterableIterator<Round> {
  for (const [round] of input.matchAll(/[ABC] [XYZ]/g)) {
    yield round as Round;
  }
}

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;
const LOSS = 0;
const DRAW = 3;
const WIN = 6;

type Rules = Record<Round, number>;

export const RULES_V1: Readonly<Rules> = {
  "A X": ROCK + DRAW,
  "A Y": PAPER + WIN,
  "A Z": SCISSORS + LOSS,
  "B X": ROCK + LOSS,
  "B Y": PAPER + DRAW,
  "B Z": SCISSORS + WIN,
  "C X": ROCK + WIN,
  "C Y": PAPER + LOSS,
  "C Z": SCISSORS + DRAW,
};

export const RULES_V2: Readonly<Rules> = {
  "A X": LOSS + SCISSORS,
  "A Y": DRAW + ROCK,
  "A Z": WIN + PAPER,
  "B X": LOSS + ROCK,
  "B Y": DRAW + PAPER,
  "B Z": WIN + SCISSORS,
  "C X": LOSS + PAPER,
  "C Y": DRAW + SCISSORS,
  "C Z": WIN + ROCK,
};

export function score(rounds: Iterable<Round>, rules: Readonly<Rules>): number {
  let total = 0;
  for (const round of rounds) {
    total += rules[round];
  }
  return total;
}
