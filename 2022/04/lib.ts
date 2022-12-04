type ClosedInterval = [number, number];

export function* parse(
  input: string,
): IterableIterator<[ClosedInterval, ClosedInterval]> {
  for (const [, a0, a1, b0, b1] of input.matchAll(/(\d+)-(\d+),(\d+)-(\d+)/g)) {
    yield [[Number(a0), Number(a1)], [Number(b0), Number(b1)]];
  }
}

export function covers(
  [a0, a1]: ClosedInterval,
  [b0, b1]: ClosedInterval,
): boolean {
  return a0 <= b0 && b1 <= a1;
}

export function overlaps(
  [a0, a1]: ClosedInterval,
  [b0, b1]: ClosedInterval,
): boolean {
  return a0 <= b1 && b0 <= a1;
}
