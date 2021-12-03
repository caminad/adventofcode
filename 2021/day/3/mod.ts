export type Bit = 0 | 1;

export function parseDiagnostics(input: string): Bit[][] {
  return input.match(/[01]+/g)!.map((row) =>
    Array.from(row, (c) => c === "1" ? 1 : 0)
  );
}

export function countColBits(
  rows: Bit[][],
  index: number,
): Record<Bit, number> {
  const counts = { 0: 0, 1: 0 };
  rows.map((row) => row[index]).forEach((bit) => {
    counts[bit]++;
  });
  return counts;
}

export function bitsToNumber(bits: Bit[]): number {
  let value = 0;
  for (const bit of bits) {
    value = (value << 1) + bit;
  }
  return value;
}

export function getGammaRate(diagnostics: Bit[][]): number {
  const bits = Array.from(diagnostics[0].keys(), (index) => {
    const counts = countColBits(diagnostics, index);
    return counts[1] > counts[0] ? 1 : 0;
  });
  return bitsToNumber(bits);
}

export function getEpsilonRate(diagnostics: Bit[][]): number {
  const bits = Array.from(diagnostics[0].keys(), (index) => {
    const counts = countColBits(diagnostics, index);
    return counts[1] > counts[0] ? 0 : 1;
  });
  return bitsToNumber(bits);
}

export function getPowerConsumption(diagnostics: Bit[][]): number {
  return getGammaRate(diagnostics) * getEpsilonRate(diagnostics);
}

export function findOxygenGeneratorRating(diagnostics: Bit[][]): number {
  for (const index of diagnostics[0].keys()) {
    const counts = countColBits(diagnostics, index);
    const bit = counts[1] >= counts[0] ? 1 : 0;
    diagnostics = diagnostics.filter((row) => row[index] === bit);
    if (diagnostics.length === 1) {
      return bitsToNumber(diagnostics[0]);
    }
  }
  return NaN;
}

export function findCO2ScrubberRating(diagnostics: Bit[][]): number {
  for (const index of diagnostics[0].keys()) {
    const counts = countColBits(diagnostics, index);
    const bit = counts[1] >= counts[0] ? 0 : 1;
    diagnostics = diagnostics.filter((row) => row[index] === bit);
    if (diagnostics.length === 1) {
      return bitsToNumber(diagnostics[0]);
    }
  }
  return NaN;
}

export function getLifeSupportRating(diagnostics: Bit[][]): number {
  return findOxygenGeneratorRating(diagnostics) *
    findCO2ScrubberRating(diagnostics);
}
