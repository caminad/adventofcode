export function parseDiagnostics(input: string): number[] {
  return input.match(/[01]+/g)!.map((bits) => Number.parseInt(bits, 2));
}

export function* getBitIndexes(value: number): IterableIterator<number> {
  for (let index = 0; value > 0; index++, value >>= 1) {
    if (value & 1) yield index;
  }
}

export function countBits(diagnostics: number[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const value of diagnostics) {
    for (const index of getBitIndexes(value)) {
      counts.set(index, (counts.get(index) ?? 0) + 1);
    }
  }
  return counts;
}

export function getMajorityBits(
  size: number,
  counts: Map<number, number>,
): { 0: number; 1: number } {
  const result = { 0: 0, 1: 0 };
  for (const [index, count] of counts) {
    result[count > size / 2 ? 1 : 0] |= 1 << index;
  }
  return result;
}

export function getPowerConsumption(diagnostics: number[]): number {
  const counts = countBits(diagnostics);
  const {
    0: gammaRate,
    1: epsilonRate,
  } = getMajorityBits(diagnostics.length, counts);
  return gammaRate * epsilonRate;
}
