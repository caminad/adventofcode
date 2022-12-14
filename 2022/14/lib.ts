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
  #xsrc = 500n;
  #ymax = 0n;

  constructor(paths: Iterable<Path>) {
    for (const path of paths) {
      let from: Coords | undefined;
      for (const to of path) {
        if (from) {
          this.#add(from, to);
        }
        from = to;
      }
    }
  }

  #add([x0, y0]: Coords, [x1, y1]: Coords = [x0, y0]): void {
    if (x0 > x1) {
      return this.#add([x1, y0], [x0, y1]);
    }
    if (y0 > y1) {
      return this.#add([x0, y1], [x1, y0]);
    }
    for (let x = x0; x <= x1; x++) {
      let col = this.#map.get(x);
      if (!col) {
        col = new Set();
        this.#map.set(x, col);
      }
      for (let y = y0; y <= y1; y++) {
        col.add(y);
        if (y > this.#ymax) {
          this.#ymax = y;
        }
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

  *render(): IterableIterator<string> {
    let x0 = this.#xsrc, x1 = this.#xsrc;
    for (const x of this.#map.keys()) {
      if (x < x0) {
        x0 = x;
      }
      if (x > x1) {
        x1 = x;
      }
    }
    for (let y = 0n; y <= this.#ymax; y++) {
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

  addSand(): boolean {
    if (this.#has(this.#xsrc, 0n)) {
      return false;
    }
    let x = this.#xsrc;
    for (let y = 0n; y <= this.#ymax; y++) {
      if (!this.#has(x, y + 1n)) {
        continue;
      }
      if (!this.#has(x - 1n, y + 1n)) {
        x--;
        continue;
      }
      if (!this.#has(x + 1n, y + 1n)) {
        x++;
        continue;
      }
      this.#add([x, y]);
      return true;
    }
    return false;
  }

  addFloor(): void {
    const y = this.#ymax + 2n;
    this.#add([this.#xsrc - y, y], [this.#xsrc + y, y]);
  }
}
