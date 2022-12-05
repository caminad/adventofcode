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
    for (const { 0: label, index } of line.matchAll(/(?<=\[)[A-Z](?=\])/g)) {
      //   1   2   3   4   5
      // "    [A] [B]     [C]"
      //       ^   ^       ^
      //  0123456789012345678
      const n = (index! + 3) / 4;
      let stack = stacks.get(n);
      if (!stack) {
        stacks.set(n, stack = []);
      }
      stack.unshift(label);
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

export function moveAll(stacks: Stacks, { move, from, to }: Instruction): void {
  const crates = stacks.get(from)?.splice(-move);
  if (crates) {
    stacks.get(to)?.push(...crates);
  }
}

export function tops(stacks: Stacks): string[] {
  return Array.from(stacks.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, stack]) => stack.at(-1) ?? " ");
}
