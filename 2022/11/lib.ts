// @deno-types="npm:@types/moo"
import moo from "npm:moo";

const RULES: moo.Rules = {
  WS: {
    match: /\s+/,
    lineBreaks: true,
  },
  monkey: {
    match: /Monkey \d+:/,
    value: (x) => x.slice(7, -1),
  },
  startingItems: {
    match: /Starting items: \d+(?:, \d+)*/,
    value: (x) => x.slice(16),
  },
  operation: {
    match: /Operation: new = old [*+] (?:\d+|old)/,
    value: (x) => x.slice(21),
  },
  divisor: {
    match: /Test: divisible by \d+/,
    value: (x) => x.slice(19),
  },
  ifTrue: {
    match: /If true: throw to monkey \d+/,
    value: (x) => x.slice(25),
  },
  ifFalse: {
    match: /If false: throw to monkey \d+/,
    value: (x) => x.slice(26),
  },
};

type Operator = "*" | "+";

export interface Operation {
  readonly operator: Operator;
  readonly value?: bigint;
}

export interface Condition {
  readonly divisor: bigint;
  readonly ifTrue: number;
  readonly ifFalse: number;
}

export interface MonkeyRule {
  readonly startingItems: readonly bigint[];
  readonly operation: Operation;
  readonly condition: Condition;
}

function* skipWhitespace(
  tokens: Iterable<moo.Token>,
): IterableIterator<moo.Token> {
  for (const token of tokens) {
    if (token.type !== "WS") {
      yield token;
    }
  }
}

function nextToken(
  tokens: Iterator<moo.Token>,
  type: string,
): moo.Token | undefined {
  const result = tokens.next();
  if (result.done) {
    return;
  }
  if (result.value.type === type) {
    return result.value;
  }
  throw new Error(
    `Unexpected ${result.value.type}` +
      ` at line ${result.value.line} col ${result.value.col}` +
      ` (expected ${type})`,
  );
}

function nextValue(
  tokens: Iterator<moo.Token>,
  type: string,
): string {
  const token = nextToken(tokens, type);
  if (token) {
    return token.value;
  }
  throw new Error(`Unexpected end of input (expected ${type})`);
}

function parseOperation(input: string): Operation {
  const [operator, value] = input.split(" ");
  if (value === "old") {
    return { operator: operator as "*" | "+" };
  } else {
    return { operator: operator as "*" | "+", value: BigInt(value) };
  }
}

export function* parse(input: string): IterableIterator<MonkeyRule> {
  const tokens = skipWhitespace(moo.compile(RULES).reset(input));

  while (nextToken(tokens, "monkey")) {
    yield {
      startingItems: nextValue(tokens, "startingItems").split(", ").map(BigInt),
      operation: parseOperation(nextValue(tokens, "operation")),
      condition: {
        divisor: BigInt(nextValue(tokens, "divisor")),
        ifTrue: Number(nextValue(tokens, "ifTrue")),
        ifFalse: Number(nextValue(tokens, "ifFalse")),
      },
    };
  }
}

interface MonkeyState {
  readonly items: bigint[];
  readonly inspections: number;
}

const OPERATIONS: Readonly<
  Record<Operator, (a: bigint, b?: bigint) => bigint>
> = {
  "*": (a, b) => a * (b ?? a),
  "+": (a, b) => a + (b ?? a),
};

function inspect({ operation, condition }: MonkeyRule, worry: bigint): {
  worry: bigint;
  destination: number;
} {
  worry = OPERATIONS[operation.operator](worry, operation.value) / 3n;
  if (worry % condition.divisor === 0n) {
    return { worry, destination: condition.ifTrue };
  } else {
    return { worry, destination: condition.ifFalse };
  }
}

function nextMonkeyStates(
  prev: readonly MonkeyState[],
  rules: readonly MonkeyRule[],
): MonkeyState[] {
  const states = Array.from(prev, (s) => ({
    items: [...s.items],
    inspections: s.inspections,
  }));
  for (const [i, rule] of rules.entries()) {
    const state = states[i];
    for (const worry of state.items) {
      const result = inspect(rule, worry);
      state.inspections++;
      states[result.destination].items.push(result.worry);
    }
    state.items = [];
  }
  return states;
}

function monkeyBusiness(values: Iterable<{ inspections: number }>): number {
  const [first, second] = Array.from(values, (m) => m.inspections)
    .sort((a, b) => Number(b - a));
  return first * second;
}

export function* run(
  rules: MonkeyRule[],
  rounds: number,
): IterableIterator<{
  round: number;
  states: MonkeyState[];
  monkeyBusiness: number;
}> {
  let states: MonkeyState[] = Array.from(rules, ({ startingItems }) => ({
    items: [...startingItems],
    inspections: 0,
  }));
  yield { round: 0, states, monkeyBusiness: 0 };
  for (let round = 1; round <= rounds; round++) {
    states = nextMonkeyStates(states, rules);
    yield { round, states, monkeyBusiness: monkeyBusiness(states) };
  }
}
