type Bit = 0 | 1;

export function parseDiagnostics(input: string): Bit[][] {
  return input.match(/[01]+/g)!.map((row) =>
    Array.from(row, (c) => c === "1" ? 1 : 0)
  );
}

export function getHighBitCols(rows: Bit[][]): Bit[] {
  return Array.from(rows[0], (_, index) => {
    const col = rows.map((row) => row[index]);
    return col.filter(Boolean).length > (rows.length / 2) ? 1 : 0;
  });
}

export function invertBits(bits: Bit[]): Bit[] {
  return bits.map((bit) => bit ? 0 : 1);
}

export function bitsToNumber(bits: Bit[]): number {
  let value = 0;
  for (const bit of bits) {
    value = (value << 1) + bit;
  }
  return value;
}

export function getRates(diagnostics: Bit[][]): {
  gamma: number;
  epsilon: number;
} {
  const bits = getHighBitCols(diagnostics);
  return {
    gamma: bitsToNumber(bits),
    epsilon: bitsToNumber(invertBits(bits)),
  };
}
