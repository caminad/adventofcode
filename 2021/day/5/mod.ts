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

export class DensityMap {
  readonly #rows: Map<number, Map<number, number>> = new Map();
  #width = 0;
  #height = 0;
  #crossings = 0;

  static create(...lines: Line[]): DensityMap {
    const map = new DensityMap();
    for (const [start, end] of lines) {
      map.plot(start, end);
    }
    return map;
  }

  inc(x: number, y: number): this {
    let row = this.#rows.get(y);
    if (!row) {
      row = new Map<number, number>();
      this.#rows.set(y, row);
    }
    const count = (row.get(x) ?? 0) + 1;
    row.set(x, count);
    if (x >= this.#width) this.#width = x + 1;
    if (y >= this.#height) this.#height = y + 1;
    if (count === 2) this.#crossings++;
    return this;
  }

  plot(start: Coords, end: Coords): this {
    const min = { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y) };
    const max = { x: Math.max(start.x, end.x), y: Math.max(start.y, end.y) };
    if (start.y === end.y) {
      for (let x = min.x; x <= max.x; x++) {
        this.inc(x, start.y);
      }
    } else if (start.x === end.x) {
      for (let y = min.y; y <= max.y; y++) {
        this.inc(start.x, y);
      }
    } else {
      const slope = (end.y - start.y) / (end.x - start.x);
      const intercept = start.y - slope * start.x;
      for (let x = min.x; x <= max.x; x++) {
        this.inc(x, slope * x + intercept);
      }
    }
    return this;
  }

  toString() {
    let result = "";
    for (let y = 0; y < this.#height; y++) {
      if (result) result += "\n";
      const row = this.#rows.get(y);
      if (row) {
        for (let x = 0; x < this.#width; x++) {
          result += row.get(x) ?? ".";
        }
      } else {
        result += ".".repeat(this.#width);
      }
    }
    return result;
  }

  get crossings() {
    return this.#crossings;
  }
}
