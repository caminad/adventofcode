export function parseInput(input: string): number[] {
  return input.match(/\d+/g)!.map(Number);
}

export function* eachWindow<T>(
  items: Iterable<T>,
  length: number,
): IterableIterator<T[]> {
  let window: T[] = [];
  for (const item of items) {
    window = window.concat(item);
    if (window.length === length) {
      yield window;
      window = window.slice(1);
    }
  }
}

export function sum(values: Iterable<number>): number {
  let result = 0;
  for (const value of values) {
    result += value;
  }
  return result;
}

export function countIncreases(depths: Iterable<number>): number {
  let count = 0;
  for (const [prev, curr] of eachWindow(depths, 2)) {
    if (curr > prev) {
      count++;
    }
  }
  return count;
}
