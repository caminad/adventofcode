export interface Coords {
  readonly x: number;
  readonly y: number;
}

export type Line = [start: Coords, end: Coords];

export function* parseInput(input: string): IterableIterator<Line> {
  const ordinates = input.match(/\d+/g)!.map(Number);
  for (let i = 0; i < ordinates.length; i += 4) {
    const [x1, y1, x2, y2] = ordinates.slice(i, i + 4);
    yield [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  }
}

export class DensityMap implements Iterable<number> {
  readonly #rows: number[][] = [[0]];

  static create(...lines: Line[]): DensityMap {
    const map = new DensityMap();
    for (const [start, end] of lines) {
      map.plot(start, end);
    }
    return map;
  }

  inc(x: number, y: number): this {
    while (this.#rows.length <= y) {
      this.#rows.push(Array.from(this.#rows[0]).fill(0));
    }
    while (this.#rows[0].length <= x) {
      this.#rows.forEach((row) => row.push(0));
    }
    this.#rows[y][x]++;
    return this;
  }

  plot(start: Coords, end: Coords): this {
    const slope = (end.y - start.y) / (end.x - start.x);
    const intercept = start.y - slope * start.x;
    const min = { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y) };
    const max = { x: Math.max(start.x, end.x), y: Math.max(start.y, end.y) };
    for (let x = min.x; x <= max.x; x++) {
      for (let y = min.y; y <= max.y; y++) {
        if (!Number.isFinite(slope) || y === slope * x + intercept) {
          this.inc(x, y);
        }
      }
    }
    return this;
  }

  toString() {
    const lines = this.#rows.map((row) => row.map((n) => n || "."));
    return lines.map((line) => line.join("")).join("\n");
  }

  *[Symbol.iterator]() {
    for (const row of this.#rows) {
      yield* row;
    }
  }
}
