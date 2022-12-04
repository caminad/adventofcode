type Range = [from: number, to: number];

export function* parse(input: string): IterableIterator<[Range, Range]> {
  for (const [, a0, a1, b0, b1] of input.matchAll(/(\d+)-(\d+),(\d+)-(\d+)/g)) {
    yield [[Number(a0), Number(a1)], [Number(b0), Number(b1)]];
  }
}

export function covers(a: Range, b: Range) {
  return a[0] <= b[0] && b[1] <= a[1];
}
