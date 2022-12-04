export function* parse(input: string): IterableIterator<[string, string]> {
  for (const [line] of input.matchAll(/[a-zA-Z]+/g)) {
    const length = line.length / 2;
    yield [line.slice(0, length), line.slice(length)];
  }
}

export function intersect(
  a: Iterable<string>,
  b: Iterable<string>,
): Set<string> {
  const intersection = new Set<string>();
  const aSet = new Set(a);
  for (const bItem of b) {
    if (aSet.has(bItem)) {
      intersection.add(bItem);
    }
  }
  return intersection;
}

const PRIORITIES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function priority(items: Iterable<string>): number {
  let sum = 0;
  for (const item of items) {
    sum += PRIORITIES.indexOf(item) + 1;
  }
  return sum;
}
