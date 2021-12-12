export class Heightmap implements Iterable<number[]> {
  #rows: number[][] = [];

  static parse(input: string) {
    const heightmap = new Heightmap();
    for (const [digits] of input.matchAll(/\d+/g)) {
      heightmap.#rows.push(Array.from(digits, Number));
    }
    return heightmap;
  }

  [Symbol.iterator]() {
    return this.#rows.values();
  }

  *getLowPoints(): IterableIterator<number> {
    for (const [y, row] of this.#rows.entries()) {
      const prev = this.#rows[y - 1];
      const next = this.#rows[y + 1];
      for (const [x, value] of row.entries()) {
        if (
          value < (prev?.[x] ?? 9) &&
          value < (row[x - 1] ?? 9) &&
          value < (row[x + 1] ?? 9) &&
          value < (next?.[x] ?? 9)
        ) {
          yield value;
        }
      }
    }
  }

  getRiskLevel() {
    let result = 0;
    for (const lowPoint of this.getLowPoints()) {
      result += lowPoint + 1;
    }
    return result;
  }
}
