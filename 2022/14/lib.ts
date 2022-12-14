type Coords = readonly [x: bigint, y: bigint];

type Path = Coords[];

export function* parse(input: string): IterableIterator<Path> {
  let path: Path | undefined;
  for (const [s, a, b] of input.matchAll(/(\d+),(\d+)|$/mg)) {
    if (s) {
      path ??= [];
      path.push([BigInt(a), BigInt(b)]);
    } else if (path) {
      yield path;
      path = undefined;
    }
  }
}

export class CoordSet {
  readonly #map = new Map<bigint, Set<bigint>>();

  constructor(paths: Iterable<Path>) {
    for (const path of paths) {
      let from: Coords | undefined;
      for (const to of path) {
        if (from) {
          this.#addRect(from, to);
        }
        from = to;
      }
    }
  }

  #addRect([x0, y0]: Coords, [x1, y1]: Coords): void {
    if (x0 > x1) {
      return this.#addRect([x1, y0], [x0, y1]);
    }
    if (y0 > y1) {
      return this.#addRect([x0, y1], [x1, y0]);
    }
    for (let x = x0; x <= x1; x++) {
      let col = this.#map.get(x);
      if (!col) {
        col = new Set();
        this.#map.set(x, col);
      }
      for (let y = y0; y <= y1; y++) {
        col.add(y);
      }
    }
  }

  #has(x: bigint, y: bigint): boolean {
    const col = this.#map.get(x);
    if (!col) {
      return false;
    }
    return col.has(y);
  }

  *render({ limits }: { limits: [Coords, Coords] }): IterableIterator<string> {
    const [[x0, y0], [x1, y1]] = limits;
    for (let y = y0; y <= y1; y++) {
      let line = "";
      for (let x = x0; x <= x1; x++) {
        if (this.#has(x, y)) {
          line += "#";
        } else {
          line += ".";
        }
      }
      yield line;
    }
  }
}
