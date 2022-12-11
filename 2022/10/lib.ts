export function* parse(input: string): IterableIterator<number | null> {
  for (const [, addx] of input.matchAll(/addx (-?\d+)|noop/g)) {
    if (addx) {
      yield Number(addx);
    } else {
      yield null;
    }
  }
}

export function* run(
  register: number,
  instructions: Iterable<number | null>,
): IterableIterator<number> {
  for (const instruction of instructions) {
    yield register;
    if (typeof instruction === "number") {
      yield register;
      register += instruction;
    }
  }
}

export function* sample(
  values: Iterable<number>,
  { start, step }: {
    start: number;
    step: number;
  },
): IterableIterator<number> {
  let cycle = 0;
  for (const value of values) {
    cycle += 1;
    if (cycle < start) {
      continue;
    }
    if ((cycle - start) % step === 0) {
      yield value * cycle;
    }
  }
}
