type Stacks = Map<number, string[]>;

export interface Instruction {
  readonly move: number;
  readonly from: number;
  readonly to: number;
}

export function* parseInstructions(
  input: string,
): IterableIterator<Instruction> {
  for (const m of input.matchAll(/move (\d+) from (\d+) to (\d+)/g)) {
    const [move, from, to] = m.slice(1).map(Number);
    yield { move, from, to };
  }
}

export function parseStacks(input: string): Stacks {
  const stacks: Stacks = new Map();

  for (const [line] of input.matchAll(/.+/g)) {
    if (/\d/.test(line)) {
      // " 1   2   3 "
      break;
    }
    for (let i = 1; i < line.length; i += 4) {
      if (!/[A-Z]/.test(line[i])) {
        continue;
      }
      //   1   2   3   4   5
      // "    [A] [B]     [C]"
      //  0123456789012345678
      const n = (i + 3) / 4;
      let stack = stacks.get(n);
      if (!stack) {
        stack = [];
        stacks.set(n, stack);
      }
      stack.unshift(line[i]);
    }
  }

  return stacks;
}

export function move(stacks: Stacks, { move, from, to }: Instruction): void {
  while (move--) {
    const crate = stacks.get(from)?.pop();
    if (crate) {
      stacks.get(to)?.push(crate);
    }
  }
}

export function tops(stacks: Stacks): string[] {
  return Array.from(stacks.entries())
    .sort(([na], [nb]) => na - nb)
    .map(([, stack]) => stack.at(-1) ?? " ");
}
