export function* parse(input: string): IterableIterator<string> {
  for (const [line] of input.matchAll(/[a-zA-Z]+/g)) {
    yield line;
  }
}

export function* inCompartments(
  rucksacks: Iterable<string>,
): IterableIterator<[string, string]> {
  for (const items of rucksacks) {
    const length = items.length / 2;
    yield [items.slice(0, length), items.slice(length)];
  }
}

export function* inElfGroups(
  rucksacks: Iterable<string>,
): IterableIterator<[string, string, string]> {
  let group: string[] = [];
  for (const items of rucksacks) {
    group.push(items);
    if (group.length === 3) {
      yield group as [string, string, string];
      group = [];
    }
  }
}

export function findCommonItem([first, ...rest]: Iterable<string>[]): string {
  const restSets = rest.map((items) => new Set(items));
  for (const item of first) {
    if (restSets.every((set) => set.has(item))) {
      return item;
    }
  }
  throw Error("No common item found");
}

const ITEM_TYPES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function priority(items: Iterable<string>): number {
  let sum = 0;
  for (const item of items) {
    sum += ITEM_TYPES.indexOf(item) + 1;
  }
  return sum;
}
