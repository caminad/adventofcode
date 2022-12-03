type Play = "rock" | "paper" | "scissors";

interface Round {
  readonly opponent: Play;
  readonly player: Play;
}

const SCORES = {
  rock: 1,
  paper: 2,
  scissors: 3,
  loss: 0,
  tie: 3,
  win: 6,
};

const RULES = {
  rock: {
    rock: "tie",
    paper: "loss",
    scissors: "win",
  } as const,
  paper: {
    rock: "win",
    paper: "tie",
    scissors: "loss",
  } as const,
  scissors: {
    rock: "loss",
    paper: "win",
    scissors: "tie",
  } as const,
} as const;

const OPPONENT_PLAYS: ReadonlyMap<string, Play> = new Map([
  ["A", "rock"],
  ["B", "paper"],
  ["C", "scissors"],
]);

const PLAYER_PLAYS: ReadonlyMap<string, Play> = new Map([
  ["X", "rock"],
  ["Y", "paper"],
  ["Z", "scissors"],
]);

export function* parse(input: string): IterableIterator<Round> {
  for (const m of input.matchAll(/(\S)\s(\S)/g)) {
    const opponent = OPPONENT_PLAYS.get(m[1]);
    if (!opponent) {
      throw Error(`Unexpected opponent input: ${m[1]}`);
    }
    const player = PLAYER_PLAYS.get(m[2]);
    if (!player) {
      throw Error(`Unexpected player input: ${m[2]}`);
    }
    yield { opponent, player };
  }
}

export function score(round: Round): number {
  return SCORES[round.player] + SCORES[RULES[round.player][round.opponent]];
}
